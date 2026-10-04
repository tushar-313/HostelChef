import os
from typing import List, Optional
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(
    title="HostelChef API",
    description="FastAPI backend powering the HostelChef AI meal assistant",
    version="1.0.0"
)

# CORS configuration for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class RecipeRequest(BaseModel):
    ingredients: str = Field(..., description="Comma-separated or free-text list of ingredients")
    time_limit: str = Field(default="15 minutes", description="Available cooking time limit")
    equipment: List[str] = Field(default_factory=lambda: ["Electric Kettle"], description="Available cooking equipment")
    dietary_preference: Optional[str] = Field(default="Any / No restriction", description="Dietary preferences")

class RecipeResponse(BaseModel):
    name: str = Field(..., description="Recipe name")
    description: str = Field(..., description="Short description")
    time: str = Field(..., description="Cooking time")
    difficulty: str = Field(..., description="Difficulty level: Easy, Medium, etc.")
    ingredients: List[str] = Field(..., description="List of required ingredients and quantities")
    steps: List[str] = Field(..., description="Step-by-step preparation instructions")
    hostel_tip: str = Field(..., description="Hostel-specific cooking tip or hack")

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "HostelChef Backend",
        "ollama_base_url": os.getenv("OLLAMA_BASE_URL", "http://localhost:11434"),
        "model": os.getenv("OLLAMA_MODEL", "gemma4:12b")
    }

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    host = os.getenv("HOST", "0.0.0.0")
    uvicorn.run("main:app", host=host, port=port, reload=True)
