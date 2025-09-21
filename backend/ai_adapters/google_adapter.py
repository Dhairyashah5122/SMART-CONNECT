"""
Google AI Adapter for SMART Connect
Google Gemini integration with cost optimization
"""
import asyncio
import time
from typing import Dict, Any, Optional
import google.generativeai as genai

from ai_adapters.base import BaseAIAdapter, AIRequest, AIResponse, AITask
from core.config import settings

import logging
logger = logging.getLogger(__name__)


class GoogleAIAdapter(BaseAIAdapter):
    """Google Gemini adapter with cost optimization"""
    
    def __init__(self, api_key: str, config: Dict[str, Any]):
        super().__init__("Google AI", api_key, config)
        genai.configure(api_key=api_key)
        self.model_name = config.get("model", "gemini-pro")
        self.model = genai.GenerativeModel(self.model_name)
        self.default_temperature = config.get("temperature", 0.7)
    
    async def generate_response(self, request: AIRequest) -> AIResponse:
        """Generate response using Google AI"""
        start_time = time.time()
        
        try:
            # Prepare the prompt
            full_prompt = self._build_prompt(request)
            
            # Configure generation
            generation_config = {
                "temperature": request.temperature or self.default_temperature,
                "max_output_tokens": request.max_tokens or self.max_tokens,
                "top_p": 0.8,
                "top_k": 40
            }
            
            # Make API call
            response = await asyncio.to_thread(
                self.model.generate_content,
                full_prompt,
                generation_config=generation_config
            )
            
            # Extract response data
            content = response.text
            # Note: Google AI doesn't provide exact token counts in the same way
            # We'll estimate based on content length
            estimated_tokens = len(content.split()) * 1.3  # Rough estimation
            cost = self.calculate_cost(int(estimated_tokens))
            processing_time = time.time() - start_time
            
            return AIResponse(
                content=content,
                provider=self.provider_name,
                task=request.task,
                cost=cost,
                tokens_used=int(estimated_tokens),
                processing_time=processing_time,
                metadata={
                    "model": self.model_name,
                    "safety_ratings": getattr(response, 'safety_ratings', []),
                    "finish_reason": getattr(response, 'finish_reason', None)
                }
            )
            
        except Exception as e:
            logger.error(f"Google AI API error: {str(e)}")
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
        """Check if Google AI is available"""
        try:
            return self.api_key is not None and len(self.api_key) > 0
        except Exception:
            return False
    
    def _build_prompt(self, request: AIRequest) -> str:
        """Build complete prompt for Google AI"""
        system_prompt = self._get_system_prompt(request.task)
        
        parts = [system_prompt]
        
        if request.context:
            parts.append(f"Context: {request.context}")
        
        parts.append(f"Request: {request.prompt}")
        
        return "\n\n".join(parts)
    
    def _get_system_prompt(self, task: AITask) -> str:
        """Get system prompt based on task type"""
        prompts = {
            AITask.STUDENT_RANKING: "You are an expert education consultant specializing in student assessment and ranking for capstone projects. Provide detailed, analytical responses.",
            AITask.PROJECT_MATCHING: "You are an expert project manager specializing in matching students to appropriate capstone projects. Focus on compatibility and success factors.",
            AITask.SKILL_EXTRACTION: "You are an expert HR analyst specializing in extracting and categorizing skills from resumes and profiles. Be precise and comprehensive.",
            AITask.REPORT_GENERATION: "You are a professional report writer specializing in educational and project analytics. Create structured, professional reports.",
            AITask.SURVEY_ANALYSIS: "You are a data analyst specializing in survey analysis and insights generation. Provide actionable insights.",
            AITask.CASE_STUDY_GENERATION: "You are an educational content creator specializing in case study development. Create engaging, educational content.",
            AITask.TEXT_ANALYSIS: "You are a text analysis expert providing detailed insights and summaries. Be thorough and analytical.",
            AITask.CODE_GENERATION: "You are a senior software engineer providing clean, efficient, and well-documented code."
        }
        
        return prompts.get(task, "You are a helpful AI assistant for the SMART Connect educational platform.")