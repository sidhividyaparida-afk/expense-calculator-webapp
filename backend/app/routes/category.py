from fastapi import APIRouter, Depends, HTTPException
from app.models import category
from app.models.model import db_dependency
from app.authentication import verify_token
from app.schemas import Category

category_router = APIRouter(
    prefix="/categories",
    tags=["Categories"]
)

@category_router.get("")
def get_categories(db: db_dependency, user_id: str = Depends(verify_token)):
    categories = db.query(category.Category).filter(category.Category.user_id==user_id).all()
    return categories

@category_router.post("")
def create_category(category_data: Category, db: db_dependency, user_id: str = Depends(verify_token)):
    existing_category = db.query(category.Category).filter(category.Category.user_id == user_id, category.Category.name == category_data.name).first()
    if existing_category:
        raise HTTPException(status_code=409, detail= f"Category with name '{category_data.name}' already exists")
    
    new_category = category.Category(
        name=category_data.name,
        color_code=category_data.color_code,
        user_id=user_id
    )
    db.add(new_category)
    db.commit()
    db.refresh(new_category)
    return {"message": "Category created successfully", "category": new_category}

@category_router.put("/{category_id}")
def update_category(category_id: int, category_data: Category, db: db_dependency, user_id: int = Depends(verify_token)):
    to_update = db.query(category.Category).filter(category.Category.id==category_id, category.Category.user_id == user_id).first()
    if not to_update:
        raise HTTPException(status_code=404, detail=f"Category with id {category_id} not found")

    to_update.name = category_data.name
    to_update.color_code = category_data.color_code
    db.commit()
    db.refresh(to_update)
    return {"message": "Category updated successfully", "category": to_update}

@category_router.delete("/{category_id}")
def delete_category(category_id: int, db: db_dependency, user_id: int = Depends(verify_token)):
    to_delete = db.query(category.Category).filter(category.Category.id==category_id, category.Category.user_id == user_id).first()
    if not to_delete:
        raise HTTPException(status_code=404, detail=f"Category with id {category_id} not found")
    db.delete(to_delete)
    db.commit()
    return{"message":"Category deleted successfully!"}