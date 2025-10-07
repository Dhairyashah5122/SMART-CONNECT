"""
AI Manager for SMART Connect
Manages multiple AI providers with cost optimization, failover, and cost tracking
"""
import asyncio
import logging
from typing import Dict, Any, List, Optional
from datetime import datetime

from .base import BaseAIAdapter, AIRequest, AIResponse, AITask
from .openai_adapter import OpenAIAdapter
from .google_adapter import GoogleAIAdapter
from .ollama_adapter import OllamaAdapter
from .huggingface_adapter import HuggingFaceAdapter
from backend.core.config import settings, AIProvider

logger = logging.getLogger(__name__)


class CostTracker:
    """Tracks AI usage costs"""

    def __init__(self):
        self.daily_costs: Dict[str, float] = {}
        self.request_costs: List[Dict[str, Any]] = []

    def add_cost(self, provider: str, cost: float, task: AITask):
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
        if date is None:
            date = datetime.now().date().isoformat()
        return self.daily_costs.get(date, 0.0)

    def is_under_daily_limit(self) -> bool:
        return self.get_daily_cost() < settings.daily_cost_limit


class AIManager:
    """Manages multiple AI providers with cost optimization and failover"""

    def __init__(self):
        self.adapters: Dict[str, BaseAIAdapter] = {}
        self.cost_tracker = CostTracker()
        self._initialize_adapters()

    def _initialize_adapters(self):
        """Initialize all AI adapters"""
        # ---------------- Dummy Adapter ----------------
        class DummyAdapter:
            cost_per_1k_tokens = 0.0
            max_tokens = 1000
            supported_features = []

            def is_available(self):
                return True

            async def generate_response(self, request: AIRequest) -> AIResponse:
                return AIResponse(
                    content="Dummy response",
                    provider="xai",
                    task=request.task,
                    cost=0.0,
                    tokens_used=0,
                    processing_time=0.0,
                    error=None
                )

        self.adapters["xai"] = DummyAdapter()
        logger.info("Dummy xAI adapter initialized (for testing only)")

        # ---------------- Ollama Adapter ----------------
        try:
            ollama_adapter = OllamaAdapter({
                "model": getattr(settings, "ollama_model", "llama2"),
                "base_url": getattr(settings, "ollama_url", "http://localhost:11434"),
                "cost_per_1k_tokens": 0.0,
                "max_tokens": 4000,
                "temperature": 0.7,
                "supported_features": ["text_generation", "analysis", "student_ranking", "skill_extraction", "report_generation"]
            })
            if ollama_adapter.is_available():
                self.adapters["ollama"] = ollama_adapter
                logger.info("Ollama adapter initialized")
        except Exception as e:
            logger.warning(f"Ollama adapter failed: {e}")

        # ---------------- HuggingFace Adapter ----------------
        try:
            hf_adapter = HuggingFaceAdapter({
                "model": getattr(settings, "huggingface_model", "microsoft/DialoGPT-medium"),
                "device": getattr(settings, "hf_device", "auto"),
                "cost_per_1k_tokens": 0.0,
                "max_tokens": 512,
                "temperature": 0.7,
                "supported_features": ["text_generation", "analysis", "skill_extraction"]
            })
            if hf_adapter.is_available():
                self.adapters["huggingface_local"] = hf_adapter
                logger.info("HuggingFace local adapter initialized")
        except Exception as e:
            logger.warning(f"HuggingFace adapter failed: {e}")

        # ---------------- Paid Providers ----------------
        if settings.openai_api_key:
            self.adapters[AIProvider.OPENAI] = OpenAIAdapter(settings.openai_api_key, {
                "model": settings.openai_model,
                "cost_per_1k_tokens": 0.002,
                "max_tokens": settings.openai_max_tokens,
                "temperature": settings.openai_temperature,
                "supported_features": ["text_generation", "code_generation", "analysis", "student_ranking", "project_matching"]
            })

        if settings.google_ai_api_key:
            self.adapters[AIProvider.GOOGLE] = GoogleAIAdapter(settings.google_ai_api_key, {
                "model": settings.google_ai_model,
                "cost_per_1k_tokens": 0.001,
                "max_tokens": 8000,
                "temperature": 0.7,
                "supported_features": ["text_generation", "analysis", "summarization", "student_ranking", "skill_extraction"]
            })

        logger.info(f"Initialized {len(self.adapters)} AI adapters")

    async def generate_response(self, request: AIRequest) -> AIResponse:
        """Generate AI response using available providers and cost optimization"""
        providers = self._get_optimal_providers(request.task)
        last_exception = None

        for provider_name in providers:
            adapter = self.adapters.get(provider_name)
            if not adapter or not adapter.is_available():
                continue
            try:
                response = await adapter.generate_response(request)
                # Track cost
                self.cost_tracker.add_cost(provider_name, response.cost, request.task)
                return response
            except Exception as e:
                last_exception = e
                logger.warning(f"Provider {provider_name} failed: {e}")

        # If all fail, raise
        raise Exception(f"All AI providers failed for task {request.task}") from last_exception

    def _get_optimal_providers(self, task: AITask) -> List[str]:
        """Return ordered list of provider names based on feature mapping"""
        provider_order = getattr(settings, "FEATURE_PROVIDER_MAP", {})
        task_name = task.value if hasattr(task, "value") else str(task)
        return provider_order.get(task_name, list(self.adapters.keys()))

    def get_provider_status(self) -> Dict[str, Dict[str, Any]]:
        """Return availability status of all AI adapters"""
        status = {}
        for name, adapter in self.adapters.items():
            try:
                available = adapter.is_available()
            except Exception:
                available = False
            status[name] = {"available": available}
        return status

    def get_cost_summary(self) -> Dict[str, float]:
        """Return cost usage summary"""
        daily_cost = self.cost_tracker.get_daily_cost()
        daily_limit = settings.daily_cost_limit
        cost_percentage = (daily_cost / daily_limit) * 100 if daily_limit else 0.0
        return {
            "daily_cost": daily_cost,
            "daily_limit": daily_limit,
            "cost_percentage": cost_percentage
        }


# Global AI manager instance
ai_manager = AIManager()
