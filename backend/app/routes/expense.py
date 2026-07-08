from fastapi import APIRouter, Depends
from typing import Annotated
from app.models import expense
from app.database import engine, sessionlocal
from sqlalchemy.orm import Session
# from app.data.expenses import expenses

router = APIRouter(
    prefix="/expenses",
    tags=["Expenses"]
)

expense.base.metadata.create_all(bind=engine)

def get_db():
    db = sessionlocal()
    try:
        yield db
    finally:
        db.close()

db_dependency = Annotated[Session, Depends(get_db)]

@router.get("/")
def home(db: db_dependency):
    return {
        "message": "Expense Calculator API Running"
    }

# @router.post("/")
# def add_expense(expense: Expense):
#     expenses.append(expense)
#     return {
#         "message": "Expense added successfully",
#         "expense": expense
#     }

# @router.get("/")
# def get_expenses():
#     return expenses

# @router.get("/total")
# def calculate_total():
#     total = sum(expense.amount for expense in expenses)
#     return {
#         "total_expense": total
#     }

@router.get("/expenses")
def get_expenses(db: db_dependency):
    expenses = db.query(expense.Expense).all()
    return expenses

@router.post("/expenses")
def create_expense(title: str, amount: int, category: str, db: db_dependency):
    new_expense = expense.Expense(
        title=title,
        amount=amount,
        category=category
    )
    db.add(new_expense)
    db.commit()
    db.refresh(new_expense)
    return {"message": "Expense created successfully", "expense": new_expense}