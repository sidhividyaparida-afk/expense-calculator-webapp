from fastapi import APIRouter
from app.routes.expense import expense_router
from app.routes.category import category_router
from app.routes.auth import auth_router
from app.routes.user import user_router

routes = APIRouter()
routes.include_router(expense_router)
routes.include_router(category_router)
routes.include_router(auth_router)
routes.include_router(user_router)