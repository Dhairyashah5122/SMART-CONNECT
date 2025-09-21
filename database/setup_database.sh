#!/bin/bash
# SMART Connect Database Setup Script
# This script sets up the complete PostgreSQL database for production

set -e  # Exit on any error

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration (can be overridden with environment variables)
DB_NAME="${DB_NAME:-smart_connect}"
DB_USER="${DB_USER:-smart_connect_user}"
DB_SCHEMA="${DB_SCHEMA:-capstone}"
DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-5432}"

# Default password (should be changed in production)
DB_PASSWORD="${DB_PASSWORD:-SmartConnect2024!}"

# Admin credentials (for database creation)
ADMIN_USER="${POSTGRES_USER:-postgres}"
ADMIN_PASSWORD="${POSTGRES_PASSWORD:-}"

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  SMART Connect Database Setup${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Function to check if PostgreSQL is running
check_postgres() {
    echo -e "${YELLOW}Checking PostgreSQL connection...${NC}"
    if pg_isready -h $DB_HOST -p $DB_PORT; then
        echo -e "${GREEN}✓ PostgreSQL is running${NC}"
    else
        echo -e "${RED}✗ PostgreSQL is not running or not accessible${NC}"
        echo "Please start PostgreSQL service and try again."
        exit 1
    fi
}

# Function to create database and user
create_database() {
    echo -e "${YELLOW}Creating database and user...${NC}"
    
    # Create database and user
    PGPASSWORD=$ADMIN_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $ADMIN_USER -c "
        -- Create database if it doesn't exist
        SELECT 'CREATE DATABASE $DB_NAME' 
        WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = '$DB_NAME')\\gexec
        
        -- Create user if it doesn't exist
        DO \$\$
        BEGIN
            IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = '$DB_USER') THEN
                CREATE USER $DB_USER WITH ENCRYPTED PASSWORD '$DB_PASSWORD';
            END IF;
        END
        \$\$;
        
        -- Grant privileges
        GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;
        ALTER USER $DB_USER CREATEDB;
    " 2>/dev/null
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Database and user created successfully${NC}"
    else
        echo -e "${RED}✗ Failed to create database or user${NC}"
        exit 1
    fi
}

# Function to create schema and tables
create_schema() {
    echo -e "${YELLOW}Creating database schema...${NC}"
    
    # Connect to the database and create schema
    PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -c "
        -- Create schema
        CREATE SCHEMA IF NOT EXISTS $DB_SCHEMA;
        
        -- Grant privileges on schema
        GRANT ALL ON SCHEMA $DB_SCHEMA TO $DB_USER;
        GRANT USAGE ON SCHEMA $DB_SCHEMA TO $DB_USER;
    "
    
    # Run the main schema file
    echo -e "${YELLOW}Running main schema file...${NC}"
    PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f "../create_tables_updated.sql"
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Schema created successfully${NC}"
    else
        echo -e "${RED}✗ Failed to create schema${NC}"
        exit 1
    fi
}

# Function to create indexes for performance
create_indexes() {
    echo -e "${YELLOW}Creating performance indexes...${NC}"
    
    PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME << EOF
        SET search_path TO $DB_SCHEMA;
        
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
        CREATE INDEX IF NOT EXISTS idx_students_resume_fts ON students USING GIN(to_tsvector('english', resume_text));
        CREATE INDEX IF NOT EXISTS idx_projects_desc_fts ON projects USING GIN(to_tsvector('english', description));
EOF
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Indexes created successfully${NC}"
    else
        echo -e "${RED}✗ Failed to create indexes${NC}"
        exit 1
    fi
}

# Function to insert sample data
insert_sample_data() {
    echo -e "${YELLOW}Inserting sample data...${NC}"
    
    PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f "seeds/sample_data.sql"
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Sample data inserted successfully${NC}"
    else
        echo -e "${YELLOW}⚠ Sample data insertion failed (this is optional)${NC}"
    fi
}

# Function to set up database functions and triggers
create_functions() {
    echo -e "${YELLOW}Creating database functions and triggers...${NC}"
    
    PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME << EOF
        SET search_path TO $DB_SCHEMA;
        
        -- Function to update timestamp
        CREATE OR REPLACE FUNCTION update_timestamp()
        RETURNS TRIGGER AS \$\$
        BEGIN
           NEW.updated_at = NOW();
           RETURN NEW;
        END;
        \$\$ language 'plpgsql';
        
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
        ) AS \$\$
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
        \$\$ LANGUAGE plpgsql;
        
        -- Function to get student skills summary
        CREATE OR REPLACE FUNCTION get_skills_summary()
        RETURNS TABLE(
            skill_name TEXT,
            skill_count BIGINT,
            skill_percentage NUMERIC(5,2)
        ) AS \$\$
        BEGIN
            RETURN QUERY
            WITH skill_counts AS (
                SELECT 
                    jsonb_object_keys(skills) as skill,
                    COUNT(*) as count
                FROM students 
                WHERE skills IS NOT NULL AND status = 'Approved'
                GROUP BY jsonb_object_keys(skills)
            ),
            total_students AS (
                SELECT COUNT(*) as total FROM students WHERE status = 'Approved'
            )
            SELECT 
                sc.skill,
                sc.count,
                ROUND((sc.count::NUMERIC / ts.total) * 100, 2) as percentage
            FROM skill_counts sc
            CROSS JOIN total_students ts
            ORDER BY sc.count DESC;
        END;
        \$\$ LANGUAGE plpgsql;
EOF
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Database functions created successfully${NC}"
    else
        echo -e "${RED}✗ Failed to create database functions${NC}"
        exit 1
    fi
}

# Function to verify installation
verify_installation() {
    echo -e "${YELLOW}Verifying installation...${NC}"
    
    # Test basic connectivity and check tables
    TABLES=$(PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -t -c "
        SET search_path TO $DB_SCHEMA;
        SELECT COUNT(*) FROM information_schema.tables 
        WHERE table_schema = '$DB_SCHEMA';
    " | tr -d ' ')
    
    if [ "$TABLES" -gt "0" ]; then
        echo -e "${GREEN}✓ Database installation verified${NC}"
        echo -e "${GREEN}✓ Found $TABLES tables in schema '$DB_SCHEMA'${NC}"
        
        # Show table list
        echo -e "${BLUE}Tables created:${NC}"
        PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -c "
            SET search_path TO $DB_SCHEMA;
            SELECT table_name FROM information_schema.tables 
            WHERE table_schema = '$DB_SCHEMA'
            ORDER BY table_name;
        "
    else
        echo -e "${RED}✗ Database verification failed${NC}"
        exit 1
    fi
}

# Function to create backup script
create_backup_script() {
    echo -e "${YELLOW}Creating backup script...${NC}"
    
    cat > backup_database.sh << 'EOL'
#!/bin/bash
# SMART Connect Database Backup Script

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="./backups"
DB_NAME="${DB_NAME:-smart_connect}"
DB_USER="${DB_USER:-smart_connect_user}"
DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-5432}"

mkdir -p $BACKUP_DIR

echo "Creating backup: smart_connect_$DATE.sql"
pg_dump -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME > "$BACKUP_DIR/smart_connect_$DATE.sql"

if [ $? -eq 0 ]; then
    echo "✓ Backup created successfully: $BACKUP_DIR/smart_connect_$DATE.sql"
    
    # Compress backup
    gzip "$BACKUP_DIR/smart_connect_$DATE.sql"
    echo "✓ Backup compressed: $BACKUP_DIR/smart_connect_$DATE.sql.gz"
    
    # Keep only last 7 backups
    ls -t $BACKUP_DIR/smart_connect_*.sql.gz | tail -n +8 | xargs -r rm
    echo "✓ Old backups cleaned up"
else
    echo "✗ Backup failed"
    exit 1
fi
EOL
    
    chmod +x backup_database.sh
    echo -e "${GREEN}✓ Backup script created: backup_database.sh${NC}"
}

# Main execution
main() {
    echo -e "${BLUE}Starting database setup for SMART Connect...${NC}"
    echo ""
    echo "Configuration:"
    echo "  Database: $DB_NAME"
    echo "  User: $DB_USER"
    echo "  Schema: $DB_SCHEMA"
    echo "  Host: $DB_HOST"
    echo "  Port: $DB_PORT"
    echo ""
    
    # Confirm before proceeding
    read -p "Continue with database setup? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Setup cancelled."
        exit 0
    fi
    
    check_postgres
    create_database
    create_schema
    create_indexes
    create_functions
    insert_sample_data
    verify_installation
    create_backup_script
    
    echo ""
    echo -e "${GREEN}========================================${NC}"
    echo -e "${GREEN}  Database Setup Complete!${NC}"
    echo -e "${GREEN}========================================${NC}"
    echo ""
    echo "Connection details:"
    echo "  Host: $DB_HOST"
    echo "  Port: $DB_PORT"
    echo "  Database: $DB_NAME"
    echo "  User: $DB_USER"
    echo "  Schema: $DB_SCHEMA"
    echo ""
    echo "Next steps:"
    echo "1. Update your .env file with these database settings"
    echo "2. Test the connection with your application"
    echo "3. Run regular backups using: ./backup_database.sh"
    echo ""
    echo -e "${YELLOW}Important: Change the default password in production!${NC}"
}

# Run main function
main