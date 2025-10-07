"""
Hugging Face Transformers Adapter for SMART Connect
Free AI models using Hugging Face transformers library
"""
import asyncio
import time
from typing import Dict, Any, Optional
import json

from backend.ai_adapters.base import BaseAIAdapter, AIRequest, AIResponse, AITask
from backend.core.config import settings

import logging
logger = logging.getLogger(__name__)

# Check if transformers is available
try:
    from transformers import pipeline, AutoTokenizer, AutoModelForCausalLM
    import torch
    TRANSFORMERS_AVAILABLE = True
except ImportError:
    TRANSFORMERS_AVAILABLE = False
    logger.warning("Transformers library not available. Install with: pip install transformers torch")


class HuggingFaceAdapter(BaseAIAdapter):
    """Hugging Face transformers adapter - free local models"""
    
    def __init__(self, config: Dict[str, Any]):
        super().__init__("Hugging Face", "", config)  # No API key needed
        self.model_name = config.get("model", "microsoft/DialoGPT-medium")
        self.device = config.get("device", "auto")
        self.max_length = config.get("max_length", 512)
        self.default_temperature = config.get("temperature", 0.7)
        
        self.pipeline = None
        self.tokenizer = None
        
        if TRANSFORMERS_AVAILABLE:
            self._load_model()
    
    def _load_model(self):
        """Load the Hugging Face model"""
        try:
            # Determine device
            if self.device == "auto":
                device = 0 if torch.cuda.is_available() else -1
            else:
                device = self.device
            
            # Load pipeline for text generation
            self.pipeline = pipeline(
                "text-generation",
                model=self.model_name,
                device=device,
                torch_dtype=torch.float16 if torch.cuda.is_available() else torch.float32
            )
            
            self.tokenizer = AutoTokenizer.from_pretrained(self.model_name)
            logger.info(f"Loaded Hugging Face model: {self.model_name}")
            
        except Exception as e:
            logger.error(f"Error loading Hugging Face model: {e}")
            self.pipeline = None
    
    async def generate_response(self, request: AIRequest) -> AIResponse:
        """Generate response using Hugging Face model"""
        start_time = time.time()
        
        if not TRANSFORMERS_AVAILABLE or not self.pipeline:
            return AIResponse(
                content="",
                provider=self.provider_name,
                task=request.task,
                cost=0.0,
                tokens_used=0,
                processing_time=time.time() - start_time,
                error="Hugging Face transformers not available or model not loaded"
            )
        
        try:
            # Prepare the prompt
            prompt = self._build_prompt(request)
            
            # Truncate prompt if too long
            max_input_length = self.max_length // 2  # Reserve space for output
            if len(prompt) > max_input_length:
                prompt = prompt[:max_input_length] + "..."
            
            # Generate response
            result = await asyncio.to_thread(
                self.pipeline,
                prompt,
                max_length=request.max_tokens or self.max_length,
                temperature=request.temperature or self.default_temperature,
                do_sample=True,
                pad_token_id=self.tokenizer.eos_token_id,
                num_return_sequences=1
            )
            
            # Extract generated text
            generated_text = result[0]["generated_text"]
            
            # Remove the input prompt from the response
            if generated_text.startswith(prompt):
                content = generated_text[len(prompt):].strip()
            else:
                content = generated_text.strip()
            
            # Estimate tokens
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
                    "model": self.model_name,
                    "local": True,
                    "device": self.device,
                    "max_length": self.max_length
                }
            )
            
        except Exception as e:
            logger.error(f"Hugging Face generation error: {str(e)}")
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
        """Check if Hugging Face adapter is available"""
        return TRANSFORMERS_AVAILABLE and self.pipeline is not None
    
    def _build_prompt(self, request: AIRequest) -> str:
        """Build prompt for Hugging Face model"""
        system_prompt = self._get_system_prompt(request.task)
        
        # Simple prompt format for better compatibility
        prompt_parts = [
            f"Task: {system_prompt}",
            ""
        ]
        
        if request.context:
            prompt_parts.append(f"Context: {json.dumps(request.context, indent=2)}")
            prompt_parts.append("")
        
        prompt_parts.append(f"Input: {request.prompt}")
        prompt_parts.append("Output:")
        
        return "\n".join(prompt_parts)
    
    def _get_system_prompt(self, task: AITask) -> str:
        """Get concise system prompt for the task"""
        prompts = {
            AITask.STUDENT_RANKING: "Rank students for projects based on skills and qualifications",
            AITask.PROJECT_MATCHING: "Match students to suitable projects",
            AITask.SKILL_EXTRACTION: "Extract skills from resume text",
            AITask.REPORT_GENERATION: "Generate professional report",
            AITask.SURVEY_ANALYSIS: "Analyze survey data and provide insights",
            AITask.CASE_STUDY_GENERATION: "Create educational case study",
            AITask.TEXT_ANALYSIS: "Analyze and summarize text",
            AITask.CODE_GENERATION: "Generate clean, documented code"
        }
        
        return prompts.get(task, "Provide helpful assistance for educational platform")


class HuggingFaceAPIAdapter(BaseAIAdapter):
    """Hugging Face Inference API adapter - free tier available"""
    
    def __init__(self, api_key: str, config: Dict[str, Any]):
        super().__init__("Hugging Face API", api_key, config)
        self.model = config.get("model", "microsoft/DialoGPT-medium")
        self.api_url = f"https://api-inference.huggingface.co/models/{self.model}"
        self.default_temperature = config.get("temperature", 0.7)
    
    async def generate_response(self, request: AIRequest) -> AIResponse:
        """Generate response using Hugging Face Inference API"""
        start_time = time.time()
        
        try:
            import httpx
            
            prompt = self._build_prompt(request)
            
            headers = {
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json"
            }
            
            payload = {
                "inputs": prompt,
                "parameters": {
                    "temperature": request.temperature or self.default_temperature,
                    "max_new_tokens": request.max_tokens or 200,
                    "return_full_text": False
                }
            }
            
            async with httpx.AsyncClient(timeout=60) as client:
                response = await client.post(
                    self.api_url,
                    headers=headers,
                    json=payload
                )
                response.raise_for_status()
                result = response.json()
            
            # Extract response
            if isinstance(result, list) and len(result) > 0:
                content = result[0].get("generated_text", "")
            else:
                content = str(result)
            
            estimated_tokens = len(content.split()) * 1.3
            cost = 0.0  # Free tier
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
                    "api": True
                }
            )
            
        except Exception as e:
            logger.error(f"Hugging Face API error: {str(e)}")
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
        """Check if API key is available"""
        return self.api_key is not None and len(self.api_key) > 0
    
    def _build_prompt(self, request: AIRequest) -> str:
        """Build simple prompt for API"""
        system_prompt = self._get_system_prompt(request.task)
        
        parts = [system_prompt]
        if request.context:
            parts.append(f"Context: {request.context}")
        parts.append(request.prompt)
        
        return "\n\n".join(parts)
    
    def _get_system_prompt(self, task: AITask) -> str:
        """Get system prompt for task"""
        prompts = {
            AITask.STUDENT_RANKING: "You are an education expert. Rank students based on their qualifications.",
            AITask.PROJECT_MATCHING: "You are a project manager. Match students to appropriate projects.",
            AITask.SKILL_EXTRACTION: "You are an HR analyst. Extract skills from the given text.",
            AITask.REPORT_GENERATION: "You are a report writer. Create a professional report.",
            AITask.SURVEY_ANALYSIS: "You are a data analyst. Analyze the survey data.",
            AITask.CASE_STUDY_GENERATION: "You are an educator. Create a case study.",
            AITask.TEXT_ANALYSIS: "You are a text analyst. Provide analysis and insights.",
            AITask.CODE_GENERATION: "You are a software engineer. Write clean code."
        }
        
        return prompts.get(task, "You are a helpful assistant.")