from fastapi import FastAPI,HTTPException,Depends
# from app.routes.expense import router as expense_router
from pydantic import BaseModel
from typing import Annotated
from app.models import expense
from app.database import engine, SessionLocal
from sqlalchemy.orm import Session

app = FastAPI(
    title="Expense Calculator API",
    version="1.0.0"
)
expense.Base.metadata.create_all(bind=engine)

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

# app.include_router(expense_router)

# @app.post("/expenses")
# def create_expense(expense: expense.Expense, db: db_dependency):
#     new_expense = expense.Expense(
#         title=expense.title,
#         amount=expense.amount,
#         category=expense.category
#     )
#     db.add(new_expense)
#     db.commit()
#     db.refresh(new_expense)
#     return new_expense
