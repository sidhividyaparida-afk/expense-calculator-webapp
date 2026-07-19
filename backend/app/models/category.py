from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from app.database import base

class Category(base):

    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(10), unique=True, nullable=False)
    expenses = relationship("Expense", back_populates="category")