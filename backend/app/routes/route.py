from fastapi import APIRouter
from app.routes.expense import router

routes = APIRouter()
routes.include_router(router)