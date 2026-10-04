import os
import json
import re
import logging
from typing import Dict, Any, List
from google import genai
from google.genai import types
from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger("hostelchef")

GEMMA_MODEL = os.getenv("GEMMA_MODEL", "gemma-4-26b-a4b-it")

SYSTEM_INSTRUCTION = """You are HostelChef, a practical cooking assistant for hostel students.

Create a simple, affordable meal using the ingredients provided by the user.

Rules:
- Primarily use ingredients the user actually has.
- Do not invent unavailable ingredients.
- Basic ingredients such as salt, water, and a small amount of cooking oil may be assumed when reasonable.
- Respect the available cooking equipment.
- Respect the maximum cooking time.
- Prefer recipes requiring minimal utensils.
- Give realistic quantities.
- Keep instructions beginner-friendly.
- Return ONLY valid JSON matching the requested schema.
- Do not use markdown code fences.
- Do not add explanations outside the JSON.

Expected JSON Schema:
{
  "name": "Recipe name",
  "description": "A quick hostel-friendly meal.",
  "time": "15 minutes",
  "difficulty": "Easy",
  "ingredients": [
    "item 1 with quantity",
    "item 2 with quantity"
  ],
  "steps": [
    "Step 1 instruction",
    "Step 2 instruction"
  ],
  "hostel_tip": "Hostel hack or shortcut"
}"""

def get_genai_client() -> genai.Client:
    api_key = os.getenv("GOOGLE_API_KEY") or os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise ValueError("Google API key is not configured on the backend server.")
    return genai.Client(api_key=api_key)

def build_prompt(
    ingredients: str,
    time_limit: str,
    equipment: List[str],
    dietary_preference: str = "Any / No restriction"
) -> str:
    equipment_str = ", ".join(equipment) if equipment else "No appliances / Cold prep only"
    return f"""Please create a hostel recipe based on these constraints:

Ingredients provided: {ingredients}
Available cooking time: {time_limit}
Cooking equipment: {equipment_str}
Dietary preference: {dietary_preference}

Return ONLY valid JSON matching the required schema with keys: name, description, time, difficulty, ingredients, steps, hostel_tip."""

def parse_recipe_json(raw_text: str) -> Dict[str, Any]:
    """Parse JSON output from Gemma 4, safely handling optional markdown blocks."""
    cleaned = raw_text.strip()
    
    # Strip markdown code fences if present
    fence_match = re.search(r"```(?:json)?\s*([\s\S]*?)\s*```", cleaned, re.IGNORECASE)
    if fence_match:
        cleaned = fence_match.group(1).strip()
    else:
        # Extract the outermost JSON object
        bracket_match = re.search(r"\{[\s\S]*\}", cleaned)
        if bracket_match:
            cleaned = bracket_match.group(0)

    try:
        data = json.loads(cleaned)
    except Exception as err:
        logger.error(f"Failed to parse JSON: {err} | Raw text was: {raw_text[:200]}")
        raise ValueError(f"Could not parse model output as JSON: {err}")

    # Ensure required keys exist
    required_keys = ["name", "description", "time", "difficulty", "ingredients", "steps", "hostel_tip"]
    for key in required_keys:
        if key not in data:
            if key in ["ingredients", "steps"]:
                data[key] = []
            else:
                data[key] = "Quick Hostel Dish"

    # Normalize ingredients and steps to list of strings
    if not isinstance(data["ingredients"], list):
        data["ingredients"] = [str(data["ingredients"])]
    else:
        data["ingredients"] = [str(i) for i in data["ingredients"]]

    if not isinstance(data["steps"], list):
        data["steps"] = [str(data["steps"])]
    else:
        data["steps"] = [str(s) for s in data["steps"]]

    return data

def generate_recipe_with_gemma(
    ingredients: str,
    time_limit: str,
    equipment: List[str],
    dietary_preference: str = "Any / No restriction",
    model: str = None
) -> Dict[str, Any]:
    active_model = model or os.getenv("GEMMA_MODEL", GEMMA_MODEL)
    client = get_genai_client()

    prompt = build_prompt(ingredients, time_limit, equipment, dietary_preference)
    full_prompt = f"{SYSTEM_INSTRUCTION}\n\nUser Request:\n{prompt}"

    try:
        response = client.models.generate_content(
            model=active_model,
            contents=full_prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json"
            )
        )
        if not response.text:
            raise ValueError("Empty response received from Gemma model.")
        return parse_recipe_json(response.text)
    except Exception as e:
        logger.error(f"Google GenAI API call failed: {e}")
        raise
