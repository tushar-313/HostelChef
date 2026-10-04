import os
import logging
from typing import List, Optional
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from dotenv import load_dotenv

from .gemma_service import generate_recipe_with_gemma, GEMMA_MODEL

load_dotenv()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("hostelchef")

app = FastAPI(
    title="HostelChef API",
    description="FastAPI backend powering the HostelChef AI meal assistant with Google Gemma 4",
    version="2.0.0"
)

# CORS configuration
frontend_url = os.getenv("FRONTEND_URL", "http://localhost:5173")
origins = [
    frontend_url,
    "http://localhost:5173",
    "http://localhost:3000",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins if origins else ["*"],
    allow_origin_regex=r"https?://.*" if not origins else None,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class RecipeRequest(BaseModel):
    ingredients: str = Field(..., min_length=1, description="List of available ingredients")
    time_limit: str = Field(default="15 minutes", description="Available cooking time limit")
    equipment: List[str] = Field(default_factory=lambda: ["Pan / Kadai"], description="Available equipment")
    dietary_preference: Optional[str] = Field(default="Any / No restriction", description="Dietary preferences")

class RecipeResponse(BaseModel):
    name: str = Field(..., description="Recipe name")
    description: str = Field(..., description="Short description")
    time: str = Field(..., description="Cooking time")
    difficulty: str = Field(..., description="Difficulty level")
    ingredients: List[str] = Field(..., description="List of ingredients with quantities")
    steps: List[str] = Field(..., description="Step-by-step instructions")
    hostel_tip: str = Field(..., description="Hostel tip or hack")

@app.get("/health")
async def health_check():
    api_key_configured = bool(os.getenv("GOOGLE_API_KEY") or os.getenv("GEMINI_API_KEY"))
    return {
        "status": "healthy",
        "service": "HostelChef Backend",
        "provider": "Google GenAI API",
        "model": os.getenv("GEMMA_MODEL", GEMMA_MODEL),
        "api_configured": api_key_configured
    }

@app.post("/generate-recipe", response_model=RecipeResponse)
async def generate_recipe(request: RecipeRequest):
    logger.info(f"Received recipe request with ingredients: {request.ingredients[:60]}...")
    try:
        recipe_data = generate_recipe_with_gemma(
            ingredients=request.ingredients,
            time_limit=request.time_limit,
            equipment=request.equipment,
            dietary_preference=request.dietary_preference or "Any / No restriction",
            model=os.getenv("GEMMA_MODEL", GEMMA_MODEL)
        )
        return RecipeResponse(**recipe_data)

    except ValueError as ve:
        logger.error(f"Value/formatting error: {ve}")
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Chef couldn't prepare this one right now. Please try again."
        )
    except Exception as e:
        logger.error(f"Google GenAI error: {type(e).__name__}")
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Chef couldn't prepare this one right now. Please try again."
        )

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    host = os.getenv("HOST", "0.0.0.0")
    uvicorn.run("backend.main:app", host=host, port=port, reload=True)
