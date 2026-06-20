from fastapi import APIRouter
from app.models.expense import Expense
from app.data.expenses import expenses

router = APIRouter(
    prefix="/expenses",
    tags=["Expenses"]
)

@router.post("/")
def add_expense(expense: Expense):
    expenses.append(expense)
    return {
        "message": "Expense added successfully",
        "expense": expense
    }

@router.get("/")
def get_expenses():
    return expenses

@router.get("/total")
def calculate_total():
    total = sum(expense.amount for expense in expenses)
    return {
        "total_expense": total
    }