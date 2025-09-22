# Python Backend with Genkit & FastAPI

This directory contains example code for a standalone Python backend that uses Genkit and can be called from the Next.js frontend. This allows for a hybrid architecture where you can leverage Python for specific AI tasks.

## Recommended File Structure

For a clean and scalable backend, we recommend the following structure inside the `src/ai/python_example` directory. You will need to create these folders and files manually.

## Setup Instructions

### 1. Prerequisites

- Python 3.9+ installed on your system.
- `pip` (Python package installer).

### 2. Create a Virtual Environment

It is highly recommended to use a virtual environment to manage dependencies. From your project's **root directory**, run:

```bash
# Create a virtual environment named 'venv'
python3 -m venv venv

# Activate the virtual environment
# On macOS and Linux:
source venv/bin/activate
# On Windows:
# venv\Scripts\activate
```

### 3. Install Dependencies

Create a `requirements.txt` file inside the `src/ai/python_example` directory with the following content:

```txt
# Web Framework
fastapi
uvicorn[standard]

# Genkit
genkit
google-genkit

# Pydantic for data validation
pydantic

# For environment variables
python-dotenv

# For API calls between services
requests
```

Then, from the project's **root directory** (with your virtual environment activated), install these dependencies:

```bash
pip install -r src/ai/python_example/requirements.txt
```

### 4. Create the Backend Files

Based on the structure above, create the Python files.

**`src/ai/python_example/flows/rank_students_flow.py`**:
This file will contain your core Genkit AI logic. (This is the same logic as the example `rank_students.py` file).

**`src/ai/python_example/api/v1/schemas.py`**:
This file defines the data shapes for your API.

```python
from pydantic import BaseModel
from typing import List

class StudentCandidate(BaseModel):
    id: str
    name: str
    resume: str

class RankStudentsRequest(BaseModel):
    project_description: str
    students: List[StudentCandidate]

class RankedStudent(BaseModel):
    studentId: str
    matchScore: int
    justification: str

class RankStudentsResponse(BaseModel):
    rankedStudents: List[RankedStudent]
```

**`src/ai/python_example/api/v1/endpoints/rank_students.py`**:
This file defines the API endpoint.

```python
from fastapi import APIRouter
from src.ai.python_example.api.v1.schemas import RankStudentsRequest, RankStudentsResponse
from src.ai.python_example.flows.rank_students_flow import rank_students_flow # Assuming your flow is named this

router = APIRouter()

@router.post("/rank-students", response_model=RankStudentsResponse)
async def handle_rank_students(request: RankStudentsRequest):
    """
    API endpoint to rank students for a project.
    This endpoint calls the 'rank_students_flow' Genkit flow.
    """
    # Note: Genkit's 'run' is often used inside flows, not at the API layer.
    # You would call your flow function directly.
    result = rank_students_flow(request)
    return result
```

**`src/ai/python_example/main.py`**:
This is your main application entry point. **The `CORSMiddleware` is essential to fix fetch errors from the frontend.**

```python
import os
import genkit
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

# Import the API router
from src.ai.python_example.api.v1.endpoints import rank_students

# Load environment variables (e.g., for API keys)
load_dotenv()

# Initialize Genkit (ensure your flows are implicitly discovered or imported)
genkit.init()

# Initialize FastAPI app
app = FastAPI(title="SMART CONNECTION AI Backend")

# Configure CORS to allow requests from the Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:9002"],  # The port your Next.js app runs on
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include the API router
app.include_router(rank_students.router, prefix="/api/v1", tags=["v1"])

@app.get("/")
def read_root():
    return {"message": "SMART CONNECTION Python AI backend is running"}

```

### 5. Run the Python Server

With your virtual environment still active, run the FastAPI server from the project's **root directory**:

```bash
uvicorn src.ai.python_example.main:app --reload
```

- `uvicorn`: The server that runs your FastAPI app.
- `src.ai.python_example.main:app`: Tells uvicorn where to find the FastAPI `app` instance.
- `--reload`: Automatically restarts the server when you make changes.

Your Python server will now be running, typically at `http://127.0.0.1:8000`.

## How It Works

1. The **Next.js frontend** makes a `fetch` request to `http://127.0.0.1:8000/api/v1/rank-students`.
2. The **FastAPI server** receives this request in `main.py` and routes it to the `handle_rank_students` function in `api/v1/endpoints/rank_students.py`.
3. The endpoint function calls your Python-based **Genkit flow** from `flows/rank_students_flow.py`.
4. The Genkit flow executes the AI prompt and returns the structured data.
5. FastAPI sends this data back to your Next.js frontend as a JSON response.

You now have a fully functional hybrid system!
