-- SMART Connect Sample Data
-- MIT License - Westcliff University Property

SET search_path TO capstone;

-- Insert sample companies
INSERT INTO companies (id, name, industry, size, description, website_url, status, contact_email, technologies_used, preferred_skills) VALUES
(uuid_generate_v4(), 'TechStart Innovations', 'Technology', 'Startup', 'AI-powered solutions for small businesses', 'https://techstart.com', 'Active', 'partnerships@techstart.com', '["Python", "React", "AWS", "Docker"]', '["Machine Learning", "Full Stack Development", "Cloud Computing"]'),
(uuid_generate_v4(), 'Global Finance Corp', 'Finance', 'Large', 'Leading financial services company', 'https://globalfinance.com', 'Active', 'internships@globalfinance.com', '["Java", "Spring", "Oracle", "Kubernetes"]', '["Software Engineering", "Data Analysis", "Cybersecurity"]'),
(uuid_generate_v4(), 'HealthTech Solutions', 'Healthcare', 'Medium', 'Digital health platform development', 'https://healthtech.com', 'Active', 'projects@healthtech.com', '["JavaScript", "Node.js", "PostgreSQL", "React Native"]', '["Mobile Development", "Healthcare IT", "Data Privacy"]')
ON CONFLICT (name) DO NOTHING;

-- Get company IDs for projects
DO $$
DECLARE
    techstart_id UUID;
    finance_id UUID;
    health_id UUID;
    mentor_user_id UUID;
    student_user_id UUID;
BEGIN
    -- Get company IDs
    SELECT id INTO techstart_id FROM companies WHERE name = 'TechStart Innovations';
    SELECT id INTO finance_id FROM companies WHERE name = 'Global Finance Corp';
    SELECT id INTO health_id FROM companies WHERE name = 'HealthTech Solutions';
    
    -- Get user IDs
    SELECT id INTO mentor_user_id FROM users WHERE email = 'mentor@example.com';
    SELECT id INTO student_user_id FROM users WHERE email = 'student@westcliff.edu';
    
    -- Create mentor record
    INSERT INTO mentors (id, employee_id, company_name, job_title, department, years_of_experience, expertise_areas, skills, bio, status)
    VALUES (
        mentor_user_id,
        'MENT001',
        'TechStart Innovations',
        'Senior Software Engineer',
        'Engineering',
        8,
        '["Full Stack Development", "Machine Learning", "Team Leadership"]',
        '{"Python": 5, "JavaScript": 5, "React": 4, "Machine Learning": 4, "AWS": 3}',
        'Experienced software engineer with passion for mentoring the next generation of developers.',
        'Active'
    ) ON CONFLICT (id) DO NOTHING;
    
    -- Create student record
    INSERT INTO students (
        id, student_id, program, specialization, enrollment_date, expected_graduation_date, 
        gpa, status, academic_year, semester, skills, interests, career_goals
    ) VALUES (
        student_user_id,
        'WU2024001',
        'Master of Science in Computer Science',
        'Software Engineering',
        '2024-01-15',
        '2025-12-15',
        3.75,
        'Approved',
        '2024-2025',
        'Fall 2024',
        '{"Python": 3, "Java": 4, "React": 2, "SQL": 3, "Git": 4}',
        '["Artificial Intelligence", "Web Development", "Data Science"]',
        'Become a full-stack developer at a tech startup'
    ) ON CONFLICT (id) DO NOTHING;
    
    -- Insert sample projects
    INSERT INTO projects (
        id, title, description, company_id, project_type, difficulty_level, duration_weeks,
        start_date, end_date, status, max_students, required_skills, preferred_skills,
        technologies, deliverables, learning_objectives, mentor_id
    ) VALUES
    (
        uuid_generate_v4(),
        'AI-Powered Customer Support Chatbot',
        'Develop an intelligent chatbot using natural language processing to handle customer inquiries automatically. The system should integrate with existing CRM and provide analytics on customer interactions.',
        techstart_id,
        'Capstone',
        'Intermediate',
        12,
        '2024-02-01',
        '2024-04-26',
        'Active',
        2,
        '["Python", "Machine Learning", "API Development"]',
        '["NLP", "FastAPI", "React", "Docker"]',
        '["Python", "TensorFlow", "FastAPI", "React", "PostgreSQL", "Docker"]',
        '["Working chatbot application", "API documentation", "User interface", "Analytics dashboard", "Deployment guide"]',
        'Learn to build and deploy AI-powered applications, understand NLP concepts, gain experience with modern web development frameworks.',
        mentor_user_id
    ),
    (
        uuid_generate_v4(),
        'Financial Risk Assessment Platform',
        'Build a comprehensive risk assessment tool that analyzes financial data to predict potential risks. Include data visualization, real-time monitoring, and automated reporting features.',
        finance_id,
        'Capstone',
        'Advanced',
        16,
        '2024-03-01',
        '2024-06-28',
        'Active',
        3,
        '["Java", "Spring Boot", "Data Analysis", "SQL"]',
        '["Machine Learning", "React", "Microservices", "Cloud Computing"]',
        '["Java", "Spring Boot", "React", "PostgreSQL", "Apache Kafka", "Docker", "AWS"]',
        '["Risk assessment engine", "Web dashboard", "API services", "Database schema", "Documentation"]',
        'Understand financial risk modeling, learn enterprise software development, gain experience with microservices architecture.',
        mentor_user_id
    ),
    (
        uuid_generate_v4(),
        'Healthcare Data Analytics Dashboard',
        'Create a secure analytics platform for healthcare providers to visualize patient data trends, treatment outcomes, and operational metrics while ensuring HIPAA compliance.',
        health_id,
        'Capstone',
        'Intermediate',
        14,
        '2024-02-15',
        '2024-05-31',
        'Active',
        2,
        '["JavaScript", "Node.js", "Data Visualization", "Healthcare IT"]',
        '["React", "D3.js", "Security", "Database Design"]',
        '["Node.js", "React", "D3.js", "MongoDB", "Express.js", "JWT"]',
        '["Analytics dashboard", "Data processing pipeline", "Security documentation", "User training materials"]',
        'Learn healthcare data standards, understand data privacy regulations, gain experience with data visualization.',
        mentor_user_id
    );
    
    -- Insert sample courses
    INSERT INTO courses (course_code, course_name, description, credits, department, level, prerequisites, learning_outcomes, skills_covered, is_capstone_eligible) VALUES
    ('CS550', 'Advanced Software Engineering', 'Advanced concepts in software development including design patterns, architecture, and project management.', 3, 'Computer Science', 'Graduate', '["CS450"]', '["Design complex software systems", "Apply software engineering principles", "Manage software projects"]', '["Software Design", "Project Management", "Team Leadership"]', true),
    ('CS580', 'Machine Learning Applications', 'Practical application of machine learning algorithms to real-world problems.', 3, 'Computer Science', 'Graduate', '["CS480", "MATH530"]', '["Implement ML algorithms", "Analyze data patterns", "Build predictive models"]', '["Machine Learning", "Data Analysis", "Python", "Statistics"]', true),
    ('CS590', 'Capstone Project', 'Independent project demonstrating mastery of computer science concepts.', 3, 'Computer Science', 'Graduate', '["CS550", "CS580"]', '["Complete independent project", "Present technical solutions", "Document project results"]', '["Project Management", "Technical Writing", "Presentation Skills"]', true);
    
    -- Insert sample survey
    INSERT INTO surveys (
        title, description, survey_type, target_audience, questions, status, start_date, end_date, is_mandatory
    ) VALUES (
        'Student Skills Assessment Survey',
        'Comprehensive assessment of student technical and soft skills to improve project matching.',
        'Skills Assessment',
        'Students',
        '[
            {
                "id": 1,
                "type": "multiple_choice",
                "question": "What is your primary programming language?",
                "options": ["Python", "Java", "JavaScript", "C++", "Other"],
                "required": true
            },
            {
                "id": 2,
                "type": "rating",
                "question": "Rate your experience with web development (1-5 scale)",
                "min": 1,
                "max": 5,
                "required": true
            },
            {
                "id": 3,
                "type": "checkbox",
                "question": "Which technologies have you worked with?",
                "options": ["React", "Angular", "Vue.js", "Node.js", "Django", "Spring Boot"],
                "required": false
            },
            {
                "id": 4,
                "type": "text",
                "question": "Describe a challenging project you have worked on",
                "required": false
            }
        ]',
        'Active',
        '2024-01-01',
        '2024-12-31',
        false
    );

END $$;