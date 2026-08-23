import { useEffect, useState } from "react";
import api from "../api/api";
import toast from "react-hot-toast";
import { CATEGORY_COLORS } from "../constants/categoryColors";
import { FaEdit, FaTrash, FaPlus, FaChevronDown, FaWallet } from "react-icons/fa";

export default function Expense() {
    const [expenses, setExpenses] = useState([]);
    const [editExpense, setEditExpense] = useState([]);
    const [editingCategory, setEditingCategory] = useState([]);
    const [categories, setCategories] = useState([]);
    const [colorCode, setColorCode] = useState("#E5F1ED");

    const [showExpenseModal, setShowExpenseModal] = useState(false);
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

    const [title, setTitle] = useState("");
    const [amount, setAmount] = useState("");
    const [categoryId, setCategoryId] = useState("");

    const [categoryName, setCategoryName] = useState("");

    useEffect(() => {
        fetchExpenses();
        fetchCategories();
    }, []);

    const fetchExpenses = async () => {
        try {
            const res = await api.get("/expenses");
            setExpenses(res.data);
        } catch {
            toast.error("Unable to load expenses");
        }
    };

    const fetchCategories = async () => {
        try {
            const res = await api.get("/categories");
            setCategories(res.data);
        } catch {
            toast.error("Unable to load categories");
        }
    };

    const totalExpense = expenses.reduce(
        (sum, item) => sum + Number(item.amount),
        0
    );

    const categoryMap = Object.fromEntries(
      categories.map(category => [category.id, category])
    );

    const openEditExpense = (expense) => {
        setEditExpense(expense);
    
        setTitle(expense.title);
        setAmount(expense.amount);
        setCategoryId(String(expense.category_id));
    
        setShowExpenseModal(true);
    };

    const updateExpense = async () => {
        if (!title || !amount || !categoryId) {
            toast.error("Please fill all fields");
            return;
        }
    
        try {
            await api.put(`/expenses/${editExpense.id}`, {
                title: title,
                amount: Number(amount),
                category_id: Number(categoryId)
            });
    
            toast.success("Expense updated successfully");
    
            setTitle("");
            setAmount("");
            setCategoryId("");
    
            setEditExpense(null);
            setShowExpenseModal(false);
    
            fetchExpenses();
    
        } catch (err) {
            toast.error(
                err.response?.data?.detail ||
                "Unable to update expense"
            );
        }
    };

    const deleteExpense = async (expenseId) => {
        try {
            await api.delete(`/expenses/${expenseId}`);
    
            toast.success("Expense deleted successfully");
    
            fetchExpenses();
    
        } catch (err) {
            toast.error(
                err.response?.data?.detail ||
                "Unable to delete expense"
            );
        }
    };

    const openEditCategory = (category) => {
        setEditingCategory(category);
    
        setCategoryName(category.name);
        setColorCode(category.color_code);
    
        setShowCategoryModal(true);
    };

    const updateCategory = async () => {

        if (!categoryName.trim()) {
            toast.error("Please enter category name");
            return;
        }
    
        try {
    
            await api.put(
                `/categories/${editingCategory.id}`,
                {
                    name: categoryName,
                    color_code: colorCode
                }
            );
    
            toast.success("Category updated successfully");
    
            setEditingCategory(null);
            setCategoryName("");
            setColorCode("#FFFFFF");
            setShowCategoryModal(false);
    
            fetchCategories();
    
        } catch (error) {
    
            toast.error(
                error.response?.data?.detail ||
                "Unable to update category"
            );
        }
    };

    const deleteCategory = async (categoryId) => {

        try {
    
            await api.delete(
                `/categories/${categoryId}`
            );
    
            toast.success("Category deleted successfully");
    
            fetchCategories();
    
        } catch (error) {
    
            toast.error(
                error.response?.data?.detail ||
                "Unable to delete category"
            );
        }
    };

    const addExpense = async () => {
        if (!title || !amount || !categoryId) {
            toast.error("Please fill all fields");
            return;
        }

        try {
            await api.post("/expenses", {
                    title,
                    amount,
                    category_id: categoryId,
                },
            );

            toast.success("Expense Added Successfully");

            setTitle("");
            setAmount("");
            setCategoryId("");

            setShowExpenseModal(false);

            fetchExpenses();
        } catch {
            toast.error("Unable to add expense");
        }
    };

    const addCategory = async () => {
      if (!categoryName.trim()) {
          toast.error("Please enter category name");
          return;
      }
  
      try {
  
          await api.post("/categories", {
                  name: categoryName,
                  color_code: colorCode
              });
  
          toast.success("Category Added Successfully");
  
          fetchCategories();
  
          setCategoryName("");
          setColorCode("#E5F1ED");
  
          setShowCategoryModal(false);
  
      } catch (err) {
  
          toast.error(
              err.response?.data?.message || "Unable to add category"
          );
  
      }
    };

    return (
        <div className="min-h-screen bg-slate-100 p-8">

            <div className="max-w-5xl mx-auto">

                <div className="bg-gradient-to-r from-indigo-600 to-blue-600 rounded-2xl p-8 text-white shadow-lg">

                    <div className="flex items-center gap-3">

                        <FaWallet size={32} />

                        <div>

                            <p>Total Expense</p>

                            <h1 className="text-4xl pl-3 font-bold mt-2">
                                ₹{totalExpense}
                            </h1>

                        </div>

                    </div>

                </div>

                <div className="mt-8 flex justify-end">

                    <button
                        onClick={() => setShowExpenseModal(true)}
                        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl"
                    >
                        <FaPlus size={18} />
                        Add Expense
                    </button>

                </div>

                <div className="grid md:grid-cols-1 gap-5 mt-8">

                    {expenses.map((expense) => {

                        const category = categoryMap[expense.category_id];

                        return (
                            <div
                                key={expense.id}
                                className="
                                    group
                                    relative
                                    rounded-xl
                                    shadow-md
                                    p-5
                                    transition-all
                                    duration-300
                                    ease-in-out
                                    hover:scale-[1.02]
                                    hover:shadow-xl
                                    cursor-pointer
                                "
                                style={{
                                    backgroundColor:
                                        category?.color_code || "#fff"
                                }}
                            >

                                {/* Expense Content */}

                                <div className="
                                    flex
                                    justify-between
                                    items-center
                                    transition-all
                                    duration-300
                                    group-hover:opacity-40
                                ">

                                    <div>

                                        <h2 className="font-semibold text-lg">
                                            {expense.title}
                                        </h2>

                                        <p className="text-gray-600">
                                            Category: {category?.name || "Unknown"}
                                        </p>

                                    </div>

                                    <h2 className="text-2xl font-bold text-white">
                                        ₹{expense.amount}
                                    </h2>

                                </div>


                                {/* Hover Overlay */}

                                <div className="
                                    absolute
                                    inset-0
                                    flex
                                    items-center
                                    justify-center
                                    gap-4

                                    opacity-0
                                    group-hover:opacity-100

                                    transition-opacity
                                    duration-300
                                ">

                                    {/* Edit */}

                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            openEditExpense(expense);
                                        }}
                                        className="
                                            w-12
                                            h-12
                                            rounded-full
                                            bg-white
                                            text-indigo-600
                                            shadow-lg

                                            flex
                                            items-center
                                            justify-center

                                            hover:bg-indigo-600
                                            hover:text-white
                                            hover:scale-110

                                            transition-all
                                            duration-200
                                        "
                                        title="Edit Expense"
                                    >
                                        <FaEdit size={18} />
                                    </button>


                                    {/* Delete */}

                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            deleteExpense(expense.id);
                                        }}
                                        className="
                                            w-12
                                            h-12
                                            rounded-full
                                            bg-white
                                            text-red-600
                                            shadow-lg

                                            flex
                                            items-center
                                            justify-center

                                            hover:bg-red-600
                                            hover:text-white
                                            hover:scale-110

                                            transition-all
                                            duration-200
                                        "
                                        title="Delete Expense"
                                    >
                                        <FaTrash size={18} />
                                    </button>

                                </div>

                            </div>
                        );
                    })}

                </div>

            </div>

            {/* Expense Modal */}

            {showExpenseModal && (

                <div className="fixed inset-0 bg-black/50 flex items-center justify-center">

                    <div className="bg-white rounded-xl w-[420px] p-6">

                        <h2 className="text-2xl font-bold mb-5">
                            Add Expense
                        </h2>

                        <input
                            placeholder="Title"
                            value={title}
                            onChange={(e) =>
                                setTitle(e.target.value)
                            }
                            className="w-full border rounded-lg p-3 mb-4"
                        />

                        <input
                            type="number"
                            placeholder="Amount"
                            value={amount}
                            onChange={(e) =>
                                setAmount(e.target.value)
                            }
                            className="w-full border rounded-lg p-3 mb-4"
                        />

                        <div className="relative">

                        <label className="block font-medium mb-2">
                            Category
                        </label>

                        <button
                            type="button"
                            onClick={() =>
                                setShowCategoryDropdown(
                                    !showCategoryDropdown
                                )
                            }
                            className="
                                w-full
                                border
                                rounded-lg
                                px-4
                                py-3
                                bg-white
                                flex
                                items-center
                                justify-between
                            "
                        >

                            <div className="flex items-center gap-2">

                                {categoryId ? (
                                    <>
                                        <span
                                            className="w-3 h-3 rounded-full"
                                            style={{
                                                backgroundColor:
                                                    categoryMap[categoryId]?.color_code
                                            }}
                                        />

                                        <span>
                                            {categoryMap[categoryId]?.name}
                                        </span>
                                    </>
                                ) : (
                                    <span className="text-gray-400">
                                        Select category
                                    </span>
                                )}

                            </div>

                            <FaChevronDown
                                size={16}
                                className={`transition-transform ${
                                    showCategoryDropdown ? "rotate-180" : ""
                                }`}
                            />

                        </button>


                        {showCategoryDropdown && (

                            <div
                                className="
                                    absolute
                                    z-50
                                    mt-2
                                    w-full
                                    bg-white
                                    border
                                    rounded-xl
                                    shadow-xl
                                    overflow-hidden
                                "
                            >

                                {categories.map((category) => (

                                    <div
                                        key={category.id}
                                        className="
                                            flex
                                            items-center
                                            justify-between
                                            px-4
                                            py-3
                                            hover:bg-gray-50
                                            transition
                                        "
                                    >

                                        {/* Category */}

                                        <button
                                            type="button"
                                            onClick={() => {
                                                setCategoryId(
                                                    String(category.id)
                                                );

                                                setShowCategoryDropdown(false);
                                            }}
                                            className="
                                                flex
                                                items-center
                                                gap-3
                                                flex-1
                                                text-left
                                            "
                                        >

                                            <span
                                                className="w-4 h-4 rounded-full"
                                                style={{
                                                    backgroundColor:
                                                        category.color_code
                                                }}
                                            />

                                            <span>
                                                {category.name}
                                            </span>

                                        </button>


                                        {/* Actions */}

                                        <div className="flex items-center gap-1">

                                            {/* Edit */}

                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();

                                                    setShowCategoryDropdown(false);

                                                    openEditCategory(category);
                                                }}
                                                className="
                                                    p-2
                                                    rounded-lg
                                                    text-indigo-600
                                                    hover:bg-indigo-100
                                                    transition
                                                "
                                                title="Edit category"
                                            >
                                                <FaEdit size={14} />
                                            </button>


                                            {/* Delete */}

                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();

                                                    setShowCategoryDropdown(false);

                                                    deleteCategory(category.id);
                                                }}
                                                className="
                                                    p-2
                                                    rounded-lg
                                                    text-red-600
                                                    hover:bg-red-100
                                                    transition
                                                "
                                                title="Delete category"
                                            >
                                                <FaTrash size={14} />
                                            </button>

                                        </div>

                                    </div>

                                ))}


                                {/* Add Category */}

                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowCategoryDropdown(false);

                                        setEditingCategory(null);
                                        setCategoryName("");
                                        setColorCode("#FFFFFF");

                                        setShowCategoryModal(true);
                                    }}
                                    className="
                                        w-full
                                        flex
                                        items-center
                                        gap-2
                                        px-4
                                        py-3
                                        border-t
                                        text-indigo-600
                                        font-medium
                                        hover:bg-indigo-50
                                    "
                                >

                                    <FaPlus size={13} />

                                    Add Category

                                </button>

                            </div>

                        )}

                        </div>

                        
                        <div className="flex justify-end gap-3 mt-6">

                            <button
                                onClick={() =>
                                    setShowExpenseModal(false)
                                }
                                className="px-5 py-2 border rounded-lg"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={!editExpense ? addExpense : updateExpense}
                                className="bg-indigo-600 text-white px-5 py-2 rounded-lg"
                            >
                                Save
                            </button>

                        </div>

                    </div>

                </div>

            )}

            {/* Category Modal */}

            {showCategoryModal && (

            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">

                <div className="w-[500px] rounded-3xl bg-white shadow-2xl p-7">

                    <h2 className="text-3xl font-bold mb-1">
                        {!editingCategory ? 'Add Category' : 'Update Category'}
                    </h2>

                    <p className="text-gray-500 mb-6">
                        Create a category and choose its color.
                    </p>

                    {/* Category Name */}

                    <div>

                        <label className="font-medium text-gray-700">
                            Category Name
                        </label>

                        <input
                            type="text"
                            placeholder="Ex : Food"
                            value={categoryName}
                            onChange={(e)=>setCategoryName(e.target.value)}
                            className="mt-2 w-full rounded-xl border border-gray-300 p-3
                            focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                        />

                    </div>

                    {/* Selected Color */}

                    <div className="mt-6">

                        <label className="font-medium text-gray-700">
                            Selected Color
                        </label>

                        <div className="mt-3 flex items-center gap-4">

                            <div
                                className="w-12 h-12 rounded-full border shadow"
                                style={{
                                    backgroundColor: colorCode
                                }}
                            />

                            <div>

                                <p className="font-semibold">
                                    {colorCode}
                                </p>

                                <p className="text-sm text-gray-500">
                                    This color will represent this category.
                                </p>

                            </div>

                        </div>

                    </div>

                    {/* Color Picker */}

                    <div className="mt-7">

                        <label className="font-medium text-gray-700">
                            Choose Color
                        </label>

                        <div className="grid grid-cols-5 gap-5 mt-4">

                            {CATEGORY_COLORS.map((color) => (

                                <button
                                    key={color.code}
                                    type="button"
                                    title={color.name}
                                    onClick={() => setColorCode(color.code)}
                                    className={`
                                        relative
                                        w-14
                                        h-14
                                        rounded-full
                                        border-4
                                        transition-all
                                        duration-200
                                        hover:scale-110
                                        focus:outline-none
                                        focus:ring-2
                                        focus:ring-indigo-400
                                        focus:ring-offset-2

                                        ${
                                            colorCode === color.code
                                                ? "border-indigo-600 shadow-xl scale-110"
                                                : "border-white shadow-md"
                                        }
                                    `}
                                    style={{
                                        backgroundColor: color.code
                                    }}
                                >

                                    {colorCode === color.code && (

                                        <span
                                            className="
                                                absolute
                                                inset-0
                                                flex
                                                items-center
                                                justify-center
                                                text-white
                                                text-xl
                                                font-bold
                                                drop-shadow-md
                                            "
                                        >
                                            ✓
                                        </span>

                                    )}

                                </button>

                            ))}

                        </div>

                    </div>

                    {/* Buttons */}

                    <div className="mt-8 flex justify-end gap-3">

                        <button
                            onClick={()=>{

                                setCategoryName("");
                                setColorCode("#E5F1ED");
                                setShowCategoryModal(false);

                            }}
                            className="px-6 py-3 rounded-xl border border-gray-300
                            hover:bg-gray-100"
                        >
                            Cancel
                        </button>

                        <button
                            onClick={!editingCategory ? addCategory : updateCategory}
                            className="px-6 py-3 rounded-xl bg-indigo-600
                            text-white hover:bg-indigo-700"
                        >
                            {!editingCategory ? 'Add Category' : 'Update Category'}
                        </button>

                    </div>

                </div>

            </div>

            )}

        </div>
    );
}