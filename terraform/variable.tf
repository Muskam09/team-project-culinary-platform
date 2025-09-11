variable "resource_group_name" {
  description = "The name of the resource group"
  default     = "culinary-platform"
}
variable "location" {
  description = "The name of the resource group"
  default     = "westeurope"
}
variable "db_login" {
  type        = string
  description = "login for PostgreSQL"
  sensitive   = true
}
variable "db_password" {
  type        = string
  description = "Password for PostgreSQL"
  sensitive   = true
}