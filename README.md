# HostelChef 🍳

> "Turn whatever's in your room into something you can eat."

HostelChef is a focused, practical AI meal assistant designed specifically for hostel and college students. Tell it what random ingredients you have in your room, your available cooking time, and equipment (induction plate, electric kettle, pan, microwave, etc.), and it leverages **Google Gemma 4 (`gemma-4-26b-a4b-it`)** via the Google GenAI SDK to generate a realistic, minimal-cleanup hostel recipe in seconds.

---

## Architecture

```text
React + Vite (Tailwind CSS)
        ↓  HTTP / REST
FastAPI Backend (Python)
        ↓  Google GenAI SDK
Google GenAI API
        ↓
Gemma 4 26B A4B (gemma-4-26b-a4b-it)
```

The Google API key remains strictly on the FastAPI backend and is **never** exposed to the React frontend.

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
FRONTEND_URL=http://localhost:5173
PORT=8000
HOST=0.0.0.0
```

### Frontend (`frontend/.env`):
```env
VITE_API_URL=http://localhost:8000
```

---

## Local Setup & Running

### 1. Backend Setup
```bash
# From repository root
python3 -m venv backend/.venv
source backend/.venv/bin/activate
pip install -r backend/requirements.txt

# Start FastAPI server
uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload
```
- Health Check: `http://localhost:8000/health`
- API Docs: `http://localhost:8000/docs`

### 2. Frontend Setup
In a new terminal window:
```bash
cd frontend
npm install
npm run dev
```
- Web App: `http://localhost:5173`

---

## Deployment Guide

### Backend Deployment (Render)
1. Push your repository to GitHub.
2. In [Render Dashboard](https://dashboard.render.com/), create a new **Web Service** and connect this repository.
3. Configure the service:
   - **Root Directory**: Leave blank (or `.`)
   - **Environment**: `Python`
   - **Build Command**: `pip install -r backend/requirements.txt`
   - **Start Command**: `uvicorn backend.main:app --host 0.0.0.0 --port $PORT`
4. Set Environment Variables in Render:
   - `GOOGLE_API_KEY`: Your Google GenAI API key
   - `GEMMA_MODEL`: `gemma-4-26b-a4b-it`
   - `FRONTEND_URL`: URL of your deployed Vercel frontend (e.g. `https://hostelchef.vercel.app`)

### Frontend Deployment (Vercel)
1. In [Vercel Dashboard](https://vercel.com/), create a new project and import this repository.
2. Set **Root Directory** to `frontend`.
3. Set Environment Variable:
   - `VITE_API_URL`: Your deployed Render backend URL (e.g. `https://hostelchef-backend.onrender.com`)
4. Deploy!

---

## Example Usage

### Input
- **Ingredients**: `eggs, bread, onion, tomato`
- **Time**: `15 minutes`
- **Equipment**: `Pan / Kadai`
- **Diet**: `Vegetarian / Eggitarian`

### Gemma 4 Generated Recipe Output (JSON)
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
