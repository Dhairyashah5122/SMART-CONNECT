"""
Ollama Local AI Adapter for SMART Connect
Free local AI models with no API costs
"""
import asyncio
import time
from typing import Dict, Any, Optional
import httpx
import json

from ai_adapters.base import BaseAIAdapter, AIRequest, AIResponse, AITask
from core.config import settings

import logging
logger = logging.getLogger(__name__)


class OllamaAdapter(BaseAIAdapter):
    """Ollama local AI adapter - completely free"""
    
    def __init__(self, config: Dict[str, Any]):
        super().__init__("Ollama", "", config)  # No API key needed
        self.base_url = config.get("base_url", "http://localhost:11434")
        self.model = config.get("model", "llama2")
        self.default_temperature = config.get("temperature", 0.7)
        self.timeout = config.get("timeout", 120)
    
    async def generate_response(self, request: AIRequest) -> AIResponse:
        """Generate response using Ollama local model"""
        start_time = time.time()
        
        try:
            # Prepare the request
            prompt = self._build_prompt(request)
            
            payload = {
                "model": self.model,
                "prompt": prompt,
                "stream": False,
                "options": {
                    "temperature": request.temperature or self.default_temperature,
                    "num_predict": request.max_tokens or self.max_tokens
                }
            }
            
            # Make request to local Ollama server
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                response = await client.post(
                    f"{self.base_url}/api/generate",
                    json=payload
                )
                response.raise_for_status()
                result = response.json()
            
            # Extract response data
            content = result.get("response", "")
            
            # Estimate tokens (Ollama doesn't provide exact counts)
            estimated_tokens = len(content.split()) * 1.3
            cost = 0.0  # Free!
            processing_time = time.time() - start_time
            
            return AIResponse(
                content=content,
                provider=self.provider_name,
                task=request.task,
                cost=cost,
                tokens_used=int(estimated_tokens),
                processing_time=processing_time,
                metadata={
                    "model": self.model,
                    "local": True,
                    "done": result.get("done", False),
                    "total_duration": result.get("total_duration", 0)
                }
            )
            
        except httpx.ConnectError:
            error_msg = f"Cannot connect to Ollama server at {self.base_url}. Make sure Ollama is running."
            logger.error(error_msg)
            return AIResponse(
                content="",
                provider=self.provider_name,
                task=request.task,
                cost=0.0,
                tokens_used=0,
                processing_time=time.time() - start_time,
                error=error_msg
            )
        except Exception as e:
            logger.error(f"Ollama API error: {str(e)}")
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
        """Check if Ollama server is running"""
        try:
            import httpx
            with httpx.Client(timeout=5) as client:
                response = client.get(f"{self.base_url}/api/tags")
                return response.status_code == 200
        except Exception:
            return False
    
    def _build_prompt(self, request: AIRequest) -> str:
        """Build complete prompt for Ollama"""
        system_prompt = self._get_system_prompt(request.task)
        
        parts = [system_prompt]
        
        if request.context:
            parts.append(f"Context: {json.dumps(request.context, indent=2)}")
        
        parts.append(f"Request: {request.prompt}")
        parts.append("Please provide a detailed, structured response:")
        
        return "\n\n".join(parts)
    
    def _get_system_prompt(self, task: AITask) -> str:
        """Get system prompt based on task type"""
        prompts = {
            AITask.STUDENT_RANKING: "You are an expert education consultant. Analyze and rank students for capstone projects based on their profiles, skills, and academic performance. Provide detailed reasoning for each ranking.",
            AITask.PROJECT_MATCHING: "You are a project management expert. Match students to projects based on their skills, interests, and project requirements. Explain compatibility factors.",
            AITask.SKILL_EXTRACTION: "You are an HR technology expert. Extract and categorize skills from resumes and student profiles. Identify both technical and soft skills.",
            AITask.REPORT_GENERATION: "You are a professional report writer. Create comprehensive, well-structured reports with clear sections, insights, and recommendations.",
            AITask.SURVEY_ANALYSIS: "You are a data analyst specializing in educational surveys. Analyze responses, identify trends, and provide actionable insights.",
            AITask.CASE_STUDY_GENERATION: "You are an educational content creator. Develop engaging case studies that illustrate key concepts and learning outcomes.",
            AITask.TEXT_ANALYSIS: "You are a text analysis expert. Provide thorough analysis with key insights, themes, and structured summaries.",
            AITask.CODE_GENERATION: "You are a senior software engineer. Write clean, well-documented, and efficient code following best practices."
        }
        
        return prompts.get(task, "You are a helpful AI assistant for the SMART Connect educational platform. Provide accurate, detailed, and well-structured responses.")