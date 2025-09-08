locals {
	name = "${var.project}-api"
}

data "aws_availability_zones" "available" {
	state = "available"
}

# VPC
module "vpc" {
	source  = "terraform-aws-modules/vpc/aws"
	version = "5.7.1"

	name = var.project
	cidr = "10.10.0.0/16"

	azs             = slice(data.aws_availability_zones.available.names, 0, 2)
	private_subnets = [for i in range(2) : cidrsubnet("10.10.0.0/16", 8, i)]
	public_subnets  = [for i in range(2, 4) : cidrsubnet("10.10.0.0/16", 8, i)]

		enable_nat_gateway     = true
		single_nat_gateway     = false
		one_nat_gateway_per_az = true

	enable_dns_support   = true
	enable_dns_hostnames = true

	tags = { Project = var.project }
}

# Security groups
resource "aws_security_group" "alb" {
	name        = "${var.project}-alb-sg"
	description = "ALB access"
	vpc_id      = module.vpc.vpc_id

	ingress {
		from_port   = 80
		to_port     = 80
		protocol    = "tcp"
		cidr_blocks = ["0.0.0.0/0"]
	}
	egress {
		from_port   = 0
		to_port     = 0
		protocol    = "-1"
		cidr_blocks = ["0.0.0.0/0"]
	}
}

resource "aws_security_group" "ecs_service" {
	name        = "${var.project}-svc-sg"
	description = "ECS service access from ALB"
	vpc_id      = module.vpc.vpc_id

	ingress {
		from_port       = 8080
		to_port         = 8080
		protocol        = "tcp"
		security_groups = [aws_security_group.alb.id]
	}
	egress {
		from_port   = 0
		to_port     = 0
		protocol    = "-1"
		cidr_blocks = ["0.0.0.0/0"]
	}
}

resource "aws_security_group" "docdb" {
	name        = "${var.project}-docdb-sg"
	description = "DocumentDB access from ECS"
	vpc_id      = module.vpc.vpc_id

	ingress {
		from_port       = 27017
		to_port         = 27017
		protocol        = "tcp"
		security_groups = [aws_security_group.ecs_service.id]
	}
	egress {
		from_port   = 0
		to_port     = 0
		protocol    = "-1"
		cidr_blocks = ["0.0.0.0/0"]
	}
}

# ALB
resource "aws_lb" "api" {
	name               = "${var.project}-alb"
	load_balancer_type = "application"
	security_groups    = [aws_security_group.alb.id]
	subnets            = module.vpc.public_subnets
}

resource "aws_lb_target_group" "api" {
	name     = replace("${var.project}-tg", "_", "-")
	port     = 8080
	protocol = "HTTP"
	vpc_id   = module.vpc.vpc_id
	target_type = "ip"
	health_check {
		path                = "/actuator/health"
		healthy_threshold   = 2
		unhealthy_threshold = 2
		timeout             = 5
		interval            = 30
		matcher             = "200"
	}
}

resource "aws_lb_listener" "http" {
	load_balancer_arn = aws_lb.api.arn
	port              = 80
	protocol          = "HTTP"

	default_action {
		type             = "forward"
		target_group_arn = aws_lb_target_group.api.arn
	}
}

# ECS Cluster & Roles
resource "aws_ecs_cluster" "this" {
	name = "${var.project}-cluster"
}

data "aws_iam_policy_document" "ecs_tasks_assume" {
	statement {
		actions = ["sts:AssumeRole"]
		principals {
			type        = "Service"
			identifiers = ["ecs-tasks.amazonaws.com"]
		}
	}
}

resource "aws_iam_role" "task_exec" {
	name               = "${var.project}-task-exec"
	assume_role_policy = data.aws_iam_policy_document.ecs_tasks_assume.json
}

resource "aws_iam_role_policy_attachment" "task_exec" {
	role       = aws_iam_role.task_exec.name
	policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

# DocumentDB
resource "aws_docdb_subnet_group" "this" {
	name       = "${var.project}-docdb-subnets"
	subnet_ids = module.vpc.private_subnets
}

resource "aws_docdb_cluster" "this" {
	cluster_identifier      = "${var.project}-docdb"
	master_username         = var.docdb_username
	master_password         = var.docdb_password
	db_subnet_group_name    = aws_docdb_subnet_group.this.name
	vpc_security_group_ids  = [aws_security_group.docdb.id]
	engine_version          = var.docdb_engine_version
	backup_retention_period = 1
	deletion_protection     = false
	skip_final_snapshot     = true
}

resource "aws_docdb_cluster_instance" "this" {
	count              = 2
	identifier         = "${var.project}-docdb-${count.index}"
	cluster_identifier = aws_docdb_cluster.this.id
	instance_class     = var.docdb_instance_class
	availability_zone  = element(slice(data.aws_availability_zones.available.names, 0, 2), count.index)
}

# Logs
resource "aws_cloudwatch_log_group" "api" {
	name              = "/ecs/${local.name}"
	retention_in_days = 7
}

# ECS Task Definition & Service
resource "aws_ecs_task_definition" "api" {
	family                   = local.name
	requires_compatibilities = ["FARGATE"]
	network_mode             = "awsvpc"
	cpu                      = "512"
	memory                   = "1024"
	execution_role_arn       = aws_iam_role.task_exec.arn

	container_definitions = jsonencode([
		{
			name      = "api"
			image     = var.api_image
			essential = true
			portMappings = [{ containerPort = 8080, protocol = "tcp" }]
			environment = [
				{ name = "SERVER_PORT", value = "8080" },
				{ name = "SPRING_DATA_MONGODB_DATABASE", value = "job_portal_db" },
				{ name = "APP_CORS_ALLOWED_ORIGINS", value = var.allowed_origins },
				{ name = "SPRING_DATA_MONGODB_URI", value = "mongodb://${var.docdb_username}:${var.docdb_password}@${aws_docdb_cluster.this.endpoint}:27017/job_portal_db?ssl=true&replicaSet=rs0&readPreference=secondaryPreferred&retryWrites=false" }
			]
			logConfiguration = {
				logDriver = "awslogs"
				options = {
					awslogs-group         = "/ecs/${local.name}"
					awslogs-region        = var.aws_region
					awslogs-stream-prefix = "ecs"
				}
			}
		}
	])
}

resource "aws_ecs_service" "api" {
	name            = local.name
	cluster         = aws_ecs_cluster.this.id
	task_definition = aws_ecs_task_definition.api.arn
	launch_type     = "FARGATE"
	desired_count   = 2
	health_check_grace_period_seconds = 60

	network_configuration {
		subnets          = module.vpc.private_subnets
		security_groups  = [aws_security_group.ecs_service.id]
		assign_public_ip = false
	}

	load_balancer {
		target_group_arn = aws_lb_target_group.api.arn
		container_name   = "api"
		container_port   = 8080
	}

	depends_on = [
		aws_lb_listener.http,
		aws_docdb_cluster.this,
		aws_docdb_cluster_instance.this
	]
}

output "alb_dns_name" {
	value = aws_lb.api.dns_name
}

output "docdb_endpoint" {
	value = aws_docdb_cluster.this.endpoint
}
