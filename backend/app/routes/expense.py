from fastapi import APIRouter, Depends, HTTPException
from app.models import expense, category
from app.models.model import db_dependency
from app.authentication import verify_token
from app.schemas import Expense

expense_router = APIRouter(
    prefix="/expenses",
    tags=["Expenses"]
)

@expense_router.get("")
def get_expenses(db: db_dependency, user_id: int = Depends(verify_token)):
    expenses = db.query(expense.Expense).filter(expense.Expense.user_id == user_id).all()
    return expenses

@expense_router.post("")
def create_expense(expense_data: Expense, db: db_dependency, user_id: int = Depends(verify_token)):

    c = db.query(category.Category).filter(category.Category.user_id==user_id, category.Category.id==expense_data.category_id)
    if not c:
        raise HTTPException(status_code=404, detail=f"Category with id {expense_data.category_id} not found")

    new_expense = expense.Expense(
        title=expense_data.title,
        amount=expense_data.amount,
        category_id=expense_data.category_id,
        user_id=user_id
    )

    db.add(new_expense)
    db.commit()
    db.refresh(new_expense)
    return {"message": "Expense created successfully", "expense": new_expense}

@expense_router.put("/{expense_id}")
def update_expense(expense_id: int, expense_data: Expense, db: db_dependency, user_id: int = Depends(verify_token)):
    expense_to_update = db.query(expense.Expense).filter(expense.Expense.id==expense_id, expense.Expense.user_id == user_id).first()
    if not expense_to_update:
        raise HTTPException(status_code=404, detail=f"Expense with id {expense_id} not found")

    c = db.query(category.Category).filter(category.Category.user_id==user_id, category.Category.id==expense_data.category_id)
    if not c:
        raise HTTPException(status_code=404, detail=f"Category with id {expense_data.category_id} not found")

    expense_to_update.title = expense_data.title
    expense_to_update.amount = expense_data.amount
    expense_to_update.category_id = expense_data.category_id

    db.commit()
    db.refresh(expense_to_update)
    return {"message": "Expense updated successfully", "expense": expense_to_update}

@expense_router.delete("/{expense_id}")
def delete_expense(expense_id: int, db: db_dependency, user_id: int = Depends(verify_token)):
    expense_to_delete = db.query(expense.Expense).filter(expense.Expense.id==expense_id, expense.Expense.user_id == user_id).first()
    if not expense_to_delete:
        raise HTTPException(status_code=404, detail=f"Expense with id {expense_id} not found")

    db.delete(expense_to_delete)
    db.commit()
    return {"message": "Expense deleted successfully"}