from fastapi import FastAPI,HTTPException,Depends
# from app.routes.expense import router
from app.routes.route import routes
from app.models import model

app = FastAPI(
    title="Expense Calculator API",
    version="1.0.0"
)

app.include_router(routes)