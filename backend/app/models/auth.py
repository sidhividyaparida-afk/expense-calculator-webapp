from sqlalchemy import Column, Integer, String
from app.database import base
from sqlalchemy.orm import relationship

class User(base):

    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(15), unique=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    expenses = relationship("Expense", back_populates="user")