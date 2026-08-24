import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/api";

const CategoryContext = createContext(null);

export function CategoryProvider({ children }) {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchCategories = async () => {
        try {
            const response = await api.get("/categories");
            setCategories(response.data);
        } catch (error) {
            console.error("Unable to fetch categories", error);
        } finally {
            setLoading(false);
        }
    };

    const addCategory = async (categoryData) => {
        const response = await api.post(
            "/categories",
            categoryData
        );

        const newCategory = response.data.category;

        setCategories((current) => [
            ...current,
            newCategory
        ]);

        return newCategory;
    };

    const updateCategory = async (categoryId, categoryData) => {
        const response = await api.put(
            `/categories/${categoryId}`,
            categoryData
        );

        const updatedCategory = response.data.category;

        setCategories((current) =>
            current.map((category) =>
                category.id === categoryId
                    ? updatedCategory
                    : category
            )
        );

        return updatedCategory;
    };

    const deleteCategory = async (categoryId) => {
        await api.delete(
            `/categories/${categoryId}`
        );

        setCategories((current) =>
            current.filter(
                (category) => category.id !== categoryId
            )
        );
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    return (
        <CategoryContext.Provider
            value={{
                categories,
                loading,
                fetchCategories,
                addCategory,
                updateCategory,
                deleteCategory
            }}
        >
            {children}
        </CategoryContext.Provider>
    );
}

export function useCategories() {
    return useContext(CategoryContext);
}