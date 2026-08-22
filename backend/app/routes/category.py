from fastapi import APIRouter, Depends, HTTPException
from app.models import category
from app.models.model import db_dependency
from app.authentication import verify_token

category_router = APIRouter(
    prefix="/categories",
    tags=["Categories"]
)

@category_router.get("")
def get_categories(db: db_dependency, user_id: str = Depends(verify_token)):
    categories = db.query(category.Category).filter(category.Category.user_id==user_id).all()
    return categories

@category_router.post("")
def create_category(name: str, color_code: str, db: db_dependency, user_id: str = Depends(verify_token)):
    new_category = category.Category(
        name=name,
        color_code=color_code,
        user_id=user_id
    )
    existing_category = db.query(category.Category).filter(category.Category.user_id == user_id, category.Category.name == name).first()
    if existing_category:
        return {"message": f"Category with name '{name}' already exists", "category": new_category}
    
    db.add(new_category)
    db.commit()
    db.refresh(new_category)
    return {"message": "Category created successfully", "category": new_category}

@category_router.put("/{category_id}")
def update_category(category_id: int, name: str, color_code: str, db: db_dependency, user_id: int = Depends(verify_token)):
    to_update = db.query(category.Category).filter(category.Category.id==category_id, category.Category.user_id == user_id).first()
    if not to_update:
        raise HTTPException(status_code=404, detail=f"Category with id {category_id} not found")

    to_update.name = name
    to_update.color_code = color_code
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