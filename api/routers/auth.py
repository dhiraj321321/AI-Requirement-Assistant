from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from utils.auth import authenticate_user, register_user
from datetime import datetime, timedelta
from jose import jwt
import os

router = APIRouter()

SECRET_KEY = os.environ.get("API_SECRET_KEY", "dev-secret-key")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24

class LoginRequest(BaseModel):
    username: str
    password: str

class RegisterRequest(BaseModel):
    username: str
    password: str
    email: str | None = None

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


def _create_token(username: str):
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode = {"sub": username, "exp": expire.isoformat()}
    token = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return token


@router.post("/api/auth/login", response_model=TokenResponse)
async def login(payload: LoginRequest):
    if authenticate_user(payload.username, payload.password):
        token = _create_token(payload.username)
        return {"access_token": token}
    raise HTTPException(status_code=401, detail="Invalid credentials")


@router.post("/api/auth/register")
async def register(payload: RegisterRequest):
    success = register_user(payload.username, payload.password)
    if success:
        return {"status": "ok", "message": "Registration complete"}
    raise HTTPException(status_code=400, detail="Username already exists")
