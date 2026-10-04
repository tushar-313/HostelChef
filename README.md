# HostelChef 🍳

> "Turn whatever's in your room into something you can eat."

HostelChef is a focused, practical AI meal assistant designed specifically for hostel and college students. Tell it what random ingredients you have in your room, your available cooking time, and equipment (induction plate, electric kettle, pan, microwave, etc.), and it leverages **Google Gemma 4 (`gemma-4-26b-a4b-it`)** via the Google GenAI SDK to generate a realistic, minimal-cleanup hostel recipe in seconds.

---

## Architecture

```text
React + Vite (Tailwind CSS)
        ↓  (Static assets & API on same origin)
FastAPI Backend (Python)
        ↓  Google GenAI SDK
Google GenAI API
        ↓
Gemma 4 26B A4B (gemma-4-26b-a4b-it)
```

The Google API key remains strictly on the FastAPI backend and is **never** exposed to the client.

---

## Tech Stack

- **Frontend**: React, Vite, Tailwind CSS
- **Backend**: Python 3.9+, FastAPI, Uvicorn, Pydantic, python-dotenv
- **AI SDK**: Google GenAI Python SDK (`google-genai`)
- **AI Model**: Google Gemma 4 26B A4B (`gemma-4-26b-a4b-it`)

---

## Environment Variables

### Backend (`backend/.env`):
```env
GOOGLE_API_KEY=your_google_api_key_here
GEMMA_MODEL=gemma-4-26b-a4b-it
PORT=8000
HOST=0.0.0.0
```

---

## 🚀 Hosting the Entire App on Render (Frontend + Backend Unified)

You can host both the frontend and backend together on **one single free Render Web Service**. FastAPI serves the built React app and the API endpoints under one unified domain with **zero CORS configuration needed**.

### Step-by-Step Render Deployment:
1. Go to your [Render Dashboard](https://dashboard.render.com/).
2. Click **New +** → **Web Service**.
3. Connect your GitHub repository: `https://github.com/tushar-313/HostelChef.git`.
4. Fill in the service details:
   - **Name**: `hostelchef`
   - **Language / Environment**: `Python`
   - **Branch**: `main`
   - **Region**: Any (e.g. Oregon)
   - **Build Command**:
     ```bash
     npm --prefix frontend install && npm --prefix frontend run build && pip install -r backend/requirements.txt
     ```
   - **Start Command**:
     ```bash
     uvicorn backend.main:app --host 0.0.0.0 --port $PORT
     ```
5. Add **Environment Variables**:
   - `GOOGLE_API_KEY`: *(Paste your Google GenAI API key)*
   - `GEMMA_MODEL`: `gemma-4-26b-a4b-it`
6. Click **Deploy Web Service**!

Render will build the React frontend, install Python dependencies, and launch FastAPI serving the full app at `https://<your-app-name>.onrender.com`.

---

## Local Development

### 1. Backend:
```bash
python3 -m venv backend/.venv
source backend/.venv/bin/activate
pip install -r backend/requirements.txt
uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload
```

### 2. Frontend:
```bash
cd frontend
npm install
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Example Usage

### Input
- **Ingredients**: `eggs, bread, onion, tomato`
- **Time**: `15 minutes`
- **Equipment**: `Pan / Kadai`
- **Diet**: `Vegetarian / Eggitarian`

### Gemma 4 Output
```json
{
  "name": "Masala Egg Bhurji with Toast",
  "description": "A quick and savory scrambled egg dish with sautéed onions and tomatoes, served with toasted bread.",
  "time": "12 minutes",
  "difficulty": "Easy",
  "ingredients": [
    "2 eggs",
    "2 slices of bread",
    "1 small onion, finely chopped",
    "1 small tomato, finely chopped",
    "Salt to taste",
    "1 tsp cooking oil"
  ],
  "steps": [
    "Heat oil in your pan over medium heat.",
    "Add chopped onions and sauté until translucent.",
    "Add chopped tomatoes and cook until soft.",
    "Crack eggs directly into the pan, add salt, and stir continuously to scramble.",
    "Toast bread slices in the remaining pan space.",
    "Serve hot egg bhurji with toasted bread."
  ],
  "hostel_tip": "If you don't have a toaster, press the bread flat with a spatula in the pan for instant crunch."
}
```

---

## License

MIT
