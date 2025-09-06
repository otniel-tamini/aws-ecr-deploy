# Copy this file to terraform.tfvars and fill values
aws_region       = "eu-north-1"
project          = "job-portal"
api_image        = "otniel217/aws-ecs-deploy-api:latest"
allowed_origins  = "http://employee-frontend01.s3-website.eu-north-1.amazonaws.com"
docdb_username   = "otniel64"
docdb_password   = "ChangeMe-Strong#2025"
# Optional overrides
# docdb_instance_class = "db.t3.medium"
# docdb_engine_version = "4.0.0"
