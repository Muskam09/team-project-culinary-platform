variable "resource_group_name" {
  description = "The name of the resource group"
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

variable "azurerm_service_plan_name" {
  description = "The name of the resource group"
}

variable "azurerm_linux_web_app_name_backend_name" {
  description = "The name of the resource group"
}
variable "azurerm_linux_web_app_name_frontend_name" {
  description = "The name of the resource group"
}

variable "azurerm_postgresql_flexible_server_name" {
  description = "The name of the resource group"
}
