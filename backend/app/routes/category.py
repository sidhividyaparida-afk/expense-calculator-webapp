from fastapi import APIRouter, Depends, HTTPException
from app.models import category
from app.models.model import db_dependency
from app.authentication import verify_token

category_router = APIRouter(
    prefix="/categories",
    tags=["Categories"]
)

@category_router.get("")
def get_categories(db: db_dependency, username: str = Depends(verify_token)):
    categories = db.query(category.Category).all()
    return categories

@category_router.post("")
def create_category(name: str, color_code: str, db: db_dependency, username: str = Depends(verify_token)):
    new_category = category.Category(
        name=name,
        color_code=color_code
    )
    existing_category = db.query(category.Category).filter_by(name=name).first()
    if existing_category:
        return {"message": f"Category with name '{name}' already exists", "category": new_category}
    # category = db.query(category.Category).get(name=name)
    # if category:
    #     return {"message": f"Category with name '{name}' already exists", "category": new_category}

    db.add(new_category)
    db.commit()
    db.refresh(new_category)
    return {"message": "Category created successfully", "category": new_category}