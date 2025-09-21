-- SMART Connect Database Schema Creation
-- MIT License - Westcliff University Property
-- WARNING: Unauthorized copying or modification is prohibited

SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;

-- Create capstone schema
CREATE SCHEMA IF NOT EXISTS capstone;
SET search_path TO capstone;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable pgcrypto for password hashing
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Users table (base table for all user types)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('Student', 'Mentor', 'Administrator')),
    is_active BOOLEAN DEFAULT true,
    email_verified BOOLEAN DEFAULT false,
    phone VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP WITH TIME ZONE,
    profile_image_url TEXT,
    timezone VARCHAR(50) DEFAULT 'UTC'
);

-- Students table
CREATE TABLE IF NOT EXISTS students (
    id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    student_id VARCHAR(20) UNIQUE NOT NULL,
    program VARCHAR(100) NOT NULL,
    specialization VARCHAR(100),
    enrollment_date DATE NOT NULL,
    expected_graduation_date DATE,
    gpa NUMERIC(3,2) CHECK (gpa >= 0.0 AND gpa <= 4.0),
    status VARCHAR(20) DEFAULT 'Pending' CHECK (status IN ('Pending', 'Approved', 'Suspended', 'Graduated')),
    academic_year VARCHAR(10),
    semester VARCHAR(20),
    cumulative_credits INTEGER DEFAULT 0,
    skills JSONB DEFAULT '{}',
    interests JSONB DEFAULT '[]',
    career_goals TEXT,
    resume_url TEXT,
    resume_text TEXT,
    linkedin_url TEXT,
    github_url TEXT,
    portfolio_url TEXT,
    emergency_contact_name VARCHAR(100),
    emergency_contact_phone VARCHAR(20),
    emergency_contact_relationship VARCHAR(50),
    address_line1 TEXT,
    address_line2 TEXT,
    city VARCHAR(100),
    state VARCHAR(50),
    postal_code VARCHAR(20),
    country VARCHAR(100) DEFAULT 'United States',
    date_of_birth DATE,
    preferred_project_type VARCHAR(100),
    availability_hours INTEGER DEFAULT 20,
    ai_ranking_score NUMERIC(5,2) DEFAULT 0.0,
    last_skill_analysis TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Mentors table
CREATE TABLE IF NOT EXISTS mentors (
    id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    employee_id VARCHAR(20) UNIQUE,
    company_name VARCHAR(200),
    job_title VARCHAR(150) NOT NULL,
    department VARCHAR(100),
    industry VARCHAR(100),
    years_of_experience INTEGER DEFAULT 0,
    expertise_areas JSONB DEFAULT '[]',
    skills JSONB DEFAULT '{}',
    bio TEXT,
    linkedin_url TEXT,
    status VARCHAR(20) DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive', 'On Leave')),
    max_students INTEGER DEFAULT 5,
    current_students INTEGER DEFAULT 0,
    preferred_mentoring_style VARCHAR(100),
    available_time_slots JSONB DEFAULT '[]',
    time_zone VARCHAR(50) DEFAULT 'UTC',
    languages JSONB DEFAULT '["English"]',
    certifications JSONB DEFAULT '[]',
    education_background TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Companies table
CREATE TABLE IF NOT EXISTS companies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(200) NOT NULL UNIQUE,
    industry VARCHAR(100),
    size VARCHAR(50), -- 'Startup', 'Small', 'Medium', 'Large', 'Enterprise'
    description TEXT,
    website_url TEXT,
    linkedin_url TEXT,
    headquarters_location VARCHAR(200),
    founded_year INTEGER,
    logo_url TEXT,
    status VARCHAR(20) DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive', 'Partnership Pending')),
    contact_email VARCHAR(255),
    contact_phone VARCHAR(20),
    contact_person_name VARCHAR(150),
    contact_person_title VARCHAR(150),
    partnership_level VARCHAR(50), -- 'Bronze', 'Silver', 'Gold', 'Platinum'
    partnership_start_date DATE,
    partnership_end_date DATE,
    technologies_used JSONB DEFAULT '[]',
    preferred_skills JSONB DEFAULT '[]',
    company_culture TEXT,
    remote_work_policy VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(300) NOT NULL,
    description TEXT NOT NULL,
    company_id UUID REFERENCES companies(id) ON DELETE SET NULL,
    project_type VARCHAR(100), -- 'Capstone', 'Internship', 'Research', 'Consulting'
    difficulty_level VARCHAR(20) CHECK (difficulty_level IN ('Beginner', 'Intermediate', 'Advanced', 'Expert')),
    duration_weeks INTEGER DEFAULT 12,
    start_date DATE,
    end_date DATE,
    status VARCHAR(20) DEFAULT 'Draft' CHECK (status IN ('Draft', 'Active', 'Completed', 'Cancelled', 'On Hold')),
    max_students INTEGER DEFAULT 1,
    current_students INTEGER DEFAULT 0,
    required_skills JSONB DEFAULT '[]',
    preferred_skills JSONB DEFAULT '[]',
    technologies JSONB DEFAULT '[]',
    deliverables JSONB DEFAULT '[]',
    learning_objectives TEXT,
    project_scope TEXT,
    success_criteria TEXT,
    resources_provided TEXT,
    mentor_id UUID REFERENCES mentors(id) ON DELETE SET NULL,
    supervisor_email VARCHAR(255),
    is_remote BOOLEAN DEFAULT true,
    location VARCHAR(200),
    budget_range VARCHAR(100),
    nda_required BOOLEAN DEFAULT false,
    intellectual_property_terms TEXT,
    application_deadline DATE,
    selection_criteria TEXT,
    additional_requirements TEXT,
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    ai_matching_score NUMERIC(5,2) DEFAULT 0.0,
    priority_level INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Courses table
CREATE TABLE IF NOT EXISTS courses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_code VARCHAR(20) NOT NULL UNIQUE,
    course_name VARCHAR(200) NOT NULL,
    description TEXT,
    credits INTEGER DEFAULT 3,
    department VARCHAR(100),
    level VARCHAR(20) CHECK (level IN ('Undergraduate', 'Graduate', 'Doctoral')),
    prerequisites JSONB DEFAULT '[]',
    learning_outcomes JSONB DEFAULT '[]',
    skills_covered JSONB DEFAULT '[]',
    is_capstone_eligible BOOLEAN DEFAULT false,
    semester_offered JSONB DEFAULT '["Fall", "Spring"]',
    max_enrollment INTEGER,
    instructor_name VARCHAR(150),
    instructor_email VARCHAR(255),
    syllabus_url TEXT,
    status VARCHAR(20) DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive', 'Archived')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Student-Project Assignments
CREATE TABLE IF NOT EXISTS student_project_assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    assignment_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'Assigned' CHECK (status IN ('Assigned', 'In Progress', 'Completed', 'Dropped')),
    progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
    start_date DATE,
    completion_date DATE,
    final_grade VARCHAR(5),
    feedback TEXT,
    student_reflection TEXT,
    mentor_evaluation TEXT,
    hours_logged INTEGER DEFAULT 0,
    milestones_completed JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(student_id, project_id)
);

-- Student-Course Enrollments
CREATE TABLE IF NOT EXISTS student_course_enrollments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    enrollment_date DATE DEFAULT CURRENT_DATE,
    semester VARCHAR(20) NOT NULL,
    academic_year VARCHAR(10) NOT NULL,
    status VARCHAR(20) DEFAULT 'Enrolled' CHECK (status IN ('Enrolled', 'Completed', 'Dropped', 'Withdrawn')),
    final_grade VARCHAR(5),
    credits_earned INTEGER DEFAULT 0,
    completion_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(student_id, course_id, semester, academic_year)
);

-- Surveys table
CREATE TABLE IF NOT EXISTS surveys (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(300) NOT NULL,
    description TEXT,
    survey_type VARCHAR(50) NOT NULL, -- 'Skills Assessment', 'Project Feedback', 'Program Evaluation', 'Career Interest'
    target_audience VARCHAR(50) NOT NULL, -- 'Students', 'Mentors', 'Companies', 'All'
    questions JSONB NOT NULL DEFAULT '[]',
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    status VARCHAR(20) DEFAULT 'Draft' CHECK (status IN ('Draft', 'Active', 'Closed', 'Archived')),
    start_date DATE,
    end_date DATE,
    is_anonymous BOOLEAN DEFAULT false,
    is_mandatory BOOLEAN DEFAULT false,
    max_responses INTEGER,
    current_responses INTEGER DEFAULT 0,
    response_rate NUMERIC(5,2) DEFAULT 0.0,
    analysis_settings JSONB DEFAULT '{}',
    tags JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Survey Responses table
CREATE TABLE IF NOT EXISTS survey_responses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    survey_id UUID REFERENCES surveys(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    responses JSONB NOT NULL DEFAULT '{}',
    completion_status VARCHAR(20) DEFAULT 'In Progress' CHECK (completion_status IN ('In Progress', 'Completed', 'Abandoned')),
    completion_percentage INTEGER DEFAULT 0 CHECK (completion_percentage >= 0 AND completion_percentage <= 100),
    time_started TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    time_completed TIMESTAMP WITH TIME ZONE,
    time_spent_minutes INTEGER,
    ip_address INET,
    user_agent TEXT,
    session_id VARCHAR(100),
    is_test_response BOOLEAN DEFAULT false,
    quality_score NUMERIC(3,2) DEFAULT 0.0,
    ai_analysis JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- AI Analysis Results table
CREATE TABLE IF NOT EXISTS ai_analysis_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    analysis_type VARCHAR(100) NOT NULL, -- 'skill_extraction', 'student_ranking', 'survey_analysis', 'project_matching'
    entity_type VARCHAR(50) NOT NULL, -- 'student', 'project', 'survey', 'mentor'
    entity_id UUID NOT NULL,
    input_data JSONB DEFAULT '{}',
    analysis_results JSONB DEFAULT '{}',
    confidence_score NUMERIC(5,2) DEFAULT 0.0,
    provider_used VARCHAR(50), -- 'openai', 'google', 'ollama', 'huggingface'
    model_used VARCHAR(100),
    tokens_used INTEGER DEFAULT 0,
    processing_time_ms INTEGER DEFAULT 0,
    cost_usd NUMERIC(10,6) DEFAULT 0.0,
    status VARCHAR(20) DEFAULT 'Completed' CHECK (status IN ('Processing', 'Completed', 'Failed', 'Cancelled')),
    error_message TEXT,
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- System Settings table
CREATE TABLE IF NOT EXISTS system_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value JSONB NOT NULL,
    setting_type VARCHAR(50) NOT NULL, -- 'ai_config', 'app_config', 'feature_flag', 'integration'
    description TEXT,
    is_public BOOLEAN DEFAULT false,
    is_editable BOOLEAN DEFAULT true,
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    updated_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Audit Log table
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id UUID NOT NULL,
    old_values JSONB DEFAULT '{}',
    new_values JSONB DEFAULT '{}',
    ip_address INET,
    user_agent TEXT,
    session_id VARCHAR(100),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_is_active ON users(is_active);

CREATE INDEX IF NOT EXISTS idx_students_student_id ON students(student_id);
CREATE INDEX IF NOT EXISTS idx_students_program ON students(program);
CREATE INDEX IF NOT EXISTS idx_students_status ON students(status);
CREATE INDEX IF NOT EXISTS idx_students_gpa ON students(gpa);
CREATE INDEX IF NOT EXISTS idx_students_skills_gin ON students USING GIN(skills);

CREATE INDEX IF NOT EXISTS idx_mentors_company ON mentors(company_name);
CREATE INDEX IF NOT EXISTS idx_mentors_status ON mentors(status);
CREATE INDEX IF NOT EXISTS idx_mentors_skills_gin ON mentors USING GIN(skills);

CREATE INDEX IF NOT EXISTS idx_companies_name ON companies(name);
CREATE INDEX IF NOT EXISTS idx_companies_industry ON companies(industry);
CREATE INDEX IF NOT EXISTS idx_companies_status ON companies(status);

CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_company_id ON projects(company_id);
CREATE INDEX IF NOT EXISTS idx_projects_type ON projects(project_type);
CREATE INDEX IF NOT EXISTS idx_projects_start_date ON projects(start_date);

CREATE INDEX IF NOT EXISTS idx_assignments_student_id ON student_project_assignments(student_id);
CREATE INDEX IF NOT EXISTS idx_assignments_project_id ON student_project_assignments(project_id);
CREATE INDEX IF NOT EXISTS idx_assignments_status ON student_project_assignments(status);

CREATE INDEX IF NOT EXISTS idx_surveys_status ON surveys(status);
CREATE INDEX IF NOT EXISTS idx_surveys_type ON surveys(survey_type);
CREATE INDEX IF NOT EXISTS idx_surveys_audience ON surveys(target_audience);

CREATE INDEX IF NOT EXISTS idx_survey_responses_survey_id ON survey_responses(survey_id);
CREATE INDEX IF NOT EXISTS idx_survey_responses_user_id ON survey_responses(user_id);
CREATE INDEX IF NOT EXISTS idx_survey_responses_status ON survey_responses(completion_status);

CREATE INDEX IF NOT EXISTS idx_ai_analysis_type ON ai_analysis_results(analysis_type);
CREATE INDEX IF NOT EXISTS idx_ai_analysis_entity ON ai_analysis_results(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_ai_analysis_created_at ON ai_analysis_results(created_at);

CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_timestamp ON audit_logs(timestamp);

-- Full-text search indexes
CREATE INDEX IF NOT EXISTS idx_students_resume_fts ON students USING GIN(to_tsvector('english', COALESCE(resume_text, '')));
CREATE INDEX IF NOT EXISTS idx_projects_desc_fts ON projects USING GIN(to_tsvector('english', COALESCE(description, '')));

-- Insert default system settings
INSERT INTO system_settings (setting_key, setting_value, setting_type, description, is_public) VALUES
('app_name', '"SMART Connect"', 'app_config', 'Application name', true),
('app_version', '"1.0.0"', 'app_config', 'Current application version', true),
('max_file_upload_size', '10485760', 'app_config', 'Maximum file upload size in bytes (10MB)', false),
('ai_default_provider', '"ollama"', 'ai_config', 'Default AI provider for cost optimization', false),
('ai_fallback_providers', '["huggingface", "openai", "google"]', 'ai_config', 'Fallback AI providers in order of preference', false),
('skill_analysis_enabled', 'true', 'feature_flag', 'Enable AI skill analysis features', false),
('student_ranking_enabled', 'true', 'feature_flag', 'Enable AI student ranking features', false),
('survey_analysis_enabled', 'true', 'feature_flag', 'Enable AI survey analysis features', false)
ON CONFLICT (setting_key) DO UPDATE SET
    setting_value = EXCLUDED.setting_value,
    updated_at = CURRENT_TIMESTAMP;

-- Create default admin user (password: SmartConnect2024!)
INSERT INTO users (
    email,
    password_hash,
    first_name,
    last_name,
    role,
    is_active,
    email_verified
) VALUES (
    'admin@westcliff.edu',
    crypt('SmartConnect2024!', gen_salt('bf')),
    'System',
    'Administrator',
    'Administrator',
    true,
    true
) ON CONFLICT (email) DO NOTHING;

-- Create sample mentor user
INSERT INTO users (
    email,
    password_hash,
    first_name,
    last_name,
    role,
    is_active,
    email_verified
) VALUES (
    'mentor@example.com',
    crypt('MentorPass123!', gen_salt('bf')),
    'John',
    'Smith',
    'Mentor',
    true,
    true
) ON CONFLICT (email) DO NOTHING;

-- Create sample student user
INSERT INTO users (
    email,
    password_hash,
    first_name,
    last_name,
    role,
    is_active,
    email_verified
) VALUES (
    'student@westcliff.edu',
    crypt('StudentPass123!', gen_salt('bf')),
    'Jane',
    'Doe',
    'Student',
    true,
    true
) ON CONFLICT (email) DO NOTHING;

-- Success message
DO $$
BEGIN
    RAISE NOTICE 'SMART Connect database schema created successfully!';
    RAISE NOTICE 'Schema: capstone';
    RAISE NOTICE 'Tables created: %', (SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'capstone');
    RAISE NOTICE 'Default users created with roles: Administrator, Mentor, Student';
    RAISE NOTICE 'WARNING: Change default passwords in production!';
END $$;