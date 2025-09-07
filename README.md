## Job Portal App — Learning deployment (based on Mahmud-Alam’s project)

This repository is a personal learning exercise to deploy a full‑stack app to AWS using containers, Terraform, and GitHub Actions.

Attribution: The application code (backend + frontend) is based on Mahmud Alam’s project “spring-boot-job-portal-app”. Original repository:

- https://github.com/Mahmud-Alam/spring-boot-job-portal-app

All application credit goes to the original author. I adapted the project for deployability and added cloud infrastructure and CI/CD around it.

---

### What I added on top

- Containerization: backend Dockerfile and .dockerignore
- Config externalization (Spring Boot): PORT, MONGODB_URI, MONGODB_DATABASE, ALLOWED_ORIGINS
- CORS: global config driven by env
- Search compatibility: fallback to regex when DocumentDB doesn’t support $text
- Infrastructure as Code (Terraform):
  - VPC with public/private subnets (2 AZ), NAT, security groups
  - Application Load Balancer (HTTP 80)
  - ECS Fargate cluster + service (ip target type)
  - Amazon DocumentDB cluster + instances
  - CloudWatch Logs
- CI/CD (GitHub Actions):
  - Backend: build Docker image → push to ECR → update ECS service
  - Frontend: build Vite → sync dist/ to S3 (optional CloudFront invalidation)

---

### Architecture (high level)

- ALB (public) → ECS Fargate service (private subnets) → Spring Boot API
- API connects to Amazon DocumentDB (Mongo-compatible)
- Frontend static site hosted in S3 (optional CloudFront)

---

### Local development (brief)

- Backend
  - Java 17, Maven Wrapper is included: `./mvnw -DskipTests package`
  - Config via `backend/src/main/resources/application.properties`
  - Health: `/actuator/health`, Swagger: `/swagger-ui.html`

- Frontend
  - Node 20 recommended: `npm ci && npm run dev` in `frontend/`

---

### CI/CD setup (GitHub Actions)

Create an AWS IAM role assumable via GitHub OIDC and set these in the repo:

- Secret
  - `AWS_ROLE_ARN` — ARN of the IAM role for Actions

- Variables
  - `AWS_REGION` (e.g., eu-north-1)
  - `ECR_REPOSITORY` (e.g., aws-ecs-deploy-api)
  - `ECS_CLUSTER_NAME` (e.g., job-portal-cluster)
  - `ECS_SERVICE_NAME` (e.g., job-portal-api)
  - `WEB_BUCKET_NAME` (S3 bucket for frontend)
  - `CLOUDFRONT_DISTRIBUTION_ID` (optional)

Workflows:

- `.github/workflows/backend-ecs.yml` — builds/pushes the API image and rolls ECS
- `.github/workflows/frontend-s3.yml` — builds the frontend and syncs to S3

---

### Terraform (optional)

The `infra/terraform` folder contains a reproducible stack for VPC/ALB/ECS/DocDB.

Basic flow:
- `terraform init`
- `terraform plan`
- `terraform apply`

Clean-up:
- `terraform destroy` (DocumentDB is configured with `skip_final_snapshot = true` to allow teardown during learning)

Notes:
- DocumentDB doesn’t support Mongo `$text`; the API falls back to case‑insensitive regex.
- Costs apply (NAT, ALB, ECS, DocDB). Destroy when not in use.

---

### Credits & License

- Original application: Mahmud Alam — https://github.com/Mahmud-Alam/spring-boot-job-portal-app
- This repository adds infrastructure and CI/CD scaffolding for learning purposes only.
