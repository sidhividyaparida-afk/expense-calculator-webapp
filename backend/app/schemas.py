from pydantic import BaseModel

class UserCreate(BaseModel):
    username: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class Login(BaseModel):
    user_id: int
    password: str

class Expense(BaseModel):
    title: str
    amount: float
    category_id: int

class ExpenseResponse(BaseModel):
    id: int
    title: str
    amount: float
    category_id: int
    user_id: int
    class Config:
        from_attributes = True