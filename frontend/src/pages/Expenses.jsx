import { useEffect, useState } from "react";
import api from "../api/api";
import toast from "react-hot-toast";
import { Plus, Wallet } from "lucide-react";
import { CATEGORY_COLORS } from "../constants/categoryColors";

export default function Expense() {
    const [expenses, setExpenses] = useState([]);
    const [categories, setCategories] = useState([]);
    const [colorCode, setColorCode] = useState("#E5F1ED");

    const [showExpenseModal, setShowExpenseModal] = useState(false);
    const [showCategoryModal, setShowCategoryModal] = useState(false);

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

    const addExpense = async () => {
        if (!title || !amount || !categoryId) {
            toast.error("Please fill all fields");
            return;
        }

        try {
            await api.post("/expenses", null, {
                params: {
                    title,
                    amount,
                    category_id: categoryId,
                },
            });

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
  
          await api.post("/categories", null, {
              params: {
                  name: categoryName,
                  color_code: colorCode
              }
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

                        <Wallet size={36} />

                        <div>

                            <p>Total Expense</p>

                            <h1 className="text-5xl font-bold mt-2">
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
                        <Plus size={18} />
                        Add Expense
                    </button>

                </div>

                <div className="grid md:grid-cols-1 gap-5 mt-8">

                {expenses.map((expense) => {
                          const category = categoryMap[expense.category_id];

                          return (
                              <div
                                  key={expense.id}
                                  className="rounded-xl shadow-md p-5"
                                  style={{
                                      backgroundColor: category?.color_code || "#fff"
                                  }}
                              >
                                  <div className="flex justify-between">

                                      <div>

                                          <h2 className="font-semibold text-lg">
                                              {expense.title}
                                          </h2>

                                          
                                            Category #{category?.name}
                                          

                                      </div>

                                      <h2 className="text-2xl font-bold text-green-600">
                                          ₹{expense.amount}
                                      </h2>

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

                        <select
                            value={categoryId}
                            onChange={(e) => {
                                if (e.target.value === "add") {
                                    setShowCategoryModal(true);
                                } else {
                                    setCategoryId(e.target.value);
                                }
                            }}
                            className="w-full border rounded-lg p-3"
                        >
                            <option value="">
                                Select Category
                            </option>

                            {categories.map((category) => (
                                <option
                                    key={category.id}
                                    value={category.id}
                                >
                                    <div
                                              className="flex items-center gap-3 p-3 hover:bg-gray-100 cursor-pointer"
                                              >

                                              <div
                                              className="w-4 h-4 rounded-full"
                                              style={{
                                              backgroundColor:category.color_code
                                              }}
                                              />

                                              <span>
                                              {category.name}
                                              </span>

                                              </div>
                                </option>
                            ))}

                            <option value="add">
                                ➕ Add New Category
                            </option>

                        </select>

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
                                onClick={addExpense}
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
                        Add Category
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

                            {CATEGORY_COLORS.map((color)=>(

                                <button
                                    key={color.code}
                                    type="button"
                                    title={color.name}
                                    onClick={()=>setColorCode(color.code)}
                                    className={`relative w-14 h-14 rounded-full border-4
                                    transition-all duration-200 hover:scale-110

                                    ${
                                        colorCode===color.code
                                        ?"border-indigo-600 shadow-xl scale-110"
                                        :"border-gray-300"
                                    }`}
                                    style={{
                                        backgroundColor:color.code
                                    }}
                                >

                                    {colorCode===color.code && (

                                        <span className="absolute inset-0 flex items-center justify-center text-xl">

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
                            onClick={addCategory}
                            className="px-6 py-3 rounded-xl bg-indigo-600
                            text-white hover:bg-indigo-700"
                        >
                            Add Category
                        </button>

                    </div>

                </div>

            </div>

            )}

        </div>
    );
}