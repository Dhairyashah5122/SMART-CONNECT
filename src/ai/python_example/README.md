# Python Backend with Genkit & FastAPI

This directory contains example code for a standalone Python backend that uses Genkit and can be called from the Next.js frontend. This allows for a hybrid architecture where you can leverage Python for specific AI tasks.

## Setup Instructions

To run the Python backend, you need to set up a separate Python environment.

### 1. Prerequisites

- Python 3.9+ installed on your system.
- `pip` (Python package installer).

### 2. Create a Virtual Environment

It is highly recommended to use a virtual environment to manage dependencies for the Python project. From your terminal, navigate to the root directory of this entire project, and then run:

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

Then, from the root of the project (with your virtual environment activated), install these dependencies:

```bash
pip install -r src/ai/python_example/requirements.txt
```

### 4. Create the API Server File

Create a new file named `main.py` inside the `src/ai/python_example` directory. This will be the entry point for your FastAPI application.

Copy the following code into `src/ai/python_example/main.py`:

```python
import os
import genkit
from genkit.flow import run
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

# Import your defined flows
from rank_students import rank_students, RankStudentsInput

# Load environment variables (e.g., for API keys)
load_dotenv()

# Initialize Genkit
genkit.init()

# Initialize FastAPI app
app = FastAPI()

# Configure CORS to allow requests from the Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:9002"],  # The port your Next.js app runs on
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define the API endpoint
@app.post("/api/v1/rank-students")
async def handle_rank_students(request: RankStudentsInput):
    """
    API endpoint to rank students for a project.
    This endpoint calls the 'rank_students' Genkit flow.
    """
    return run("call-rank-flow", lambda: rank_students(request))

# Optional: Add a root endpoint for testing
@app.get("/")
def read_root():
    return {"message": "Python Genkit backend is running"}

```

### 5. Run the Python Server

With your virtual environment still active, run the FastAPI server from the project's root directory:

```bash
uvicorn src.ai.python_example.main:app --reload
```

- `uvicorn`: The server gateway that runs your FastAPI app.
- `src.ai.python_example.main:app`: Tells uvicorn where to find the FastAPI `app` instance.
- `--reload`: Automatically restarts the server when you make changes to the code.

The Python server will now be running, typically at `http://127.0.0.1:8000`.

## How It Works

1.  The **Next.js frontend** (specifically the `TalentMatcher` component) makes a `fetch` request to `http://127.0.0.1:8000/api/v1/rank-students`.
2.  The **FastAPI server** receives this request.
3.  The `handle_rank_students` function in `main.py` calls your Python-based **Genkit flow** (`rank_students`).
4.  The Genkit flow executes the AI prompt and returns the structured data.
5.  FastAPI sends this data back to your Next.js frontend as a JSON response.

You now have a fully functional hybrid system!
