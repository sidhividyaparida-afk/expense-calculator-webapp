from pydantic import BaseModel

class Expense(BaseModel):
    id: int
    title: str
    amount: float
    category: str