from fastapi import APIRouter, Depends, HTTPException
from app.models import expense, category
from app.models.model import db_dependency
# from app.data.expenses import expenses

expense_router = APIRouter(
    prefix="/expenses",
    tags=["Expenses"]
)

# @router.get("/")
# def home(db: db_dependency):
#     return {
#         "message": "Expense Calculator API Running"
#     }

@expense_router.get("")
def get_expenses(db: db_dependency):
    expenses = db.query(expense.Expense).all()
    return expenses

# @expense_router.post("")
# def create_expense(title: str, amount: int, category: str, db: db_dependency):
#     new_expense = expense.Expense(
#         title=title,
#         amount=amount,
#         category=category
#     )
#     db.add(new_expense)
#     db.commit()
#     db.refresh(new_expense)
#     return {"message": "Expense created successfully", "expense": new_expense}

@expense_router.post("")
def create_expense(title: str, amount: float, category_id: int, db: db_dependency):

    # Faster primary-key lookup

    c = db.get(category.Category, category_id)
    if not c:
        raise HTTPException(
            status_code=404,
            detail=f"Category with id {category_id} not found"
        )

    new_expense = expense.Expense(
        title=title,
        amount=amount,
        category_id=category_id
    )

    db.add(new_expense)
    db.commit()
    db.refresh(new_expense)
    return {"message": "Expense created successfully", "expense": new_expense}