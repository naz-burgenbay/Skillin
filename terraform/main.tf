terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 4.0"
    }
  }
}

provider "azurerm" {
  features {}
  subscription_id = "d0491caa-9714-4f3a-a5bb-cde7e5e461a2"
}

# ==================== RESOURCE GROUP ====================
resource "azurerm_resource_group" "rg" {
  name     = "skillin-rg"
  location = "swedencentral"
}

# ==================== AZURE SQL SERVER ====================
resource "azurerm_mssql_server" "sql_server" {
  name                         = "skillin-sqlserver-v1"
  resource_group_name          = azurerm_resource_group.rg.name
  location                     = azurerm_resource_group.rg.location
  version                      = "12.0"
  administrator_login          = "sqladmin"
  administrator_login_password = "Skillin_db_123!"
  minimum_tls_version          = "1.2"
}

# ==================== AZURE SQL DATABASE (SERVERLESS) ====================
resource "azurerm_mssql_database" "sql_db" {
  name      = "skillin-db"
  server_id = azurerm_mssql_server.sql_server.id
  collation = "SQL_Latin1_General_CP1_CI_AS"

  sku_name                    = "GP_S_Gen5_1"
  min_capacity                = 0.5
  auto_pause_delay_in_minutes = 60
  max_size_gb                 = 2
}

# ==================== FIREWALL RULES ====================
resource "azurerm_mssql_firewall_rule" "allow_azure_services" {
  name             = "AllowAzureServices"
  server_id        = azurerm_mssql_server.sql_server.id
  start_ip_address = "0.0.0.0"
  end_ip_address   = "0.0.0.0"
}

resource "azurerm_mssql_firewall_rule" "allow_all_ips" {
  name             = "AllowAll"
  server_id        = azurerm_mssql_server.sql_server.id
  start_ip_address = "0.0.0.0"
  end_ip_address   = "255.255.255.255"
}

# ==================== KEY VAULT ====================
data "azurerm_client_config" "current" {}

resource "azurerm_key_vault" "kv" {
  name                        = "skillin-kv"
  location                    = azurerm_resource_group.rg.location
  resource_group_name         = azurerm_resource_group.rg.name
  tenant_id                   = data.azurerm_client_config.current.tenant_id
  sku_name                    = "standard"
  enabled_for_disk_encryption = true
  soft_delete_retention_days  = 7
  purge_protection_enabled    = false
}

resource "azurerm_key_vault_access_policy" "current_user" {
  key_vault_id = azurerm_key_vault.kv.id
  tenant_id    = data.azurerm_client_config.current.tenant_id
  object_id    = data.azurerm_client_config.current.object_id

  secret_permissions = ["Get", "List", "Set", "Delete"]
}

# ==================== SECRETS IN KEY VAULT ====================
resource "azurerm_key_vault_secret" "db_connection_string" {
  name         = "DatabaseConnectionString"
  value        = "Server=tcp:${azurerm_mssql_server.sql_server.name}.database.windows.net,1433;Initial Catalog=${azurerm_mssql_database.sql_db.name};User ID=sqladmin;Password=Skillin_db_123!;Encrypt=True;TrustServerCertificate=False;"
  key_vault_id = azurerm_key_vault.kv.id

  depends_on = [azurerm_key_vault_access_policy.current_user]
}

resource "azurerm_key_vault_secret" "storage_connection_string" {
  name         = "StorageConnectionString"
  value        = azurerm_storage_account.storage.primary_connection_string
  key_vault_id = azurerm_key_vault.kv.id

  depends_on = [azurerm_key_vault_access_policy.current_user]
}

# ==================== APP SERVICE PLAN ====================
resource "azurerm_service_plan" "backend_plan" {
  name                = "skillin-backend-plan"
  resource_group_name = azurerm_resource_group.rg.name
  location            = azurerm_resource_group.rg.location
  os_type             = "Linux"
  sku_name            = "B1"
}

# ==================== APP SERVICE (WEB APP) ====================
resource "azurerm_linux_web_app" "backend_app" {
  name                = "skillin-backend"
  resource_group_name = azurerm_resource_group.rg.name
  location            = azurerm_resource_group.rg.location
  service_plan_id     = azurerm_service_plan.backend_plan.id

  identity {
    type = "SystemAssigned"
  }

  site_config {
    application_stack {
      dotnet_version = "8.0"
    }
    always_on = false
  }

    app_settings = {
    ASPNETCORE_ENVIRONMENT                 = "Production"
    "ConnectionStrings__DefaultConnection" = "@Microsoft.KeyVault(SecretUri=https://${azurerm_key_vault.kv.name}.vault.azure.net/secrets/DatabaseConnectionString/)"

    # Blob Storage
    "AzureBlob__StorageAccountName" = azurerm_storage_account.storage.name
    "AzureBlob__ContainerName"      = azurerm_storage_container.uploads.name
    "AzureBlob__ConnectionString"   = "@Microsoft.KeyVault(SecretUri=https://${azurerm_key_vault.kv.name}.vault.azure.net/secrets/StorageConnectionString/)"
  }
}

resource "azurerm_key_vault_access_policy" "backend_app_access" {
  key_vault_id = azurerm_key_vault.kv.id
  tenant_id    = azurerm_linux_web_app.backend_app.identity[0].tenant_id
  object_id    = azurerm_linux_web_app.backend_app.identity[0].principal_id

  secret_permissions = ["Get", "List"]
}

# ==================== BLOB STORAGE ====================
resource "azurerm_storage_account" "storage" {
  name                     = "skillinstorage"
  resource_group_name      = azurerm_resource_group.rg.name
  location                 = azurerm_resource_group.rg.location
  account_tier             = "Standard"
  account_replication_type = "LRS"
}

resource "azurerm_storage_container" "uploads" {
  name                  = "uploads"
  storage_account_id    = azurerm_storage_account.storage.id
  container_access_type = "private"
}

# ==================== OUTPUTS ====================
output "resource_group_name" {
  value = azurerm_resource_group.rg.name
}

output "sql_server_fqdn" {
  value = azurerm_mssql_server.sql_server.fully_qualified_domain_name
}

output "sql_database_name" {
  value = azurerm_mssql_database.sql_db.name
}

output "key_vault_name" {
  value = azurerm_key_vault.kv.name
}

output "db_connection_string_secret_name" {
  value = azurerm_key_vault_secret.db_connection_string.name
}

output "backend_app_url" {
  value = "https://${azurerm_linux_web_app.backend_app.name}.azurewebsites.net"
}

output "backend_app_name" {
  value = azurerm_linux_web_app.backend_app.name
}

output "storage_account_name" {
  value = azurerm_storage_account.storage.name
}

output "storage_container_name" {
  value = azurerm_storage_container.uploads.name
}
