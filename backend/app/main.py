from fastapi import FastAPI,HTTPException,Depends
# from app.routes.expense import router
from app.routes.route import routes
from app.models import model
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="Expense Calculator API",
    version="1.0.0"
)

origins = ["http://localhost:5173"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

app.include_router(routes)