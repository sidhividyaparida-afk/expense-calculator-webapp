# from pydantic import BaseModel
from sqlalchemy import Column, Integer, String
from app.database import base

class Expense(base):
#     id: int
#     title: str
#     amount: float
#     category: str
    __tablename__ = "expenses"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(100), index=True)
    amount = Column(Integer)
    category = Column(String(50))
