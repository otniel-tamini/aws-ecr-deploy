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
