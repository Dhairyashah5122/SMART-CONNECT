-- Database Migration: Add AI Optimization Features
-- Version: 1.1.0
-- Date: 2024-12-19

SET search_path TO capstone;

-- Add AI cost tracking table for optimization
CREATE TABLE IF NOT EXISTS ai_cost_tracking (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    provider VARCHAR(50) NOT NULL,
    model VARCHAR(100) NOT NULL,
    operation_type VARCHAR(100) NOT NULL,
    tokens_used INTEGER DEFAULT 0,
    cost_usd NUMERIC(10,6) DEFAULT 0.0,
    request_count INTEGER DEFAULT 1,
    average_response_time_ms INTEGER DEFAULT 0,
    success_rate NUMERIC(5,2) DEFAULT 100.0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add indexes for cost tracking
CREATE INDEX IF NOT EXISTS idx_ai_cost_date ON ai_cost_tracking(date);
CREATE INDEX IF NOT EXISTS idx_ai_cost_provider ON ai_cost_tracking(provider);
CREATE INDEX IF NOT EXISTS idx_ai_cost_operation ON ai_cost_tracking(operation_type);

-- Add skill matching optimization table
CREATE TABLE IF NOT EXISTS skill_matching_cache (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    matching_score NUMERIC(5,2) NOT NULL,
    skill_gaps JSONB DEFAULT '[]',
    skill_matches JSONB DEFAULT '[]',
    confidence_level NUMERIC(3,2) DEFAULT 0.0,
    last_calculated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_valid BOOLEAN DEFAULT true,
    UNIQUE(student_id, project_id)
);

-- Add indexes for skill matching cache
CREATE INDEX IF NOT EXISTS idx_skill_cache_student ON skill_matching_cache(student_id);
CREATE INDEX IF NOT EXISTS idx_skill_cache_project ON skill_matching_cache(project_id);
CREATE INDEX IF NOT EXISTS idx_skill_cache_score ON skill_matching_cache(matching_score DESC);
CREATE INDEX IF NOT EXISTS idx_skill_cache_valid ON skill_matching_cache(is_valid);

-- Add student performance tracking
ALTER TABLE students ADD COLUMN IF NOT EXISTS performance_metrics JSONB DEFAULT '{}';
ALTER TABLE students ADD COLUMN IF NOT EXISTS recommendation_score NUMERIC(5,2) DEFAULT 0.0;
ALTER TABLE students ADD COLUMN IF NOT EXISTS last_activity TIMESTAMP WITH TIME ZONE;

-- Add project popularity tracking
ALTER TABLE projects ADD COLUMN IF NOT EXISTS application_count INTEGER DEFAULT 0;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS view_count INTEGER DEFAULT 0;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS popularity_score NUMERIC(5,2) DEFAULT 0.0;

-- Add mentor availability tracking
ALTER TABLE mentors ADD COLUMN IF NOT EXISTS availability_schedule JSONB DEFAULT '{}';
ALTER TABLE mentors ADD COLUMN IF NOT EXISTS response_time_hours NUMERIC(5,2) DEFAULT 24.0;
ALTER TABLE mentors ADD COLUMN IF NOT EXISTS satisfaction_rating NUMERIC(3,2) DEFAULT 0.0;

-- Update system settings with new AI optimization settings
INSERT INTO system_settings (setting_key, setting_value, setting_type, description, is_public) VALUES
('ai_cost_threshold_daily', '50.0', 'ai_config', 'Daily AI cost threshold in USD', false),
('ai_cost_threshold_monthly', '1000.0', 'ai_config', 'Monthly AI cost threshold in USD', false),
('skill_cache_ttl_hours', '24', 'ai_config', 'Skill matching cache TTL in hours', false),
('performance_tracking_enabled', 'true', 'feature_flag', 'Enable student performance tracking', false),
('auto_skill_analysis_enabled', 'true', 'feature_flag', 'Enable automatic skill analysis on resume upload', false)
ON CONFLICT (setting_key) DO UPDATE SET
    setting_value = EXCLUDED.setting_value,
    updated_at = CURRENT_TIMESTAMP;

-- Create function to invalidate skill cache when student/project changes
CREATE OR REPLACE FUNCTION invalidate_skill_cache()
RETURNS TRIGGER AS $$
BEGIN
    -- Invalidate cache when student skills change
    IF TG_TABLE_NAME = 'students' AND OLD.skills IS DISTINCT FROM NEW.skills THEN
        UPDATE skill_matching_cache 
        SET is_valid = false 
        WHERE student_id = NEW.id;
    END IF;
    
    -- Invalidate cache when project requirements change
    IF TG_TABLE_NAME = 'projects' AND (
        OLD.required_skills IS DISTINCT FROM NEW.required_skills OR
        OLD.preferred_skills IS DISTINCT FROM NEW.preferred_skills
    ) THEN
        UPDATE skill_matching_cache 
        SET is_valid = false 
        WHERE project_id = NEW.id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for cache invalidation
DROP TRIGGER IF EXISTS invalidate_student_skill_cache ON students;
CREATE TRIGGER invalidate_student_skill_cache
    AFTER UPDATE ON students
    FOR EACH ROW
    EXECUTE FUNCTION invalidate_skill_cache();

DROP TRIGGER IF EXISTS invalidate_project_skill_cache ON projects;
CREATE TRIGGER invalidate_project_skill_cache
    AFTER UPDATE ON projects
    FOR EACH ROW
    EXECUTE FUNCTION invalidate_skill_cache();

-- Create function to calculate project popularity
CREATE OR REPLACE FUNCTION update_project_popularity()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE projects 
    SET popularity_score = COALESCE(
        (application_count * 0.6) + (view_count * 0.1) + 
        (CASE WHEN status = 'Active' THEN 20 ELSE 0 END) +
        (CASE WHEN difficulty_level = 'Beginner' THEN 10 
              WHEN difficulty_level = 'Intermediate' THEN 15 
              ELSE 5 END),
        0
    )
    WHERE id = NEW.id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for project popularity
DROP TRIGGER IF EXISTS update_project_popularity_trigger ON projects;
CREATE TRIGGER update_project_popularity_trigger
    AFTER UPDATE OF application_count, view_count, status ON projects
    FOR EACH ROW
    EXECUTE FUNCTION update_project_popularity();

-- Create view for AI cost analysis
CREATE OR REPLACE VIEW ai_cost_summary AS
SELECT 
    provider,
    DATE_TRUNC('month', date) as month,
    SUM(cost_usd) as total_cost,
    SUM(tokens_used) as total_tokens,
    SUM(request_count) as total_requests,
    AVG(average_response_time_ms) as avg_response_time,
    AVG(success_rate) as avg_success_rate
FROM ai_cost_tracking 
GROUP BY provider, DATE_TRUNC('month', date)
ORDER BY month DESC, total_cost DESC;

-- Create view for top performing students
CREATE OR REPLACE VIEW top_students_view AS
SELECT 
    s.id,
    u.first_name,
    u.last_name,
    s.student_id,
    s.program,
    s.gpa,
    s.ai_ranking_score,
    s.recommendation_score,
    COUNT(spa.id) as project_count,
    AVG(CASE WHEN spa.status = 'Completed' THEN 100 ELSE spa.progress_percentage END) as avg_progress
FROM students s
JOIN users u ON s.id = u.id
LEFT JOIN student_project_assignments spa ON s.id = spa.student_id
WHERE s.status = 'Approved'
GROUP BY s.id, u.first_name, u.last_name, s.student_id, s.program, s.gpa, s.ai_ranking_score, s.recommendation_score
ORDER BY s.ai_ranking_score DESC, s.gpa DESC;

-- Create view for project matching recommendations
CREATE OR REPLACE VIEW project_recommendations AS
SELECT 
    p.id as project_id,
    p.title,
    p.company_id,
    c.name as company_name,
    p.difficulty_level,
    p.max_students,
    p.current_students,
    p.popularity_score,
    p.required_skills,
    p.preferred_skills,
    COUNT(smc.student_id) as potential_matches,
    AVG(smc.matching_score) as avg_matching_score
FROM projects p
LEFT JOIN companies c ON p.company_id = c.id
LEFT JOIN skill_matching_cache smc ON p.id = smc.project_id AND smc.is_valid = true
WHERE p.status = 'Active'
GROUP BY p.id, p.title, p.company_id, c.name, p.difficulty_level, p.max_students, p.current_students, p.popularity_score, p.required_skills, p.preferred_skills
ORDER BY p.popularity_score DESC, avg_matching_score DESC;

-- Insert sample AI cost tracking data
INSERT INTO ai_cost_tracking (provider, model, operation_type, tokens_used, cost_usd, request_count) VALUES
('ollama', 'llama2', 'skill_extraction', 0, 0.0, 1),
('huggingface', 'distilbert-base-uncased', 'skill_extraction', 0, 0.0, 1),
('openai', 'gpt-3.5-turbo', 'skill_extraction', 150, 0.0003, 1),
('google', 'gemini-pro', 'student_ranking', 200, 0.0002, 1);

-- Success message
DO $$
BEGIN
    RAISE NOTICE 'AI optimization migration completed successfully!';
    RAISE NOTICE 'Added tables: ai_cost_tracking, skill_matching_cache';
    RAISE NOTICE 'Added views: ai_cost_summary, top_students_view, project_recommendations';
    RAISE NOTICE 'Added performance optimization features';
END $$;