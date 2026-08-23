from fastapi import APIRouter, Depends, HTTPException, status
from app.models.model import db_dependency
from app.models import auth
from app import authentication, schemas

auth_router = APIRouter(tags=["Authentication"])

@auth_router.post("/register", status_code=status.HTTP_201_CREATED)
def register(user: schemas.User, db: db_dependency):

    existing_user = db.query(auth.User).filter(auth.User.username == user.username).first()
    if existing_user:
        raise HTTPException(status_code=409, detail="Username already exists")

    hashed_password = authentication.hash_password(user.password)

    new_user = auth.User(username=user.username, password_hash=hashed_password)

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {"message": "User registered successfully", "user": {"username": new_user.username}}

@auth_router.post("/login", response_model=schemas.Token)
def login(db: db_dependency, user: schemas.User):
    db_user = db.query(auth.User).filter(auth.User.username == user.username).first()
    if not db_user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect user id")

    else:
        correct_password = authentication.verify_password(user.password, db_user.password_hash)
        if not correct_password:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect password")

    access_token = authentication.create_token(data={"user_id": db_user.id})

    return {"access_token": access_token, "token_type": "bearer", "username": db_user.username}