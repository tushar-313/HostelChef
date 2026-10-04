import os
import json
import re
from typing import Dict, Any, List
import httpx

OLLAMA_BASE_URL = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434").rstrip("/")
OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "gemma4:12b")

SYSTEM_PROMPT = """You are a practical, creative hostel cooking assistant for students.
Your mission is to generate a realistic, delicious recipe tailored specifically to a hostel student's constraints.

Strict Guidelines:
1. ONLY use ingredients provided by the user, unless suggesting standard essentials like water, salt, oil, or pepper.
2. Never claim that an ingredient exists if the user did not provide it.
3. If the provided ingredients are completely insufficient to cook anything meaningful (e.g. only "toothpaste" or just "water"), provide a helpful hostel tip on what basic item (e.g. bread, eggs, onion) is needed.
4. Strictly respect the available cooking equipment.
5. Strictly respect the maximum cooking time limit.
6. Prefer simple recipes requiring minimal utensils and hassle-free cleanup.
7. Give realistic quantities where possible (e.g. "1 cup", "1 pinch", "2 tbsp").
8. Keep instructions concise, numbered, and beginner-friendly.
9. Avoid dangerous cooking instructions.
10. Return ONLY valid JSON matching the exact schema below. Do not wrap in extra markdown or commentary outside the JSON.

Expected JSON Schema:
{
  "name": "Recipe name",
  "description": "Short appetizing description",
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
  "hostel_tip": "A clever hostel hack, shortcut, or substitute"
}"""

def build_user_prompt(
    ingredients: str,
    time_limit: str,
    equipment: List[str],
    dietary_preference: str = "Any / No restriction"
) -> str:
    equipment_str = ", ".join(equipment) if equipment else "No appliances / Cold prep only"
    return f"""Please create a hostel recipe based on these constraints:

- Ingredients available in room: {ingredients}
- Available cooking equipment: {equipment_str}
- Maximum cooking time limit: {time_limit}
- Dietary preference: {dietary_preference}

Return ONLY valid JSON matching the required schema."""

def parse_recipe_json(raw_text: str) -> Dict[str, Any]:
    """Extract and parse JSON from model output, handling potential markdown blocks."""
    cleaned = raw_text.strip()
    
    # Check for markdown code fences
    fence_match = re.search(r"```(?:json)?\s*([\s\S]*?)\s*```", cleaned, re.IGNORECASE)
    if fence_match:
        cleaned = fence_match.group(1).strip()
    else:
        # Look for the outer-most JSON object brackets
        bracket_match = re.search(r"\{[\s\S]*\}", cleaned)
        if bracket_match:
            cleaned = bracket_match.group(0)

    try:
        data = json.loads(cleaned)
    except json.JSONDecodeError as err:
        raise ValueError(f"Failed to parse AI response as JSON: {err}") from err

    # Ensure required keys exist
    required_keys = ["name", "description", "time", "difficulty", "ingredients", "steps", "hostel_tip"]
    for key in required_keys:
        if key not in data:
            if key in ["ingredients", "steps"]:
                data[key] = []
            else:
                data[key] = "N/A"

    # Normalize ingredients and steps to lists of strings
    if not isinstance(data["ingredients"], list):
        data["ingredients"] = [str(data["ingredients"])]
    else:
        data["ingredients"] = [str(i) for i in data["ingredients"]]

    if not isinstance(data["steps"], list):
        data["steps"] = [str(data["steps"])]
    else:
        data["steps"] = [str(s) for s in data["steps"]]

    return data

async def query_ollama(
    ingredients: str,
    time_limit: str,
    equipment: List[str],
    dietary_preference: str = "Any / No restriction",
    model: str = OLLAMA_MODEL,
    base_url: str = OLLAMA_BASE_URL,
    timeout_seconds: float = 120.0
) -> Dict[str, Any]:
    prompt = build_user_prompt(ingredients, time_limit, equipment, dietary_preference)
    payload = {
        "model": model,
        "system": SYSTEM_PROMPT,
        "prompt": prompt,
        "format": "json",
        "stream": False,
        "options": {
            "temperature": 0.4,
            "top_p": 0.9,
        }
    }

    url = f"{base_url}/api/generate"

    try:
        async with httpx.AsyncClient(timeout=timeout_seconds) as client:
            response = await client.post(url, json=payload)
    except (httpx.ConnectError, httpx.ConnectTimeout, httpx.NetworkError) as e:
        raise ConnectionError("Couldn't reach the local AI. Make sure Ollama and Gemma 4 are running.") from e
    except httpx.HTTPStatusError as e:
        if e.response.status_code == 404:
            raise RuntimeError(f"Ollama model '{model}' not found. Please run: ollama run {model}") from e
        raise RuntimeError(f"Ollama returned HTTP error {e.response.status_code}") from e
    except Exception as e:
        raise ConnectionError(f"Error communicating with Ollama: {str(e)}") from e

    if response.status_code != 200:
        raise RuntimeError(f"Ollama returned error status {response.status_code}: {response.text}")

    result = response.json()
    raw_response = result.get("response", "")
    if not raw_response:
        raise ValueError("Ollama returned an empty response.")

    return parse_recipe_json(raw_response)
