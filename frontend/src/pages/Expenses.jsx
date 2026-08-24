import { useState } from "react";
import toast from "react-hot-toast";
import {
    FaEdit,
    FaTrash,
    FaPlus,
    FaChevronDown,
    FaWallet,
    FaReceipt
} from "react-icons/fa";

import { CATEGORY_COLORS } from "../constants/categoryColors";
import { useExpenses } from "../context/ExpenseContext";
import { useCategories } from "../context/CategoryContext";

export default function Expense() {
    const {
        expenses,
        loading: expensesLoading,
        addExpense,
        updateExpense,
        deleteExpense
    } = useExpenses();

    const {
        categories,
        loading: categoriesLoading,
        addCategory,
        updateCategory,
        deleteCategory
    } = useCategories();

    const [editExpense, setEditExpense] = useState(null);
    const [editingCategory, setEditingCategory] = useState(null);

    const [showExpenseModal, setShowExpenseModal] = useState(false);
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

    const [title, setTitle] = useState("");
    const [amount, setAmount] = useState("");
    const [categoryId, setCategoryId] = useState("");

    const [categoryName, setCategoryName] = useState("");
    const [colorCode, setColorCode] = useState("#E5F1ED");

    const loading = expensesLoading || categoriesLoading;

    const totalExpense = expenses.reduce(
        (sum, expense) => sum + Number(expense.amount),
        0
    );

    const categoryMap = Object.fromEntries(
        categories.map((category) => [
            String(category.id),
            category
        ])
    );

    const resetExpenseForm = () => {
        setTitle("");
        setAmount("");
        setCategoryId("");
        setEditExpense(null);
        setShowCategoryDropdown(false);
    };

    const resetCategoryForm = () => {
        setCategoryName("");
        setColorCode("#E5F1ED");
        setEditingCategory(null);
    };

    const openAddExpense = () => {
        resetExpenseForm();
        setShowExpenseModal(true);
    };

    const openEditExpense = (expense) => {
        setEditExpense(expense);
        setTitle(expense.title);
        setAmount(String(expense.amount));
        setCategoryId(String(expense.category_id));
        setShowCategoryDropdown(false);
        setShowExpenseModal(true);
    };

    const handleAddExpense = async () => {
        if (!title.trim() || !amount || !categoryId) {
            toast.error("Please fill all fields");
            return;
        }

        try {
            await addExpense({
                title: title.trim(),
                amount: Number(amount),
                category_id: Number(categoryId)
            });

            toast.success("Expense added successfully");

            resetExpenseForm();
            setShowExpenseModal(false);
        } catch (error) {
            toast.error(
                error.response?.data?.detail ||
                "Unable to add expense"
            );
        }
    };

    const handleUpdateExpense = async () => {
        if (!editExpense) {
            return;
        }

        if (!title.trim() || !amount || !categoryId) {
            toast.error("Please fill all fields");
            return;
        }

        try {
            await updateExpense(
                editExpense.id,
                {
                    title: title.trim(),
                    amount: Number(amount),
                    category_id: Number(categoryId)
                }
            );

            toast.success("Expense updated successfully");

            resetExpenseForm();
            setShowExpenseModal(false);
        } catch (error) {
            toast.error(
                error.response?.data?.detail ||
                "Unable to update expense"
            );
        }
    };

    const handleDeleteExpense = async (expenseId) => {
        try {
            await deleteExpense(expenseId);

            toast.success("Expense deleted successfully");
        } catch (error) {
            toast.error(
                error.response?.data?.detail ||
                "Unable to delete expense"
            );
        }
    };

    const openAddCategory = () => {
        setShowCategoryDropdown(false);
        resetCategoryForm();
        setShowCategoryModal(true);
    };

    const openEditCategory = (category) => {
        setShowCategoryDropdown(false);

        setEditingCategory(category);
        setCategoryName(category.name);
        setColorCode(category.color_code);

        setShowCategoryModal(true);
    };

    const handleAddCategory = async () => {
        if (!categoryName.trim()) {
            toast.error("Please enter category name");
            return;
        }

        try {
            const newCategory = await addCategory({
                name: categoryName.trim(),
                color_code: colorCode
            });

            toast.success("Category added successfully");

            // Automatically select newly created category
            setCategoryId(String(newCategory.id));

            resetCategoryForm();
            setShowCategoryModal(false);
        } catch (error) {
            toast.error(
                error.response?.data?.detail ||
                error.response?.data?.message ||
                "Unable to add category"
            );
        }
    };

    const handleUpdateCategory = async () => {
        if (!editingCategory) {
            return;
        }

        if (!categoryName.trim()) {
            toast.error("Please enter category name");
            return;
        }

        try {
            const updatedCategory = await updateCategory(
                editingCategory.id,
                {
                    name: categoryName.trim(),
                    color_code: colorCode
                }
            );

            toast.success("Category updated successfully");

            // Automatically select edited category
            setCategoryId(String(updatedCategory.id));

            resetCategoryForm();
            setShowCategoryModal(false);
        } catch (error) {
            toast.error(
                error.response?.data?.detail ||
                error.response?.data?.message ||
                "Unable to update category"
            );
        }
    };

    const handleDeleteCategory = async (deletedCategoryId) => {
        try {
            await deleteCategory(deletedCategoryId);

            // Clear selection if currently selected category was deleted
            if (
                String(categoryId) ===
                String(deletedCategoryId)
            ) {
                setCategoryId("");
            }

            toast.success("Category deleted successfully");
        } catch (error) {
            toast.error(
                error.response?.data?.detail ||
                error.response?.data?.message ||
                "Unable to delete category"
            );
        }
    };

    const closeExpenseModal = () => {
        resetExpenseForm();
        setShowExpenseModal(false);
    };

    const closeCategoryModal = () => {
        resetCategoryForm();
        setShowCategoryModal(false);
    };

    if (loading) {
        return (
            <div className="min-h-[70vh] flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <div className="
                        w-10
                        h-10
                        border-4
                        border-indigo-200
                        border-t-indigo-600
                        rounded-full
                        animate-spin
                    " />

                    <p className="text-gray-500 text-sm">
                        Loading expenses...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 p-4 md:p-6">
            <div className="max-w-6xl mx-auto">
                {/* ================= HEADER ================= */}

                <div className="
                    flex
                    flex-col
                    md:flex-row
                    md:items-center
                    md:justify-between
                    gap-5
                    mb-8
                ">

                    <div>
                        <p className="
                            text-sm
                            font-semibold
                            text-indigo-600
                            mb-1
                        ">
                            Expense Management
                        </p>

                        <h1 className="
                            text-3xl
                            md:text-4xl
                            font-bold
                            text-slate-800
                        ">
                            Expenses
                        </h1>

                        <p className="
                            text-gray-500
                            mt-2
                        ">
                            Track and manage your daily spending.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={openAddExpense}
                        className="
                            self-start
                            md:self-auto
                            flex
                            items-center
                            justify-center
                            gap-2
                            bg-indigo-600
                            hover:bg-indigo-700
                            text-white
                            px-5
                            py-3
                            rounded-xl
                            shadow-md
                            hover:shadow-lg
                            transition-all
                            duration-200
                        "
                    >
                        <FaPlus size={13} />
                        Add Expense
                    </button>

                </div>


                {/* ================= SUMMARY ================= */}

                <div className="
                    grid
                    sm:grid-cols-2
                    gap-5
                    mb-8
                ">

                    {/* Total Expense */}

                    <div className="
                        bg-white
                        rounded-2xl
                        p-6
                        border
                        border-slate-100
                        shadow-sm
                        hover:shadow-md
                        transition
                    ">

                        <div className="
                            flex
                            items-center
                            justify-between
                        ">

                            <div>
                                <p className="
                                    text-sm
                                    text-gray-500
                                ">
                                    Total Expense
                                </p>

                                <p className="
                                    text-3xl
                                    font-bold
                                    text-red-500
                                    mt-2
                                ">
                                    ₹{totalExpense.toLocaleString("en-IN")}
                                </p>
                            </div>

                            <div className="
                                w-12
                                h-12
                                rounded-xl
                                bg-red-50
                                text-red-500
                                flex
                                items-center
                                justify-center
                            ">
                                <FaWallet size={19} />
                            </div>

                        </div>

                    </div>


                    {/* Transactions */}

                    <div className="
                        bg-gradient-to-br
                        from-indigo-600
                        to-violet-600
                        rounded-2xl
                        p-6
                        shadow-md
                        text-white
                    ">

                        <div className="
                            flex
                            items-center
                            justify-between
                        ">

                            <div>
                                <p className="
                                    text-indigo-100
                                    text-sm
                                ">
                                    Transactions
                                </p>

                                <p className="
                                    text-3xl
                                    font-bold
                                    mt-2
                                ">
                                    {expenses.length}
                                </p>
                            </div>

                            <div className="
                                w-12
                                h-12
                                rounded-xl
                                bg-white/20
                                flex
                                items-center
                                justify-center
                            ">
                                <FaReceipt size={19} />
                            </div>

                        </div>

                    </div>

                </div>


                {/* ================= EXPENSE LIST ================= */}

                <div className="
                    bg-white
                    rounded-2xl
                    border
                    border-slate-100
                    shadow-sm
                    overflow-hidden
                ">

                    {/* List Header */}

                    <div className="
                        px-6
                        py-5
                        border-b
                        border-slate-100
                        flex
                        items-center
                        justify-between
                    ">

                        <div>
                            <h2 className="
                                text-lg
                                font-bold
                                text-slate-800
                            ">
                                All Expenses
                            </h2>

                            <p className="
                                text-sm
                                text-gray-500
                                mt-1
                            ">
                                Your recorded transactions
                            </p>
                        </div>

                        <span className="
                            bg-indigo-50
                            text-indigo-600
                            text-xs
                            font-bold
                            px-3
                            py-1
                            rounded-full
                        ">
                            {expenses.length}
                        </span>

                    </div>


                    {/* Expense Cards */}

                    <div className="p-5">

                        {expenses.length === 0 ? (
                            <div className="
                                flex
                                flex-col
                                items-center
                                justify-center
                                py-16
                                text-gray-400
                            ">

                                <div className="
                                    w-16
                                    h-16
                                    rounded-full
                                    bg-slate-100
                                    flex
                                    items-center
                                    justify-center
                                    mb-4
                                ">
                                    <FaReceipt size={25} />
                                </div>

                                <p className="
                                    font-semibold
                                    text-slate-600
                                ">
                                    No expenses yet
                                </p>

                                <p className="
                                    text-sm
                                    mt-1
                                ">
                                    Start tracking your spending.
                                </p>

                                <button
                                    type="button"
                                    onClick={openAddExpense}
                                    className="
                                        mt-5
                                        flex
                                        items-center
                                        gap-2
                                        text-indigo-600
                                        font-semibold
                                        hover:text-indigo-800
                                    "
                                >
                                    <FaPlus size={12} />
                                    Add your first expense
                                </button>

                            </div>
                        ) : (
                            <div className="
                                grid
                                md:grid-cols-2
                                gap-4
                            ">

                                {expenses.map((expense) => {
                                    const category =
                                        categoryMap[
                                        String(expense.category_id)
                                        ];

                                    return (
                                        <div
                                            key={expense.id}
                                            className="
                                                group
                                                relative
                                                bg-slate-50
                                                rounded-2xl
                                                border
                                                border-slate-100
                                                p-5
                                                overflow-hidden
                                                transition-all
                                                duration-300
                                                hover:bg-white
                                                hover:shadow-lg
                                                hover:-translate-y-1
                                            "
                                        >

                                            {/* Category Accent */}

                                            <div
                                                className="
                                                    absolute
                                                    left-0
                                                    top-0
                                                    bottom-0
                                                    w-1.5
                                                "
                                                style={{
                                                    backgroundColor:
                                                        category?.color_code ||
                                                        "#6366F1"
                                                }}
                                            />


                                            {/* Content */}

                                            <div className="
                                                flex
                                                items-center
                                                justify-between
                                                gap-4
                                                transition-all
                                                duration-300
                                                group-hover:opacity-30
                                            ">

                                                <div className="
                                                    flex
                                                    items-center
                                                    gap-4
                                                    min-w-0
                                                ">

                                                    {/* Category Circle */}

                                                    <div
                                                        className="
                                                            w-11
                                                            h-11
                                                            rounded-xl
                                                            flex
                                                            items-center
                                                            justify-center
                                                            font-bold
                                                            shrink-0
                                                        "
                                                        style={{
                                                            backgroundColor:
                                                                category?.color_code ||
                                                                "#E5E7EB"
                                                        }}
                                                    >
                                                        {category?.name
                                                            ?.charAt(0)
                                                            ?.toUpperCase() || "?"}
                                                    </div>


                                                    <div className="min-w-0">

                                                        <h3 className="
                                                            font-semibold
                                                            text-slate-800
                                                            truncate
                                                        ">
                                                            {expense.title}
                                                        </h3>

                                                        <p className="
                                                            text-sm
                                                            text-gray-500
                                                            mt-1
                                                        ">
                                                            {category?.name ||
                                                                "Unknown category"}
                                                        </p>

                                                    </div>

                                                </div>


                                                {/* Amount */}

                                                <p className="
                                                    font-bold
                                                    text-lg
                                                    text-slate-800
                                                    whitespace-nowrap
                                                ">
                                                    ₹{Number(
                                                        expense.amount
                                                    ).toLocaleString("en-IN")}
                                                </p>

                                            </div>


                                            {/* Hover Actions */}

                                            <div className="
                                                absolute
                                                inset-0
                                                flex
                                                items-center
                                                justify-center
                                                gap-3
                                                opacity-0
                                                group-hover:opacity-100
                                                transition-opacity
                                                duration-300
                                            ">

                                                {/* Edit */}

                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        openEditExpense(expense);
                                                    }}
                                                    className="
                                                        w-11
                                                        h-11
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
                                                    "
                                                    title="Edit Expense"
                                                >
                                                    <FaEdit size={16} />
                                                </button>


                                                {/* Delete */}

                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDeleteExpense(
                                                            expense.id
                                                        );
                                                    }}
                                                    className="
                                                        w-11
                                                        h-11
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
                                                    "
                                                    title="Delete Expense"
                                                >
                                                    <FaTrash size={16} />
                                                </button>

                                            </div>

                                        </div>
                                    );
                                })}

                            </div>
                        )}

                    </div>

                </div>



                {/* ================================================== */}
                {/* EXPENSE MODAL */}
                {/* ================================================== */}

                {showExpenseModal && (
                    <div className="
                    fixed
                    inset-0
                    z-40
                    bg-black/50
                    backdrop-blur-sm
                    flex
                    items-center
                    justify-center
                    p-4
                ">

                        <div className="
                        bg-white
                        rounded-2xl
                        w-full
                        max-w-[420px]
                        p-6
                        shadow-2xl
                    ">

                            <h2 className="
                            text-2xl
                            font-bold
                            text-slate-800
                            mb-5
                        ">
                                {editExpense
                                    ? "Edit Expense"
                                    : "Add Expense"}
                            </h2>


                            {/* Title */}

                            <label className="
                            block
                            font-medium
                            text-gray-700
                            mb-2
                        ">
                                Title
                            </label>

                            <input
                                type="text"
                                placeholder="Ex: Grocery"
                                value={title}
                                onChange={(e) =>
                                    setTitle(e.target.value)
                                }
                                className="
                                w-full
                                border
                                border-gray-300
                                rounded-lg
                                p-3
                                mb-4
                                outline-none
                                focus:ring-2
                                focus:ring-indigo-500
                                focus:border-indigo-500
                            "
                            />


                            {/* Amount */}

                            <label className="
                            block
                            font-medium
                            text-gray-700
                            mb-2
                        ">
                                Amount
                            </label>

                            <input
                                type="number"
                                min="0"
                                placeholder="Ex: 500"
                                value={amount}
                                onChange={(e) =>
                                    setAmount(e.target.value)
                                }
                                className="
                                w-full
                                border
                                border-gray-300
                                rounded-lg
                                p-3
                                mb-4
                                outline-none
                                focus:ring-2
                                focus:ring-indigo-500
                                focus:border-indigo-500
                            "
                            />


                            {/* Category */}

                            <div className="relative">

                                <label className="
                                block
                                font-medium
                                text-gray-700
                                mb-2
                            ">
                                    Category
                                </label>

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowCategoryDropdown(
                                            (current) => !current
                                        )
                                    }
                                    className="
                                    w-full
                                    border
                                    border-gray-300
                                    rounded-lg
                                    px-4
                                    py-3
                                    bg-white
                                    flex
                                    items-center
                                    justify-between
                                    hover:border-indigo-400
                                    transition
                                "
                                >

                                    <div className="
                                    flex
                                    items-center
                                    gap-2
                                ">

                                        {categoryId &&
                                            categoryMap[
                                            String(categoryId)
                                            ] ? (
                                            <>
                                                <span
                                                    className="
                                                    w-4
                                                    h-4
                                                    rounded-full
                                                "
                                                    style={{
                                                        backgroundColor:
                                                            categoryMap[
                                                                String(categoryId)
                                                            ].color_code
                                                    }}
                                                />

                                                <span>
                                                    {
                                                        categoryMap[
                                                            String(categoryId)
                                                        ].name
                                                    }
                                                </span>
                                            </>
                                        ) : (
                                            <span className="
                                            text-gray-400
                                        ">
                                                Select category
                                            </span>
                                        )}

                                    </div>

                                    <FaChevronDown
                                        size={14}
                                        className={`
                                        transition-transform
                                        ${showCategoryDropdown
                                                ? "rotate-180"
                                                : ""
                                            }
                                    `}
                                    />

                                </button>


                                {/* Category Dropdown */}

                                {showCategoryDropdown && (
                                    <div className="
        absolute
        z-[60]
        mt-2
        left-0
        w-full
        bg-white
        border
        border-gray-200
        rounded-xl
        shadow-2xl
        overflow-hidden
    ">

                                        {/* Scrollable Category List */}
                                        <div className="
            h-[104px]
            overflow-y-auto
            overscroll-contain
        ">
                                            {categories.length === 0 ? (
                                                <div className="
                    h-full
                    flex
                    items-center
                    justify-center
                    text-sm
                    text-gray-500
                ">
                                                    No categories available
                                                </div>
                                            ) : (
                                                categories.map((category) => {
                                                    const selected =
                                                        String(categoryId) ===
                                                        String(category.id);

                                                    return (
                                                        <div
                                                            key={category.id}
                                                            className={`
                                h-[52px]
                                flex
                                items-center
                                justify-between
                                px-4
                                ${selected
                                                                    ? "bg-indigo-50"
                                                                    : "hover:bg-gray-50"
                                                                }
                                transition
                            `}
                                                        >
                                                            {/* Select Category */}
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
                                    min-w-0
                                "
                                                            >
                                                                <span
                                                                    className="
                                        w-4
                                        h-4
                                        rounded-full
                                        shrink-0
                                        border
                                        border-white
                                        shadow-sm
                                    "
                                                                    style={{
                                                                        backgroundColor:
                                                                            category.color_code
                                                                    }}
                                                                />

                                                                <span className="
                                    truncate
                                    font-medium
                                    text-slate-700
                                ">
                                                                    {category.name}
                                                                </span>

                                                                {selected && (
                                                                    <span className="
                                        ml-auto
                                        mr-2
                                        text-indigo-600
                                        font-bold
                                    ">
                                                                        ✓
                                                                    </span>
                                                                )}
                                                            </button>

                                                            {/* Edit / Delete */}
                                                            <div className="
                                flex
                                items-center
                                gap-1
                                shrink-0
                            ">
                                                                <button
                                                                    type="button"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
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

                                                                <button
                                                                    type="button"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handleDeleteCategory(
                                                                            category.id
                                                                        );
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
                                                    );
                                                })
                                            )}
                                        </div>

                                        {/* Fixed Add Category Button */}
                                        <button
                                            type="button"
                                            onClick={openAddCategory}
                                            className="
                w-full
                h-[52px]
                flex
                items-center
                justify-center
                gap-2
                border-t
                border-gray-200
                text-indigo-600
                font-semibold
                hover:bg-indigo-50
                transition
                bg-white
            "
                                        >
                                            <FaPlus size={13} />
                                            Add New Category
                                        </button>

                                    </div>
                                )}

                            </div>


                            {/* Expense Buttons */}

                            <div className="
                            flex
                            justify-end
                            gap-3
                            mt-6
                        ">

                                <button
                                    type="button"
                                    onClick={closeExpenseModal}
                                    className="
                                    px-5
                                    py-2.5
                                    border
                                    border-gray-300
                                    rounded-lg
                                    hover:bg-gray-100
                                    transition
                                "
                                >
                                    Cancel
                                </button>

                                <button
                                    type="button"
                                    onClick={
                                        editExpense
                                            ? handleUpdateExpense
                                            : handleAddExpense
                                    }
                                    className="
                                    bg-indigo-600
                                    hover:bg-indigo-700
                                    text-white
                                    px-5
                                    py-2.5
                                    rounded-lg
                                    transition
                                "
                                >
                                    {editExpense
                                        ? "Update Expense"
                                        : "Save Expense"}
                                </button>

                            </div>

                        </div>

                    </div>
                )}


                {/* ================================================== */}
                {/* CATEGORY MODAL */}
                {/* ================================================== */}

                {showCategoryModal && (
                    <div className="
                    fixed
                    inset-0
                    z-[70]
                    flex
                    items-center
                    justify-center
                    bg-black/50
                    backdrop-blur-sm
                    p-4
                ">

                        <div className="
                        w-full
                        max-w-[500px]
                        rounded-3xl
                        bg-white
                        shadow-2xl
                        p-7
                        max-h-[90vh]
                        overflow-y-auto
                    ">

                            {/* Header */}

                            <h2 className="
                            text-3xl
                            font-bold
                            text-slate-800
                            mb-1
                        ">
                                {editingCategory
                                    ? "Update Category"
                                    : "Add Category"}
                            </h2>

                            <p className="
                            text-gray-500
                            mb-6
                        ">
                                Create a category and choose its color.
                            </p>


                            {/* Category Name */}

                            <div>

                                <label className="
                                font-medium
                                text-gray-700
                            ">
                                    Category Name
                                </label>

                                <input
                                    type="text"
                                    placeholder="Ex: Food"
                                    value={categoryName}
                                    onChange={(e) =>
                                        setCategoryName(
                                            e.target.value
                                        )
                                    }
                                    className="
                                    mt-2
                                    w-full
                                    rounded-xl
                                    border
                                    border-gray-300
                                    p-3
                                    outline-none
                                    focus:ring-2
                                    focus:ring-indigo-500
                                    focus:border-indigo-500
                                "
                                />

                            </div>


                            {/* Selected Color */}

                            <div className="mt-6">

                                <label className="
                                font-medium
                                text-gray-700
                            ">
                                    Selected Color
                                </label>

                                <div className="
                                mt-3
                                flex
                                items-center
                                gap-4
                            ">

                                    <div
                                        className="
                                        w-12
                                        h-12
                                        rounded-full
                                        border
                                        border-gray-200
                                        shadow
                                    "
                                        style={{
                                            backgroundColor: colorCode
                                        }}
                                    />

                                    <div>

                                        <p className="
                                        font-semibold
                                        text-slate-700
                                    ">
                                            {colorCode}
                                        </p>

                                        <p className="
                                        text-sm
                                        text-gray-500
                                    ">
                                            This color will represent this category.
                                        </p>

                                    </div>

                                </div>

                            </div>


                            {/* Color Picker */}

                            {/* Color Picker */}

                            <div className="mt-7">
                                <label className="font-medium text-gray-700">
                                    Choose Color
                                </label>

                                <div className="
        mt-4
        border
        border-gray-200
        rounded-2xl
        bg-slate-50
        p-4
    ">

                                    {/* Scrollable Colors */}

                                    <div className="
            h-[220px]
            overflow-y-auto
            overscroll-contain
            pr-2
        ">

                                        <div className="
                grid
                grid-cols-5
                gap-4
            ">

                                            {CATEGORY_COLORS.map((color) => (
                                                <button
                                                    key={color.code}
                                                    type="button"
                                                    title={color.name}
                                                    onClick={() =>
                                                        setColorCode(color.code)
                                                    }
                                                    className={`
                            relative
                            w-12
                            h-12
                            mx-auto
                            rounded-full
                            border-4
                            transition-all
                            duration-200
                            hover:scale-110
                            focus:outline-none
                            focus:ring-2
                            focus:ring-indigo-400
                            focus:ring-offset-2
                            ${colorCode === color.code
                                                            ? "border-indigo-600 shadow-xl scale-110"
                                                            : "border-white shadow-md"
                                                        }
                        `}
                                                    style={{
                                                        backgroundColor: color.code
                                                    }}
                                                >
                                                    {colorCode === color.code && (
                                                        <span className="
                                absolute
                                inset-0
                                flex
                                items-center
                                justify-center
                                text-white
                                text-lg
                                font-bold
                                drop-shadow-md
                            ">
                                                            ✓
                                                        </span>
                                                    )}
                                                </button>
                                            ))}

                                        </div>

                                    </div>

                                </div>
                            </div>


                            {/* Category Buttons */}

                            <div className="
                            mt-8
                            flex
                            justify-end
                            gap-3
                        ">

                                <button
                                    type="button"
                                    onClick={closeCategoryModal}
                                    className="
                                    px-6
                                    py-3
                                    rounded-xl
                                    border
                                    border-gray-300
                                    hover:bg-gray-100
                                    transition
                                "
                                >
                                    Cancel
                                </button>

                                <button
                                    type="button"
                                    onClick={
                                        editingCategory
                                            ? handleUpdateCategory
                                            : handleAddCategory
                                    }
                                    className="
                                    px-6
                                    py-3
                                    rounded-xl
                                    bg-indigo-600
                                    text-white
                                    hover:bg-indigo-700
                                    transition
                                "
                                >
                                    {editingCategory
                                        ? "Update Category"
                                        : "Add Category"}
                                </button>

                            </div>

                        </div>

                    </div>
                )}
            </div>
        </div>
    );
}