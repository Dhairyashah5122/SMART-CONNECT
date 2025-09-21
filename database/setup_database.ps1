# SMART Connect Database Setup Script for Windows PowerShell
# MIT License - Westcliff University Property
# This script sets up the complete PostgreSQL database for production on Windows

param(
    [string]$DbName = "smart_connect",
    [string]$DbUser = "smart_connect_user", 
    [string]$DbSchema = "capstone",
    [string]$DbHost = "localhost",
    [string]$DbPort = "5432",
    [string]$DbPassword = "SmartConnect2024!",
    [string]$AdminUser = "postgres",
    [string]$AdminPassword = "",
    [switch]$Force
)

# Color functions for output
function Write-ColorOutput {
    param(
        [string]$Message,
        [string]$Color = "White"
    )
    
    $colorMap = @{
        "Red" = "Red"
        "Green" = "Green" 
        "Yellow" = "Yellow"
        "Blue" = "Cyan"
        "White" = "White"
    }
    
    Write-Host $Message -ForegroundColor $colorMap[$Color]
}

function Write-Header {
    param([string]$Text)
    Write-ColorOutput "========================================" "Blue"
    Write-ColorOutput "  $Text" "Blue"
    Write-ColorOutput "========================================" "Blue"
    Write-Host ""
}

function Write-Success {
    param([string]$Message)
    Write-ColorOutput "✓ $Message" "Green"
}

function Write-Error {
    param([string]$Message)
    Write-ColorOutput "✗ $Message" "Red"
}

function Write-Warning {
    param([string]$Message)
    Write-ColorOutput "⚠ $Message" "Yellow"
}

function Write-Info {
    param([string]$Message)
    Write-ColorOutput "$Message" "Yellow"
}

# Function to check if PostgreSQL is running
function Test-PostgreSQLConnection {
    Write-Info "Checking PostgreSQL connection..."
    
    try {
        $result = & pg_isready -h $DbHost -p $DbPort 2>$null
        if ($LASTEXITCODE -eq 0) {
            Write-Success "PostgreSQL is running"
            return $true
        } else {
            Write-Error "PostgreSQL is not running or not accessible"
            Write-Host "Please start PostgreSQL service and try again."
            return $false
        }
    } catch {
        Write-Error "pg_isready command not found. Please ensure PostgreSQL is installed and in PATH."
        return $false
    }
}

# Function to execute SQL command
function Invoke-SqlCommand {
    param(
        [string]$Command,
        [string]$Database = "postgres",
        [string]$User = $AdminUser,
        [string]$Password = $AdminPassword
    )
    
    $env:PGPASSWORD = $Password
    try {
        $result = & psql -h $DbHost -p $DbPort -U $User -d $Database -c $Command 2>&1
        $env:PGPASSWORD = $null
        
        if ($LASTEXITCODE -eq 0) {
            return $true
        } else {
            Write-Error "SQL command failed: $result"
            return $false
        }
    } catch {
        $env:PGPASSWORD = $null
        Write-Error "Failed to execute SQL command: $($_.Exception.Message)"
        return $false
    }
}

# Function to execute SQL file
function Invoke-SqlFile {
    param(
        [string]$FilePath,
        [string]$Database,
        [string]$User,
        [string]$Password
    )
    
    if (-not (Test-Path $FilePath)) {
        Write-Error "SQL file not found: $FilePath"
        return $false
    }
    
    $env:PGPASSWORD = $Password
    try {
        $result = & psql -h $DbHost -p $DbPort -U $User -d $Database -f $FilePath 2>&1
        $env:PGPASSWORD = $null
        
        if ($LASTEXITCODE -eq 0) {
            return $true
        } else {
            Write-Error "SQL file execution failed: $result"
            return $false
        }
    } catch {
        $env:PGPASSWORD = $null
        Write-Error "Failed to execute SQL file: $($_.Exception.Message)"
        return $false
    }
}

# Function to create database and user
function New-DatabaseAndUser {
    Write-Info "Creating database and user..."
    
    # Create database
    $createDbCommand = "SELECT 'CREATE DATABASE $DbName' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = '$DbName')\\gexec"
    
    # Create user
    $createUserCommand = @"
DO `$`$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = '$DbUser') THEN
        CREATE USER $DbUser WITH ENCRYPTED PASSWORD '$DbPassword';
    END IF;
END
`$`$;

GRANT ALL PRIVILEGES ON DATABASE $DbName TO $DbUser;
ALTER USER $DbUser CREATEDB;
"@
    
    if ((Invoke-SqlCommand -Command $createDbCommand) -and (Invoke-SqlCommand -Command $createUserCommand)) {
        Write-Success "Database and user created successfully"
        return $true
    } else {
        Write-Error "Failed to create database or user"
        return $false
    }
}

# Function to create schema and tables
function New-DatabaseSchema {
    Write-Info "Creating database schema..."
    
    # Create schema first
    $createSchemaCommand = @"
CREATE SCHEMA IF NOT EXISTS $DbSchema;
GRANT ALL ON SCHEMA $DbSchema TO $DbUser;
GRANT USAGE ON SCHEMA $DbSchema TO $DbUser;
"@
    
    if (-not (Invoke-SqlCommand -Command $createSchemaCommand -Database $DbName -User $DbUser -Password $DbPassword)) {
        Write-Error "Failed to create schema"
        return $false
    }
    
    # Run the main schema file
    Write-Info "Running main schema file..."
    $schemaFile = Join-Path $PSScriptRoot "create_tables_updated.sql"
    
    if (Invoke-SqlFile -FilePath $schemaFile -Database $DbName -User $DbUser -Password $DbPassword) {
        Write-Success "Schema created successfully"
        return $true
    } else {
        Write-Error "Failed to create schema"
        return $false
    }
}

# Function to create indexes for performance
function New-PerformanceIndexes {
    Write-Info "Creating performance indexes..."
    
    $indexCommand = @"
SET search_path TO $DbSchema;

-- Performance indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_students_status ON students(status);
CREATE INDEX IF NOT EXISTS idx_students_program ON students(program);
CREATE INDEX IF NOT EXISTS idx_students_gpa ON students(gpa);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_company_id ON projects(company_id);
CREATE INDEX IF NOT EXISTS idx_surveys_status ON surveys(status);
CREATE INDEX IF NOT EXISTS idx_survey_responses_survey_id ON survey_responses(survey_id);
CREATE INDEX IF NOT EXISTS idx_survey_responses_user_id ON survey_responses(user_id);

-- JSONB indexes for skills
CREATE INDEX IF NOT EXISTS idx_students_skills_gin ON students USING GIN(skills);
CREATE INDEX IF NOT EXISTS idx_mentors_skills_gin ON mentors USING GIN(skills);

-- Full text search indexes
CREATE INDEX IF NOT EXISTS idx_students_resume_fts ON students USING GIN(to_tsvector('english', COALESCE(resume_text, '')));
CREATE INDEX IF NOT EXISTS idx_projects_desc_fts ON projects USING GIN(to_tsvector('english', COALESCE(description, '')));
"@
    
    if (Invoke-SqlCommand -Command $indexCommand -Database $DbName -User $DbUser -Password $DbPassword) {
        Write-Success "Indexes created successfully"
        return $true
    } else {
        Write-Error "Failed to create indexes"
        return $false
    }
}

# Function to insert sample data
function Add-SampleData {
    Write-Info "Inserting sample data..."
    
    $sampleDataFile = Join-Path $PSScriptRoot "seeds\sample_data.sql"
    
    if (Invoke-SqlFile -FilePath $sampleDataFile -Database $DbName -User $DbUser -Password $DbPassword) {
        Write-Success "Sample data inserted successfully"
        return $true
    } else {
        Write-Warning "Sample data insertion failed (this is optional)"
        return $false
    }
}

# Function to create database functions
function New-DatabaseFunctions {
    Write-Info "Creating database functions and triggers..."
    
    $functionsCommand = @"
SET search_path TO $DbSchema;

-- Function to update timestamp
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS `$`$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
`$`$ language 'plpgsql';

-- Trigger for users table
DROP TRIGGER IF EXISTS set_timestamp ON users;
CREATE TRIGGER set_timestamp
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

-- Function to calculate student GPA stats
CREATE OR REPLACE FUNCTION calculate_gpa_stats()
RETURNS TABLE(
    avg_gpa NUMERIC(3,2),
    min_gpa NUMERIC(3,2),
    max_gpa NUMERIC(3,2),
    student_count BIGINT
) AS `$`$
BEGIN
    RETURN QUERY
    SELECT 
        ROUND(AVG(s.gpa), 2) as avg_gpa,
        MIN(s.gpa) as min_gpa,
        MAX(s.gpa) as max_gpa,
        COUNT(*) as student_count
    FROM students s
    WHERE s.gpa IS NOT NULL AND s.status = 'Approved';
END;
`$`$ LANGUAGE plpgsql;
"@
    
    if (Invoke-SqlCommand -Command $functionsCommand -Database $DbName -User $DbUser -Password $DbPassword) {
        Write-Success "Database functions created successfully"
        return $true
    } else {
        Write-Error "Failed to create database functions"
        return $false
    }
}

# Function to verify installation
function Test-Installation {
    Write-Info "Verifying installation..."
    
    $verifyCommand = @"
SET search_path TO $DbSchema;
SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = '$DbSchema';
"@
    
    $env:PGPASSWORD = $DbPassword
    try {
        $result = & psql -h $DbHost -p $DbPort -U $DbUser -d $DbName -t -c $verifyCommand 2>$null
        $env:PGPASSWORD = $null
        
        $tableCount = [int]($result.Trim())
        
        if ($tableCount -gt 0) {
            Write-Success "Database installation verified"
            Write-Success "Found $tableCount tables in schema '$DbSchema'"
            
            # Show table list
            Write-Info "Tables created:"
            $listTablesCommand = @"
SET search_path TO $DbSchema;
SELECT table_name FROM information_schema.tables WHERE table_schema = '$DbSchema' ORDER BY table_name;
"@
            $env:PGPASSWORD = $DbPassword
            & psql -h $DbHost -p $DbPort -U $DbUser -d $DbName -c $listTablesCommand 2>$null
            $env:PGPASSWORD = $null
            
            return $true
        } else {
            Write-Error "Database verification failed"
            return $false
        }
    } catch {
        $env:PGPASSWORD = $null
        Write-Error "Database verification failed: $($_.Exception.Message)"
        return $false
    }
}

# Function to create backup script
function New-BackupScript {
    Write-Info "Creating backup script..."
    
    $backupScript = @"
# SMART Connect Database Backup Script for Windows PowerShell

param(
    [string]`$BackupDir = ".\backups",
    [string]`$DbName = "$DbName",
    [string]`$DbUser = "$DbUser",
    [string]`$DbHost = "$DbHost",
    [string]`$DbPort = "$DbPort",
    [string]`$DbPassword = "$DbPassword"
)

`$Date = Get-Date -Format "yyyyMMdd_HHmmss"
if (-not (Test-Path `$BackupDir)) {
    New-Item -ItemType Directory -Path `$BackupDir -Force | Out-Null
}

`$BackupFile = Join-Path `$BackupDir "smart_connect_`$Date.sql"

Write-Host "Creating backup: smart_connect_`$Date.sql"
`$env:PGPASSWORD = `$DbPassword
& pg_dump -h `$DbHost -p `$DbPort -U `$DbUser -d `$DbName > `$BackupFile
`$env:PGPASSWORD = `$null

if (`$LASTEXITCODE -eq 0) {
    Write-Host "✓ Backup created successfully: `$BackupFile" -ForegroundColor Green
    
    # Compress backup
    Compress-Archive -Path `$BackupFile -DestinationPath "`$BackupFile.zip" -Force
    Remove-Item `$BackupFile
    Write-Host "✓ Backup compressed: `$BackupFile.zip" -ForegroundColor Green
    
    # Keep only last 7 backups
    Get-ChildItem `$BackupDir -Filter "smart_connect_*.zip" | 
        Sort-Object LastWriteTime -Descending | 
        Select-Object -Skip 7 | 
        Remove-Item -Force
    Write-Host "✓ Old backups cleaned up" -ForegroundColor Green
} else {
    Write-Host "✗ Backup failed" -ForegroundColor Red
    exit 1
}
"@
    
    $backupScriptPath = Join-Path $PSScriptRoot "backup_database.ps1"
    $backupScript | Out-File -FilePath $backupScriptPath -Encoding UTF8
    
    Write-Success "Backup script created: backup_database.ps1"
}

# Main execution function
function Start-DatabaseSetup {
    Write-Header "SMART Connect Database Setup"
    
    Write-Host "Configuration:"
    Write-Host "  Database: $DbName"
    Write-Host "  User: $DbUser"
    Write-Host "  Schema: $DbSchema" 
    Write-Host "  Host: $DbHost"
    Write-Host "  Port: $DbPort"
    Write-Host ""
    
    if (-not $Force) {
        $response = Read-Host "Continue with database setup? (y/N)"
        if ($response -ne "y" -and $response -ne "Y") {
            Write-Host "Setup cancelled."
            return
        }
    }
    
    # Check prerequisites
    if (-not (Test-PostgreSQLConnection)) {
        return
    }
    
    # Execute setup steps
    $success = $true
    
    if (-not (New-DatabaseAndUser)) { $success = $false }
    if ($success -and -not (New-DatabaseSchema)) { $success = $false }
    if ($success -and -not (New-PerformanceIndexes)) { $success = $false }
    if ($success -and -not (New-DatabaseFunctions)) { $success = $false }
    if ($success) { Add-SampleData | Out-Null } # Optional step
    if ($success -and -not (Test-Installation)) { $success = $false }
    if ($success) { New-BackupScript }
    
    if ($success) {
        Write-Header "Database Setup Complete!"
        Write-Host ""
        Write-Host "Connection details:"
        Write-Host "  Host: $DbHost"
        Write-Host "  Port: $DbPort"
        Write-Host "  Database: $DbName"
        Write-Host "  User: $DbUser"
        Write-Host "  Schema: $DbSchema"
        Write-Host ""
        Write-Host "Next steps:"
        Write-Host "1. Update your .env file with these database settings"
        Write-Host "2. Test the connection with your application"
        Write-Host "3. Run regular backups using: .\backup_database.ps1"
        Write-Host ""
        Write-Warning "Important: Change the default password in production!"
    } else {
        Write-Error "Database setup failed. Please check the errors above."
        exit 1
    }
}

# Run the setup
Start-DatabaseSetup