from fastapi import FastAPI
from app.routes.expense import router as expense_router

app = FastAPI(
    title="Expense Calculator API",
    version="1.0.0"
)

@app.get("/")
def home():
    return {
        "message": "Expense Calculator API Running"
    }

app.include_router(expense_router)