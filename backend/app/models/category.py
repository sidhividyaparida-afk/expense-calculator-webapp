from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.database import base

class Category(base):

    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(10), nullable=False)
    color_code = Column(String(7), nullable=False, default="#FFFFFF")
    user_id = Column(Integer, ForeignKey("users.id"), nullable= False)
    user = relationship("User", back_populates="categories")
    expenses = relationship("Expense", back_populates="category")