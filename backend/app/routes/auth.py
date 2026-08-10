from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from app.models.model import db_dependency
from app.models import auth
from app import authentication, schemas
# from app.database import engine

auth_router = APIRouter(tags=["Authentication"])

@auth_router.post("/register")
def register(user: schemas.UserCreate, db: db_dependency):
    # Check if the username already exists
    existing_user = db.query(auth.User).filter(auth.User.username == user.username).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Username already exists")

    # Hash the password
    hashed_password = authentication.hash_password(user.password)

    # Create a new user instance
    new_user = auth.User(username=user.username, password_hash=hashed_password)

    # Add the new user to the database
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {"message": "User registered successfully", "user": {"username": new_user.username}}

# Login endpoint
@auth_router.post("/login", response_model=schemas.Token)
def login(db: db_dependency, form_data: OAuth2PasswordRequestForm = Depends()):
    # Find user
    user = db.query(auth.User).filter(auth.User.username == form_data.username).first()
    if not user or not authentication.verify_password(form_data.password, user.password_hash):
        raise HTTPException(status_code=400, detail="Incorrect username or password")

    # Check Password
    correct_password = authentication.verify_password(form_data.password, user.password_hash)
    if not correct_password:
        raise HTTPException(status_code=400, detail="Incorrect username or password")

    # Create JWT token
    access_token = authentication.create_token(data={"sub": user.username})

    return {"access_token": access_token, "token_type": "bearer"}

# -------------------------
# PROTECTED API
# -------------------------

@auth_router.get("/profile")
def profile(
    username: str = Depends(authentication.verify_token)
):

    return {
        "message": "You are authorized",
        "username": username
    }