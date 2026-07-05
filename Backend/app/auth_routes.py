"""
Authentication routes: signup, login, and current-user endpoint.
"""
from datetime import datetime, timezone

from fastapi import APIRouter, HTTPException, status, Depends

from app.database import db
from app.models import UserSignup, UserLogin, TokenResponse, UserResponse
from app.auth import hash_password, verify_password, create_access_token, get_current_user

auth_router = APIRouter(prefix="/api/auth", tags=["Authentication"])


@auth_router.post("/signup", response_model=TokenResponse, status_code=201)
async def signup(user: UserSignup):
    """
    Register a new user.
    - Validates that the email is not already taken
    - Hashes the password with bcrypt
    - Stores the user in the USERS collection
    - Returns a JWT access token
    """
    # Validate password length
    if len(user.password) < 6:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password must be at least 6 characters",
        )

    # Check if email already exists
    existing = await db.db["USERS"].find_one({"email": user.email})
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account with this email already exists",
        )

    # Create user document
    user_doc = {
        "username": user.username.strip(),
        "email": user.email.lower().strip(),
        "password": hash_password(user.password),
        "created_at": datetime.now(timezone.utc).isoformat(),
    }

    await db.db["USERS"].insert_one(user_doc)

    # Generate JWT
    token = create_access_token({"sub": user_doc["email"], "username": user_doc["username"]})

    return TokenResponse(
        access_token=token,
        user=UserResponse(username=user_doc["username"], email=user_doc["email"]),
    )


@auth_router.post("/login", response_model=TokenResponse)
async def login(user: UserLogin):
    """
    Authenticate an existing user.
    - Looks up user by email
    - Verifies password against stored bcrypt hash
    - Returns a JWT access token
    """
    # Find user by email
    db_user = await db.db["USERS"].find_one({"email": user.email.lower().strip()})
    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    # Verify password
    if not verify_password(user.password, db_user["password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    # Generate JWT
    token = create_access_token({"sub": db_user["email"], "username": db_user["username"]})

    return TokenResponse(
        access_token=token,
        user=UserResponse(username=db_user["username"], email=db_user["email"]),
    )


@auth_router.get("/me", response_model=UserResponse)
async def get_me(current_user: dict = Depends(get_current_user)):
    """
    Return the currently authenticated user's info.
    Protected endpoint — requires a valid JWT in the Authorization header.
    """
    db_user = await db.db["USERS"].find_one({"email": current_user["sub"]})
    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )
    return UserResponse(username=db_user["username"], email=db_user["email"])
