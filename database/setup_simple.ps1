# Simple Database Setup for SMART Connect
# This creates the database if PostgreSQL is running

Write-Host "Setting up SMART Connect Database..." -ForegroundColor Green

# Database configuration
$DbName = "smart_connect"
$DbUser = "smart_connect_user"
$DbPassword = "SmartConnect2024!"
$DbHost = "localhost"
$DbPort = "5432"

# Check if PostgreSQL is running
Write-Host "Checking PostgreSQL service..." -ForegroundColor Yellow

try {
    $result = pg_isready -h $DbHost -p $DbPort 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ PostgreSQL is running" -ForegroundColor Green
    } else {
        Write-Host "✗ PostgreSQL is not running. Please start PostgreSQL service." -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "✗ PostgreSQL tools not found. Please install PostgreSQL and add to PATH." -ForegroundColor Red
    exit 1
}

# Create database and user using psql
Write-Host "Creating database and user..." -ForegroundColor Yellow

$env:PGPASSWORD = "postgres"  # Default postgres password

# Create database
$createDbCmd = "CREATE DATABASE $DbName;"
try {
    $result = echo $createDbCmd | psql -h $DbHost -p $DbPort -U postgres 2>$null
    Write-Host "✓ Database created (or already exists)" -ForegroundColor Green
} catch {
    Write-Host "⚠ Database may already exist" -ForegroundColor Yellow
}

# Create user
$createUserCmd = "CREATE USER $DbUser WITH ENCRYPTED PASSWORD '$DbPassword'; GRANT ALL PRIVILEGES ON DATABASE $DbName TO $DbUser; ALTER USER $DbUser CREATEDB;"
try {
    $result = echo $createUserCmd | psql -h $DbHost -p $DbPort -U postgres 2>$null
    Write-Host "✓ User created (or already exists)" -ForegroundColor Green
} catch {
    Write-Host "⚠ User may already exist" -ForegroundColor Yellow
}

# Set environment for database operations
$env:PGPASSWORD = $DbPassword

# Create tables using the SQL file
Write-Host "Creating tables..." -ForegroundColor Yellow
$schemaFile = Join-Path $PSScriptRoot "create_tables_updated.sql"

if (Test-Path $schemaFile) {
    try {
        $result = psql -h $DbHost -p $DbPort -U $DbUser -d $DbName -f $schemaFile 2>$null
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✓ Tables created successfully" -ForegroundColor Green
        } else {
            Write-Host "⚠ Some tables may already exist" -ForegroundColor Yellow
        }
    } catch {
        Write-Host "✗ Failed to create tables" -ForegroundColor Red
    }
} else {
    Write-Host "✗ Schema file not found: $schemaFile" -ForegroundColor Red
}

# Insert sample data
Write-Host "Inserting sample data..." -ForegroundColor Yellow
$sampleDataFile = Join-Path $PSScriptRoot "seeds\sample_data.sql"

if (Test-Path $sampleDataFile) {
    try {
        $result = psql -h $DbHost -p $DbPort -U $DbUser -d $DbName -f $sampleDataFile 2>$null
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✓ Sample data inserted" -ForegroundColor Green
        } else {
            Write-Host "⚠ Sample data may already exist" -ForegroundColor Yellow
        }
    } catch {
        Write-Host "⚠ Failed to insert sample data (optional)" -ForegroundColor Yellow
    }
} else {
    Write-Host "⚠ Sample data file not found (optional)" -ForegroundColor Yellow
}

# Verify installation
Write-Host "Verifying installation..." -ForegroundColor Yellow
try {
    $result = echo "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'capstone';" | psql -h $DbHost -p $DbPort -U $DbUser -d $DbName -t 2>$null
    $tableCount = [int]($result.Trim())
    
    if ($tableCount -gt 0) {
        Write-Host "✓ Database setup verified - Found $tableCount tables" -ForegroundColor Green
        
        # Show connection details
        Write-Host ""
        Write-Host "=== DATABASE CONNECTION DETAILS ===" -ForegroundColor Cyan
        Write-Host "Host: $DbHost"
        Write-Host "Port: $DbPort"
        Write-Host "Database: $DbName"
        Write-Host "User: $DbUser"
        Write-Host "Password: $DbPassword"
        Write-Host "Schema: capstone"
        Write-Host ""
        Write-Host "Connection URL: postgresql://$DbUser`:$DbPassword@$DbHost`:$DbPort/$DbName"
        Write-Host ""
        
        # List tables
        Write-Host "=== AVAILABLE TABLES ===" -ForegroundColor Cyan
        $result = echo "SELECT table_name FROM information_schema.tables WHERE table_schema = 'capstone' ORDER BY table_name;" | psql -h $DbHost -p $DbPort -U $DbUser -d $DbName 2>$null
        Write-Host $result
        
    } else {
        Write-Host "✗ No tables found in capstone schema" -ForegroundColor Red
    }
} catch {
    Write-Host "✗ Failed to verify installation" -ForegroundColor Red
}

# Clean up environment
$env:PGPASSWORD = $null

Write-Host ""
Write-Host "=== SETUP COMPLETE ===" -ForegroundColor Green
Write-Host "Next steps:"
Write-Host "1. Update your .env file with the database settings above"
Write-Host "2. Start your FastAPI backend on port 8001"
Write-Host "3. Test the database connection"