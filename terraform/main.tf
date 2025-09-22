resource "azurerm_resource_group" "rg" {
  name     = var.resource_group_name
  location = var.location
}


resource "azurerm_service_plan" "app_plan" {
  name                = var.azurerm_service_plan_name
  resource_group_name = azurerm_resource_group.rg.name
  location            = azurerm_resource_group.rg.location
  os_type             = "Linux"
  sku_name            = "F1"
}

#App Service для беку
resource "azurerm_linux_web_app" "backend" {
  name                = var.azurerm_linux_web_app_name_backend_name
  resource_group_name = azurerm_resource_group.rg.name
  location            = azurerm_resource_group.rg.location
  service_plan_id     = azurerm_service_plan.app_plan.id
  site_config {}
  virtual_network_subnet_id = azurerm_subnet.app_subnet.id
}

#App Service для фронту
resource "azurerm_linux_web_app" "frontend" {
  name                      = var.azurerm_linux_web_app_name_frontend_name
  resource_group_name       = azurerm_resource_group.rg.name
  location                  = azurerm_resource_group.rg.location
  service_plan_id           = azurerm_service_plan.app_plan.id
  virtual_network_subnet_id = azurerm_subnet.app_subnet.id
  site_config {
    always_on = false
  }
}

# --- PostgreSQL Flexible Server ---
resource "azurerm_postgresql_flexible_server" "db_server" {
  name                          = var.azurerm_postgresql_flexible_server_name
  resource_group_name           = azurerm_resource_group.rg.name
  location                      = azurerm_resource_group.rg.location
  version                       = "14"
  administrator_login           = var.db_login
  administrator_password        = var.db_password
  private_dns_zone_id           = azurerm_private_dns_zone.privat_dns.id
  sku_name                      = "B_Standard_B1ms"
  storage_mb                    = 32768
  public_network_access_enabled = false
  delegated_subnet_id           = azurerm_subnet.postgresql_subnet.id

  tags = {
    "Project" = "CulinaryPlatform"
  }
  depends_on = [
    azurerm_subnet.postgresql_subnet,
  ]
}
