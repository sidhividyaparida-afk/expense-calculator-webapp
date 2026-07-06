from fastapi import FastAPI,HTTPException,Depends
from app.routes.expense import router as expense_router
from pydantic import BaseModel
from typing import Annotated
import models
from database import engine, SessionLocal
from sqlalchemy.orm import Session

app = FastAPI(
    title="Expense Calculator API",
    version="1.0.0"
)
models.Base.metadata.create_all(bind=engine)

class PostBase(BaseModel):
    title: str
    amount: float
    category: str

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

db_dependency = Annotated[Session, Depends(get_db)]

@app.get("/")
def home(db: db_dependency):
    return {
        "message": "Expense Calculator API Running"
    }

app.include_router(expense_router)

@app.post("/expenses")
def create_expense(expense: PostBase, db: db_dependency):
    new_expense = models.Post(
        title=expense.title,
        amount=expense.amount,
        category=expense.category
    )
    db.add(new_expense)
    db.commit()
    db.refresh(new_expense)
    return new_expense
