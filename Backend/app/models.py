"""
Pydantic models for request/response validation.
"""
from pydantic import BaseModel, EmailStr


# ── Auth Models ─────────────────────────────────────────────
class UserSignup(BaseModel):
    """Request body for user registration."""
    username: str
    email: EmailStr
    password: str


class UserLogin(BaseModel):
    """Request body for user login."""
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    """Public user data returned to the client (no password)."""
    username: str
    email: str


class TokenResponse(BaseModel):
    """JWT token returned after successful auth."""
    access_token: str
    token_type: str = "bearer"
    user: UserResponse
