# SMART Connect Backend

A comprehensive FastAPI backend for the SMART Connect educational platform, featuring AI-powered student ranking, multi-provider AI integration, and complete capstone project management.

## 🚀 Features

### Core Functionality
- **Multi-Role Authentication**: Support for Students, Mentors, and Administrators
- **Student Management**: Complete CRUD operations with profile management
- **Project Management**: Project creation, assignment, and tracking
- **Course Management**: Academic course administration
- **Survey System**: Feedback collection and analysis

### AI-Powered Features
- **Multi-AI Provider Support**: OpenAI, Google AI, Anthropic, Azure OpenAI
- **Cost Optimization**: Automatic provider selection based on cost and performance
- **Student Ranking**: AI-powered ranking for project assignments
- **Skill Extraction**: Automated skill analysis from resumes
- **Project Matching**: Intelligent student-project matching
- **Genkit Integration**: Compatible with existing Genkit flows

### Technical Features
- **FastAPI Framework**: High-performance async API
- **PostgreSQL Database**: Robust data storage with schema support
- **JWT Authentication**: Secure token-based authentication
- **Rate Limiting**: Built-in request throttling
- **CORS Support**: Frontend integration ready
- **Health Monitoring**: Comprehensive health checks
- **Cost Tracking**: Real-time AI usage cost monitoring

## 📋 Prerequisites

- Python 3.9 or higher
- PostgreSQL 12 or higher
- At least one AI provider API key (OpenAI, Google AI, etc.)

## 🛠️ Installation

### 1. Clone and Setup

```bash
cd "c:\Users\Allot\Downloads\SMART CAPSTON PROJECT\backend"
```

### 2. Create Virtual Environment

```bash
python -m venv venv
# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Database Setup

#### Create PostgreSQL Database
```sql
-- Connect to PostgreSQL as superuser
CREATE DATABASE smart_connect;
CREATE USER smart_connect_user WITH ENCRYPTED PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE smart_connect TO smart_connect_user;

-- Connect to smart_connect database
\c smart_connect;
CREATE SCHEMA capstone;
GRANT ALL ON SCHEMA capstone TO smart_connect_user;
```

#### Run Database Schema
```bash
# Navigate to the main project directory
cd "c:\Users\Allot\Downloads\SMART CAPSTON PROJECT"

# Run the SQL schema file
psql -U smart_connect_user -d smart_connect -f create_tables_updated.sql
```

### 5. Environment Configuration

Create a `.env` file in the backend directory:

```env
# Application Settings
APP_NAME="SMART Connect API"
ENVIRONMENT=development
DEBUG=true
SECRET_KEY=your-super-secret-key-change-in-production

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=smart_connect
DB_USER=smart_connect_user
DB_PASSWORD=your_password
DB_SCHEMA=capstone

# Server Settings
HOST=0.0.0.0
PORT=8000
RELOAD=true

# AI Provider Settings - Add your API keys
OPENAI_API_KEY=your_openai_api_key
GOOGLE_AI_API_KEY=your_google_ai_api_key
ANTHROPIC_API_KEY=your_anthropic_api_key
AZURE_OPENAI_API_KEY=your_azure_openai_api_key
AZURE_OPENAI_ENDPOINT=your_azure_endpoint

# Cost Optimization
COST_OPTIMIZATION_ENABLED=true
MAX_COST_PER_REQUEST=0.50
DAILY_COST_LIMIT=100.0

# CORS Settings (adjust for your frontend)
CORS_ORIGINS=["http://localhost:3000", "http://localhost:3001"]
```

## 🚀 Running the Application

### Development Server
```bash
cd backend
python main.py
```

Or using uvicorn directly:
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Production Server
```bash
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

## 📚 API Documentation

Once running, access the interactive API documentation:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **Health Check**: http://localhost:8000/health

## 🔧 API Endpoints

### Authentication
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/register` - User registration
- `GET /api/v1/auth/me` - Current user info
- `POST /api/v1/auth/logout` - User logout

### Students
- `GET /api/v1/students/` - List students
- `GET /api/v1/students/{id}` - Get student details
- `POST /api/v1/students/` - Create student profile
- `PUT /api/v1/students/{id}` - Update student profile
- `DELETE /api/v1/students/{id}` - Delete student profile

### AI-Powered Ranking
- `POST /api/v1/rank-students/` - Rank students for project
- `POST /api/v1/rank-students/by-skills` - Rank by specific skills
- `GET /api/v1/rank-students/criteria` - Get ranking criteria

### System
- `GET /health` - Health check
- `GET /api/v1/status` - API status and capabilities
- `GET /api/v1/ai/costs` - AI usage costs
- `GET /api/v1/ai/providers` - AI provider status

## 🤖 AI Integration

### Supported Providers
1. **OpenAI**: GPT-4 for comprehensive analysis
2. **Google AI**: Gemini Pro for cost-effective processing
3. **Anthropic**: Claude for analytical tasks
4. **Azure OpenAI**: Enterprise-grade OpenAI access

### Cost Optimization
- Automatic provider selection based on task requirements
- Real-time cost tracking and limits
- Daily spending caps
- Per-request cost limits

### AI Features
- **Student Ranking**: Intelligent ranking based on multiple criteria
- **Skill Extraction**: Automated skill identification from resumes
- **Project Matching**: AI-powered student-project compatibility
- **Report Generation**: Automated analytics and insights

## 🔒 Security Features

- JWT token authentication
- Password hashing with bcrypt
- Role-based access control
- Rate limiting
- CORS protection
- Input validation with Pydantic
- SQL injection prevention

## 📊 Database Schema

The application uses the provided PostgreSQL schema with tables for:
- Users (authentication and profiles)
- Students (student-specific data)
- Mentors (mentor profiles)
- Companies (project sponsors)
- Projects (capstone projects)
- Courses (academic courses)
- Surveys (feedback collection)

## 🧪 Testing

```bash
# Run tests
pytest

# Run with coverage
pytest --cov=backend

# Run specific test file
pytest tests/test_auth.py
```

## 📈 Monitoring

### Health Checks
The `/health` endpoint provides:
- Database connectivity
- AI provider availability
- Cost usage statistics
- System performance metrics

### Logging
- Structured logging with configurable levels
- Request/response logging
- Error tracking
- Performance monitoring

## 🔧 Configuration

### Environment Variables
Key configuration options:
- `ENVIRONMENT`: development/testing/production
- `DEBUG`: Enable debug mode
- `DATABASE_URL`: Full database connection string
- AI provider API keys
- Cost optimization settings
- CORS origins

### AI Provider Configuration
Each provider can be configured with:
- Model selection
- Cost per 1K tokens
- Maximum tokens
- Supported features
- Fallback priority

## 🚀 Deployment

### Docker (Optional)
```dockerfile
FROM python:3.11-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .
EXPOSE 8000

CMD ["gunicorn", "main:app", "-w", "4", "-k", "uvicorn.workers.UvicornWorker", "--bind", "0.0.0.0:8000"]
```

### Production Checklist
- [ ] Set strong SECRET_KEY
- [ ] Configure production database
- [ ] Set up SSL/TLS
- [ ] Configure reverse proxy (nginx)
- [ ] Set up monitoring and logging
- [ ] Configure AI provider quotas
- [ ] Set appropriate CORS origins
- [ ] Enable production optimizations

## 🤝 Integration with Frontend

The backend is designed to work with the Next.js frontend. Key integration points:
- CORS configured for frontend URLs
- JWT tokens for authentication
- RESTful API design
- Structured error responses
- Comprehensive API documentation

## 📝 User Roles

### Students
- Create and manage their profile
- View assigned projects
- Access course information
- Submit survey responses

### Mentors
- View and approve students
- Rank students for projects
- Manage project assignments
- Access analytics and reports

### Administrators
- Full system access
- User management
- System configuration
- Cost monitoring
- AI provider management

## 🛟 Support

For issues and questions:
1. Check the API documentation at `/docs`
2. Review logs for error messages
3. Verify environment configuration
4. Check database connectivity
5. Validate AI provider credentials

## 📄 License

This project is part of the SMART Connect educational platform.

---

**SMART Connect Backend** - Empowering education through intelligent project management and AI-powered insights.