# HostelChef 🍳

> Turn whatever's in your room into something you can eat.

HostelChef is a focused, practical AI meal assistant designed specifically for hostel and college students. Tell it what random ingredients you have, your maximum cooking time, and available equipment (electric kettle, induction cooktop, microwave, etc.), and it leverages a local Gemma 4 model via Ollama to generate a realistic, minimal-cleanup hostel recipe.

---

## Why It Was Built

Hostel cooking is defined by strict constraints:
- Minimal utensils (often just a kettle, sandwich toaster, or single induction plate).
- Random leftover or pantry ingredients.
- Strict hostel rules and tight time limits.

Generic recipe apps suggest 20 ingredients, ovens, or blenders that students simply don't have. HostelChef focuses entirely on student reality: fast, realistic, and low-hassle meals using what's already on hand.

---

## Architecture

```text
React / Vite (Tailwind CSS)
        ↓  HTTP / REST
FastAPI Backend (Python)
        ↓  HTTP / JSON format
Ollama API (http://localhost:11434)
        ↓
Gemma 4 12B (gemma4:12b)
```

---

## Tech Stack

- **Frontend**: React, Vite, Tailwind CSS
- **Backend**: Python 3.9+, FastAPI, Uvicorn, HTTPX, Pydantic
- **AI / LLM**: Ollama, Google Gemma 4 12B (`gemma4:12b`)

---

## Quickstart Guide

### 1. Start Ollama and Pull Gemma 4 12B

Make sure [Ollama](https://ollama.com/) is installed and running on your machine:

```bash
# Verify Ollama is running
ollama --version

# Pull the Gemma 4 12B model
ollama pull gemma4:12b

# Run the model
ollama run gemma4:12b
```

> **Note**: If you want to test with another installed model (e.g. `gemma2:9b` or `mistral`), you can set `OLLAMA_MODEL=<model_name>` in `backend/.env`.

---

### 2. Start the FastAPI Backend

```bash
# Navigate to the project root
cd /path/to/hostelchef

# Create and activate virtual environment (if not already done)
python3 -m venv backend/.venv
source backend/.venv/bin/activate

# Install requirements
pip install -r backend/requirements.txt

# Start backend server
uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload
```

The backend will be live at `http://localhost:8000`. You can check the health status at:
`http://localhost:8000/health`

---

### 3. Start the React Frontend

Open a new terminal window:

```bash
# Navigate to frontend
cd /path/to/hostelchef/frontend

# Install dependencies (if not already done)
npm install

# Start Vite dev server
npm run dev
```

The frontend will be running at `http://localhost:5173`. Open it in your browser!

---

## Example Usage

### Example Input
- **Ingredients**: `1 packet Maggi, 1 slice cheese, 1 egg, butter`
- **Time Available**: `15 minutes`
- **Equipment**: `Electric Kettle`, `Pan / Kadai`
- **Dietary Preference**: `Eggitarian`

### Example Generated Output (JSON schema)
```json
{
  "name": "Hostel Cheesy Egg Maggi",
  "description": "Rich, comforting noodles enriched with a soft poached egg and melted cheese.",
  "time": "12 minutes",
  "difficulty": "Easy",
  "ingredients": [
    "1 packet Maggi noodles & tastemaker",
    "1 egg",
    "1 cheese slice",
    "1/2 tbsp butter",
    "1.5 cups water"
  ],
  "steps": [
    "Boil water in your pan or kettle with a dab of butter.",
    "Add the Maggi tastemaker spice blend and noodles.",
    "When noodles are halfway cooked (about 2 minutes), crack the egg directly on top.",
    "Cover with a plate for 2 minutes on low heat so the egg gently poaches.",
    "Top with the cheese slice, let it melt into the sauce, and serve immediately in the pan."
  ],
  "hostel_tip": "Eat directly from the pan to avoid washing an extra bowl or plate!"
}
```

---

## License

MIT
