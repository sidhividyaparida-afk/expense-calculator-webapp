from app.models import category, expense
from app.database import engine, sessionlocal
from typing import Annotated
from sqlalchemy.orm import Session
from fastapi import Depends

category.base.metadata.create_all(bind=engine)
expense.base.metadata.create_all(bind=engine)

def get_db():
    db = sessionlocal()
    try:
        yield db
    finally:
        db.close()

db_dependency = Annotated[Session, Depends(get_db)]