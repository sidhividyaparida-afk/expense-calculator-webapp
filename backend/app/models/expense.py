# from pydantic import BaseModel
from sqlalchemy import Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import relationship
from app.database import base

class Expense(base):

    __tablename__ = "expenses"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(20), index=True, nullable=False)
    amount = Column(Float, nullable=False)
    # category = Column(String(10), nullable=False)
    category_id = Column(Integer, ForeignKey("categories.id"))
    category = relationship("Category", back_populates="expenses")