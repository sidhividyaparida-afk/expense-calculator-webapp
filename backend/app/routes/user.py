from fastapi import APIRouter,Depends,HTTPException
from app.models.auth import User
from app.models.model import db_dependency
from app.authentication import verify_token

user_router = APIRouter(tags=["User"])

@user_router.get("/profile")
def profile(db:db_dependency, user_id: int = Depends(verify_token)):
    user=db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    username= user.username
    return {
        "message": "You are authorized",
        "username": username
    }