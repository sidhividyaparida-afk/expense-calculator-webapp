from pydantic import BaseModel

class User(BaseModel):
    username: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class Expense(BaseModel):
    title: str
    amount: float
    category_id: int