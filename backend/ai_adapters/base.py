"""
Base AI Adapter for SMART Connect
Abstract base class for all AI providers
"""
from abc import ABC, abstractmethod
from typing import Dict, Any, Optional, List
from enum import Enum
from dataclasses import dataclass
import logging

logger = logging.getLogger(__name__)


class AITask(str, Enum):
    """AI task types for different use cases"""
    STUDENT_RANKING = "student_ranking"
    PROJECT_MATCHING = "project_matching"
    SKILL_EXTRACTION = "skill_extraction"
    REPORT_GENERATION = "report_generation"
    SURVEY_ANALYSIS = "survey_analysis"
    CASE_STUDY_GENERATION = "case_study_generation"
    TEXT_ANALYSIS = "text_analysis"
    CODE_GENERATION = "code_generation"


@dataclass
class AIRequest:
    """AI request data structure"""
    task: AITask
    prompt: str
    context: Optional[Dict[str, Any]] = None
    max_tokens: Optional[int] = None
    temperature: Optional[float] = None
    metadata: Optional[Dict[str, Any]] = None


@dataclass
class AIResponse:
    """AI response data structure"""
    content: str
    provider: str
    task: AITask
    cost: float
    tokens_used: int
    processing_time: float
    metadata: Optional[Dict[str, Any]] = None
    error: Optional[str] = None


class BaseAIAdapter(ABC):
    """Base class for all AI adapters"""
    
    def __init__(self, provider_name: str, api_key: str, config: Dict[str, Any]):
        self.provider_name = provider_name
        self.api_key = api_key
        self.config = config
        self.cost_per_1k_tokens = config.get("cost_per_1k_tokens", 0.002)
        self.max_tokens = config.get("max_tokens", 4000)
        self.supported_features = config.get("supported_features", [])
    
    @abstractmethod
    async def generate_response(self, request: AIRequest) -> AIResponse:
        """Generate response using AI provider"""
        pass
    
    @abstractmethod
    def is_available(self) -> bool:
        """Check if the AI provider is available"""
        pass
    
    def calculate_cost(self, tokens_used: int) -> float:
        """Calculate cost based on tokens used"""
        return (tokens_used / 1000) * self.cost_per_1k_tokens
    
    def supports_task(self, task: AITask) -> bool:
        """Check if adapter supports the given task"""
        return task.value in self.supported_features
    
    def get_provider_info(self) -> Dict[str, Any]:
        """Get provider information"""
        return {
            "name": self.provider_name,
            "cost_per_1k_tokens": self.cost_per_1k_tokens,
            "max_tokens": self.max_tokens,
            "supported_features": self.supported_features
        }