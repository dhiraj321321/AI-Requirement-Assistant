from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api.routers import auth, assistant, features

app = FastAPI(title="AI Requirement Engineering Assistant API")

# Allow local frontend during development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(assistant.router)
app.include_router(features.router)


@app.get("/api/health")
async def health():
    return {"status": "ok"}
