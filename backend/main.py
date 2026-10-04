import os
import logging
from typing import List, Optional
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from dotenv import load_dotenv

from .ollama_service import query_ollama, OLLAMA_BASE_URL, OLLAMA_MODEL

load_dotenv()

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("hostelchef")

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
    ingredients: str = Field(..., min_length=1, description="List of ingredients available")
    time_limit: str = Field(default="15 minutes", description="Available cooking time limit")
    equipment: List[str] = Field(default_factory=lambda: ["Electric Kettle"], description="Available equipment")
    dietary_preference: Optional[str] = Field(default="Any / No restriction", description="Dietary preferences")

class RecipeResponse(BaseModel):
    name: str = Field(..., description="Recipe name")
    description: str = Field(..., description="Short description")
    time: str = Field(..., description="Cooking time")
    difficulty: str = Field(..., description="Difficulty level")
    ingredients: List[str] = Field(..., description="List of ingredients and quantities")
    steps: List[str] = Field(..., description="Step-by-step instructions")
    hostel_tip: str = Field(..., description="Hostel tip or hack")

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "HostelChef Backend",
        "ollama_base_url": os.getenv("OLLAMA_BASE_URL", OLLAMA_BASE_URL),
        "model": os.getenv("OLLAMA_MODEL", OLLAMA_MODEL)
    }

@app.post("/generate-recipe", response_model=RecipeResponse)
async def generate_recipe(request: RecipeRequest):
    logger.info(f"Received recipe generation request with ingredients: {request.ingredients[:50]}...")
    try:
        recipe_data = await query_ollama(
            ingredients=request.ingredients,
            time_limit=request.time_limit,
            equipment=request.equipment,
            dietary_preference=request.dietary_preference or "Any / No restriction",
            model=os.getenv("OLLAMA_MODEL", OLLAMA_MODEL),
            base_url=os.getenv("OLLAMA_BASE_URL", OLLAMA_BASE_URL)
        )
        return RecipeResponse(**recipe_data)

    except ConnectionError as ce:
        logger.error(f"Ollama connection error: {ce}")
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Couldn't reach the local AI. Make sure Ollama and Gemma 4 are running."
        )
    except ValueError as ve:
        logger.error(f"Model response formatting error: {ve}")
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="The AI gave an unexpected recipe format. Please try again."
        )
    except Exception as e:
        logger.error(f"Unexpected error generating recipe: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while generating the recipe. Please try again."
        )

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    host = os.getenv("HOST", "0.0.0.0")
    uvicorn.run("backend.main:app", host=host, port=port, reload=True)
