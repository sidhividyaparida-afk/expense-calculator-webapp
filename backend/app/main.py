from fastapi import FastAPI,HTTPException,Depends
from app.routes.expense import router

app = FastAPI(
    title="Expense Calculator API",
    version="1.0.0"
)

app.include_router(router)