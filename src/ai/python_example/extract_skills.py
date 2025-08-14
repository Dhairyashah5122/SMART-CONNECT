
# This is an example of what a Genkit flow would look like in a
# separate Python backend service. This file is for demonstration purposes only.

import genkit
from genkit.flow import define_flow, run
from genkit import ai
from pydantic import BaseModel

# 1. Define the Input and Output Schemas (similar to Zod in TypeScript)
class ExtractSkillsFromResumeInput(BaseModel):
    resume: str

class ExtractSkillsFromResumeOutput(BaseModel):
    skills: list[str]

# 2. Define the AI Prompt
extract_skills_prompt = ai.define_prompt(
    name="extractSkillsFromResumePrompt",
    input_schema=ExtractSkillsFromResumeInput,
    output_schema=ExtractSkillsFromResumeOutput,
    prompt="""
        You are an expert at parsing resumes and extracting key information.

        Analyze the following resume text and identify all the technical and soft skills mentioned.
        Return the skills as an array of strings.

        Resume Text:
        {{resume}}
    """
)

# 3. Define the Flow
@define_flow(
    name="extractSkillsFromResumeFlow",
    input_schema=ExtractSkillsFromResumeInput,
    output_schema=ExtractSkillsFromResumeOutput,
)
def extract_skills_from_resume(flow_input: ExtractSkillsFromResumeInput) -> ExtractSkillsFromResumeOutput:
    """The main orchestrator for the skill extraction process."""
    
    # Call the prompt with the input
    llm_response = run("call-llm", lambda: extract_skills_prompt.generate(
        input=flow_input
    ))
    
    # Return the structured output
    return llm_response.output

# In a real Python backend (e.g., using FastAPI), you would create an API 
# endpoint that calls this 'extract_skills_from_resume' flow.
