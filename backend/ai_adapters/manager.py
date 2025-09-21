"""
AI Manager for SMART Connect
Manages multiple AI providers with cost optimization and failover
"""
import asyncio
import time
from typing import Dict, Any, List, Optional, Type
from datetime import datetime, timedelta
import logging

from .base import BaseAIAdapter, AIRequest, AIResponse, AITask
from .openai_adapter import OpenAIAdapter
from .google_adapter import GoogleAIAdapter
from .ollama_adapter import OllamaAdapter
from .huggingface_adapter import HuggingFaceAdapter, HuggingFaceAPIAdapter
from .xai_adapter import XAIAdapter
from core.config import settings, AIProvider, FEATURE_PROVIDER_MAP

logger = logging.getLogger(__name__)


class CostTracker:
    """Track AI usage costs"""
    
    def __init__(self):
        self.daily_costs: Dict[str, float] = {}
        self.request_costs: List[Dict[str, Any]] = []
    
    def add_cost(self, provider: str, cost: float, task: AITask):
        """Add cost for a request"""
        today = datetime.now().date().isoformat()
        
        if today not in self.daily_costs:
            self.daily_costs[today] = 0.0
        
        self.daily_costs[today] += cost
        
        self.request_costs.append({
            "provider": provider,
            "cost": cost,
            "task": task.value,
            "timestamp": datetime.now().isoformat()
        })
    
    def get_daily_cost(self, date: Optional[str] = None) -> float:
        """Get total cost for a specific date"""
        if date is None:
            date = datetime.now().date().isoformat()
        return self.daily_costs.get(date, 0.0)
    
    def is_under_daily_limit(self) -> bool:
        """Check if we're under the daily cost limit"""
        today_cost = self.get_daily_cost()
        return today_cost < settings.daily_cost_limit


class AIManager:
    """Manages multiple AI providers with cost optimization"""
    
    def __init__(self):
        self.adapters: Dict[str, BaseAIAdapter] = {}
        self.cost_tracker = CostTracker()
        self._initialize_adapters()
    
    def _initialize_adapters(self):
        """Initialize all available AI adapters"""
        # Free AI Providers (prioritized for cost savings)
        
        # xAI Grok - Free tier available
        xai_config = {
            "model": "grok-beta",
            "cost_per_1k_tokens": 0.0,  # Free tier
            "max_tokens": 4000,
            "temperature": 0.7,
            "supported_features": ["text_generation", "analysis", "resume_analysis", "project_matching", "survey_analysis", "report_generation"]
        }
        self.adapters["xai"] = XAIAdapter()
        logger.info("xAI Grok provider initialized (FREE TIER)")
        
        # Ollama - Completely free local models
        ollama_config = {
            "model": settings.ollama_model if hasattr(settings, 'ollama_model') else "llama2",
            "base_url": getattr(settings, 'ollama_url', "http://localhost:11434"),
            "cost_per_1k_tokens": 0.0,  # Free!
            "max_tokens": 4000,
            "temperature": 0.7,
            "supported_features": ["text_generation", "analysis", "student_ranking", "skill_extraction", "report_generation"]
        }
        try:
            ollama_adapter = OllamaAdapter(ollama_config)
            if ollama_adapter.is_available():
                self.adapters["ollama"] = ollama_adapter
                logger.info("Ollama local AI provider initialized (FREE)")
        except Exception as e:
            logger.warning(f"Ollama adapter failed to initialize: {e}")
        
        # Hugging Face Local - Free local transformers
        hf_local_config = {
            "model": getattr(settings, 'huggingface_model', "microsoft/DialoGPT-medium"),
            "device": getattr(settings, 'hf_device', "auto"),
            "cost_per_1k_tokens": 0.0,  # Free!
            "max_tokens": 512,
            "temperature": 0.7,
            "supported_features": ["text_generation", "analysis", "skill_extraction"]
        }
        try:
            hf_local_adapter = HuggingFaceAdapter(hf_local_config)
            if hf_local_adapter.is_available():
                self.adapters["huggingface_local"] = hf_local_adapter
                logger.info("Hugging Face local provider initialized (FREE)")
        except Exception as e:
            logger.warning(f"Hugging Face local adapter failed to initialize: {e}")
        
        # Hugging Face API - Free tier available
        if hasattr(settings, 'huggingface_api_key') and settings.huggingface_api_key:
            hf_api_config = {
                "model": getattr(settings, 'huggingface_api_model', "microsoft/DialoGPT-medium"),
                "cost_per_1k_tokens": 0.0,  # Free tier
                "max_tokens": 200,
                "temperature": 0.7,
                "supported_features": ["text_generation", "analysis"]
            }
            self.adapters["huggingface_api"] = HuggingFaceAPIAdapter(settings.huggingface_api_key, hf_api_config)
            logger.info("Hugging Face API provider initialized (FREE TIER)")
        
        # Paid AI Providers (fallback options)
        
        # OpenAI
        if settings.openai_api_key:
            config = {
                "model": settings.openai_model,
                "cost_per_1k_tokens": 0.002,
                "max_tokens": settings.openai_max_tokens,
                "temperature": settings.openai_temperature,
                "supported_features": ["text_generation", "code_generation", "analysis", "student_ranking", "project_matching"]
            }
            self.adapters[AIProvider.OPENAI] = OpenAIAdapter(settings.openai_api_key, config)
        
        # Google AI
        if settings.google_ai_api_key:
            config = {
                "model": settings.google_ai_model,
                "cost_per_1k_tokens": 0.001,
                "max_tokens": 8000,
                "temperature": 0.7,
                "supported_features": ["text_generation", "analysis", "summarization", "student_ranking", "skill_extraction"]
            }
            self.adapters[AIProvider.GOOGLE] = GoogleAIAdapter(settings.google_ai_api_key, config)
        
        logger.info(f"Initialized {len(self.adapters)} AI adapters (Free providers prioritized)")
        
        # Log available providers by cost
        free_providers = [name for name, adapter in self.adapters.items() if adapter.cost_per_1k_tokens == 0.0]
        paid_providers = [name for name, adapter in self.adapters.items() if adapter.cost_per_1k_tokens > 0.0]
        
        if free_providers:
            logger.info(f"FREE AI providers available: {free_providers}")
        if paid_providers:
            logger.info(f"Paid AI providers available: {paid_providers}")
        
        if not free_providers and not paid_providers:
            logger.warning("No AI providers available! Please configure at least one provider.")
    
    async def generate_response(self, request: AIRequest, preferred_provider: Optional[str] = None) -> AIResponse:
        """Generate AI response with cost optimization and failover"""
        
        # Check daily cost limit
        if not self.cost_tracker.is_under_daily_limit():
            logger.warning("Daily cost limit exceeded")
            return AIResponse(
                content="",
                provider="none",
                task=request.task,
                cost=0.0,
                tokens_used=0,
                processing_time=0.0,
                error="Daily cost limit exceeded"
            )
        
        # Get optimal provider for this task
        provider_list = self._get_optimal_providers(request.task, preferred_provider)
        
        # Try providers in order
        for provider_name in provider_list:
            if provider_name not in self.adapters:
                continue
            
            adapter = self.adapters[provider_name]
            
            if not adapter.is_available():
                logger.warning(f"Provider {provider_name} is not available")
                continue
            
            try:
                response = await adapter.generate_response(request)
                
                if response.error:
                    logger.warning(f"Error from {provider_name}: {response.error}")
                    continue
                
                # Check cost limit for this request
                if response.cost > settings.max_cost_per_request:
                    logger.warning(f"Request cost {response.cost} exceeds limit")
                    continue
                
                # Track cost
                self.cost_tracker.add_cost(provider_name, response.cost, request.task)
                
                logger.info(f"Successfully generated response using {provider_name}, cost: ${response.cost:.4f}")
                return response
                
            except Exception as e:
                logger.error(f"Error with provider {provider_name}: {str(e)}")
                continue
        
        # If all providers failed
        return AIResponse(
            content="",
            provider="none",
            task=request.task,
            cost=0.0,
            tokens_used=0,
            processing_time=0.0,
            error="All AI providers failed or unavailable"
        )
    
    def _get_optimal_providers(self, task: AITask, preferred_provider: Optional[str] = None) -> List[str]:
        """Get list of providers ordered by cost-effectiveness for the task"""
        
        # If a specific provider is requested and available
        if preferred_provider and preferred_provider in self.adapters:
            providers = [preferred_provider]
            # Add other providers as fallbacks
            for provider in self.adapters.keys():
                if provider != preferred_provider:
                    providers.append(provider)
            return providers
        
        # Use task-specific provider mapping if available
        if task in FEATURE_PROVIDER_MAP:
            task_providers = FEATURE_PROVIDER_MAP[task]
            # Filter to only available providers
            available_providers = [p for p in task_providers if p in self.adapters]
            if available_providers:
                # Sort by cost (free first)
                available_providers.sort(key=lambda p: self.adapters[p].cost_per_1k_tokens)
                return available_providers
        
        # Default: prioritize free providers, then order by cost
        available_adapters = [(name, adapter) for name, adapter in self.adapters.items()]
        
        # Sort by cost (free providers first, then cheapest)
        available_adapters.sort(key=lambda x: (x[1].cost_per_1k_tokens, x[0]))
        
        providers = [name for name, _ in available_adapters]
        
        # Log the selection strategy
        free_providers = [name for name, adapter in available_adapters if adapter.cost_per_1k_tokens == 0.0]
        if free_providers:
            logger.info(f"Prioritizing free providers: {free_providers[:3]}")  # Top 3
        
        return providers
    
    def get_cost_summary(self) -> Dict[str, Any]:
        """Get cost summary and statistics"""
        today_cost = self.cost_tracker.get_daily_cost()
        
        return {
            "daily_cost": today_cost,
            "daily_limit": settings.daily_cost_limit,
            "cost_percentage": (today_cost / settings.daily_cost_limit) * 100,
            "available_providers": list(self.adapters.keys()),
            "recent_requests": self.cost_tracker.request_costs[-10:]  # Last 10 requests
        }
    
    def get_provider_status(self) -> Dict[str, Any]:
        """Get status of all providers"""
        status = {}
        for name, adapter in self.adapters.items():
            status[name] = {
                "available": adapter.is_available(),
                "cost_per_1k_tokens": adapter.cost_per_1k_tokens,
                "max_tokens": adapter.max_tokens,
                "supported_features": adapter.supported_features
            }
        return status


# Global AI manager instance
ai_manager = AIManager()