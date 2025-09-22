"""
SMART Connect Configuration
Core settings for the application including database, AI providers, and API settings.
"""
import os
from typing import Optional, Dict, Any
from pydantic_settings import BaseSettings
from pydantic import validator
from enum import Enum


class Environment(str, Enum):
    DEVELOPMENT = "development"
    TESTING = "testing"
    PRODUCTION = "production"


class AIProvider(str, Enum):
    OPENAI = "openai"
    GOOGLE = "google"
    ANTHROPIC = "anthropic"
    AZURE_OPENAI = "azure_openai"


class Settings(BaseSettings):
    # Application Settings
    app_name: str = "SMART Connect API"
    app_version: str = "1.0.0"
    environment: Environment = Environment.DEVELOPMENT
    debug: bool = False
    
    # Server Settings
    host: str = "0.0.0.0"
    port: int = 8001
    reload: bool = True
    
    # Database Settings
    database_url: Optional[str] = None
    db_host: str = "localhost"
    db_port: int = 5433
    db_name: str = "smart_connect"
    db_user: str = "smart_connect_user"
    db_password: str = "SmartConnect2024!"
    db_schema: str = "capstone"
    
    # Security
    secret_key: str = "your-secret-key-change-in-production"
    access_token_expire_minutes: int = 30
    algorithm: str = "HS256"
    
    # AI Provider Settings
    primary_ai_provider: AIProvider = AIProvider.OPENAI
    fallback_ai_provider: AIProvider = AIProvider.GOOGLE
    
    # OpenAI Settings
    openai_api_key: Optional[str] = None
    openai_model: str = "gpt-4"
    openai_max_tokens: int = 2000
    openai_temperature: float = 0.7
    
    # Google AI Settings
    google_ai_api_key: Optional[str] = None
    google_ai_model: str = "gemini-pro"
    
    # Anthropic Settings
    anthropic_api_key: Optional[str] = None
    anthropic_model: str = "claude-3-sonnet-20240229"
    
    # Azure OpenAI Settings
    azure_openai_api_key: Optional[str] = None
    azure_openai_endpoint: Optional[str] = None
    azure_openai_api_version: str = "2024-02-15-preview"
    azure_openai_deployment_name: str = "gpt-4"
    
    # Cost Optimization Settings
    cost_optimization_enabled: bool = True
    max_cost_per_request: float = 0.50  # Maximum cost per AI request in USD
    daily_cost_limit: float = 100.0     # Daily cost limit in USD
    
    # Rate Limiting
    rate_limit_per_minute: int = 100
    rate_limit_per_hour: int = 1000
    
    # CORS Settings
    cors_origins: list = ["http://localhost:3000", "http://localhost:3001"]
    cors_allow_credentials: bool = True
    cors_allow_methods: list = ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
    cors_allow_headers: list = ["*"]
    
    @validator("database_url", pre=True)
    def assemble_db_connection(cls, v: Optional[str], values: Dict[str, Any]) -> str:
        if isinstance(v, str):
            return v
        return f"postgresql://{values.get('db_user')}:{values.get('db_password')}@{values.get('db_host')}:{values.get('db_port')}/{values.get('db_name')}"
    
    @validator("debug", pre=True)
    def set_debug_mode(cls, v: Optional[bool], values: Dict[str, Any]) -> bool:
        if values.get("environment") == Environment.DEVELOPMENT:
            return True
        return v or False
    
    class Config:
        env_file = ".env"
        case_sensitive = False
        extra = "allow"  # Allow extra fields from .env file


# Global settings instance
settings = Settings()


# AI Provider Configuration
AI_PROVIDER_CONFIG = {
    AIProvider.OPENAI: {
        "cost_per_1k_tokens": 0.002,  # GPT-4 pricing
        "max_tokens": 4000,
        "supported_features": ["text_generation", "code_generation", "analysis"]
    },
    AIProvider.GOOGLE: {
        "cost_per_1k_tokens": 0.001,  # Gemini Pro pricing
        "max_tokens": 8000,
        "supported_features": ["text_generation", "analysis", "summarization"]
    },
    AIProvider.ANTHROPIC: {
        "cost_per_1k_tokens": 0.003,  # Claude pricing
        "max_tokens": 4000,
        "supported_features": ["text_generation", "analysis", "code_generation"]
    },
    AIProvider.AZURE_OPENAI: {
        "cost_per_1k_tokens": 0.002,  # Similar to OpenAI
        "max_tokens": 4000,
        "supported_features": ["text_generation", "code_generation", "analysis"]
    }
}


# Feature to Provider Mapping (for cost optimization)
FEATURE_PROVIDER_MAP = {
    "student_ranking": [AIProvider.GOOGLE, AIProvider.OPENAI],
    "project_matching": [AIProvider.OPENAI, AIProvider.GOOGLE],
    "skill_extraction": [AIProvider.GOOGLE, AIProvider.ANTHROPIC],
    "report_generation": [AIProvider.ANTHROPIC, AIProvider.OPENAI],
    "survey_analysis": [AIProvider.GOOGLE, AIProvider.OPENAI],
    "case_study_generation": [AIProvider.OPENAI, AIProvider.ANTHROPIC]
}