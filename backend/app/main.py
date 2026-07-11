from fastapi import FastAPI,HTTPException,Depends
# from app.routes.expense import router
from app.routes.route import routes
app = FastAPI(
    title="Expense Calculator API",
    version="1.0.0"
)

app.include_router(routes)