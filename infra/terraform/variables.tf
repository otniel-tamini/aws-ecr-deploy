variable "aws_region" { type = string }
variable "project" { type = string }
variable "api_image" { type = string }
variable "allowed_origins" { type = string }
variable "docdb_username" { type = string }
variable "docdb_password" {
  type      = string
  sensitive = true
}
variable "docdb_instance_class" {
  type    = string
  default = "db.t3.medium"
}
variable "docdb_engine_version" {
  type    = string
  default = "4.0.0"
}

# Frontend deploy variables
variable "web_bucket_name" { type = string }
variable "github_actions_role_name" {
  type    = string
  default = "GitHubActionsECSDeploy"
}
variable "cloudfront_distribution_id" {
  type    = string
  default = ""
}
