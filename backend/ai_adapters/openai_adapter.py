"""
OpenAI Adapter for SMART Connect
OpenAI GPT integration with cost optimization
"""
import asyncio
import time
from typing import Dict, Any, Optional
import openai
from openai import AsyncOpenAI

from ai_adapters.base import BaseAIAdapter, AIRequest, AIResponse, AITask
from core.config import settings

import logging
logger = logging.getLogger(__name__)


class OpenAIAdapter(BaseAIAdapter):
    """OpenAI GPT adapter with cost optimization"""
    
    def __init__(self, api_key: str, config: Dict[str, Any]):
        super().__init__("OpenAI", api_key, config)
        self.client = AsyncOpenAI(api_key=api_key)
        self.model = config.get("model", "gpt-4")
        self.default_temperature = config.get("temperature", 0.7)
    
    async def generate_response(self, request: AIRequest) -> AIResponse:
        """Generate response using OpenAI"""
        start_time = time.time()
        
        try:
            # Prepare the request
            messages = [
                {"role": "system", "content": self._get_system_prompt(request.task)},
                {"role": "user", "content": request.prompt}
            ]
            
            # Add context if provided
            if request.context:
                context_message = f"Context: {request.context}"
                messages.insert(1, {"role": "user", "content": context_message})
            
            # Make API call
            response = await self.client.chat.completions.create(
                model=self.model,
                messages=messages,
                max_tokens=request.max_tokens or self.max_tokens,
                temperature=request.temperature or self.default_temperature
            )
            
            # Extract response data
            content = response.choices[0].message.content
            tokens_used = response.usage.total_tokens
            cost = self.calculate_cost(tokens_used)
            processing_time = time.time() - start_time
            
            return AIResponse(
                content=content,
                provider=self.provider_name,
                task=request.task,
                cost=cost,
                tokens_used=tokens_used,
                processing_time=processing_time,
                metadata={
                    "model": self.model,
                    "prompt_tokens": response.usage.prompt_tokens,
                    "completion_tokens": response.usage.completion_tokens
                }
            )
            
        except Exception as e:
            logger.error(f"OpenAI API error: {str(e)}")
            return AIResponse(
                content="",
                provider=self.provider_name,
                task=request.task,
                cost=0.0,
                tokens_used=0,
                processing_time=time.time() - start_time,
                error=str(e)
            )
    
    def is_available(self) -> bool:
        """Check if OpenAI is available"""
        try:
            # Simple availability check
            return self.api_key is not None and len(self.api_key) > 0
        except Exception:
            return False
    
    def _get_system_prompt(self, task: AITask) -> str:
        """Get system prompt based on task type"""
        prompts = {
            AITask.STUDENT_RANKING: "You are an expert education consultant specializing in student assessment and ranking for capstone projects.",
            AITask.PROJECT_MATCHING: "You are an expert project manager specializing in matching students to appropriate capstone projects.",
            AITask.SKILL_EXTRACTION: "You are an expert HR analyst specializing in extracting and categorizing skills from resumes and profiles.",
            AITask.REPORT_GENERATION: "You are a professional report writer specializing in educational and project analytics.",
            AITask.SURVEY_ANALYSIS: "You are a data analyst specializing in survey analysis and insights generation.",
            AITask.CASE_STUDY_GENERATION: "You are an educational content creator specializing in case study development.",
            AITask.TEXT_ANALYSIS: "You are a text analysis expert providing detailed insights and summaries.",
            AITask.CODE_GENERATION: "You are a senior software engineer providing clean, efficient, and well-documented code."
        }
        
        return prompts.get(task, "You are a helpful AI assistant for the SMART Connect educational platform.")