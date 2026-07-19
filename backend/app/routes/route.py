from fastapi import APIRouter
from app.routes.expense import expense_router
from app.routes.category import category_router

routes = APIRouter()
routes.include_router(expense_router)
routes.include_router(category_router)