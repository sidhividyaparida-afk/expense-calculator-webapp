import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaArrowRight, FaWallet, FaReceipt, FaTags } from "react-icons/fa";
import { useExpenses } from "../context/ExpenseContext";
import { useCategories } from "../context/CategoryContext";

function Dashboard() {
  const navigate = useNavigate();

  const { expenses, loading: expensesLoading } = useExpenses();
  const { categories, loading: categoriesLoading } = useCategories();

  const loading = expensesLoading || categoriesLoading;

  const categoryMap = useMemo(() => {
    return categories.reduce((map, category) => {
      map[category.id] = category;
      return map;
    }, {});
  }, [categories]);

  const totalExpense = useMemo(() => {
    return expenses.reduce(
      (total, expense) => total + Number(expense.amount),
      0
    );
  }, [expenses]);

  const categoryTotals = useMemo(() => {
    return categories
      .map((category) => {
        const total = expenses
          .filter(
            (expense) => Number(expense.category_id) === Number(category.id)
          )
          .reduce((sum, expense) => sum + Number(expense.amount), 0);

        return {
          ...category,
          total,
        };
      })
      .filter((category) => category.total >= 0)
      .sort((a, b) => b.total - a.total);
  }, [categories, expenses]);

  const recentExpenses = useMemo(() => {
    return [...expenses].sort((a, b) => b.id - a.id).slice(0, 6);
  }, [expenses]);

  const formatAmount = (amount) => {
    return new Intl.NumberFormat("en-IN").format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
          <p className="text-gray-500 text-sm">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 mb-8">
          <div>
            <p className="text-sm font-semibold text-indigo-600 mb-1">
              Expense Overview
            </p>

            <h1 className="text-3xl md:text-4xl font-bold text-slate-800">
              Dashboard
            </h1>

            <p className="text-gray-500 mt-2">
              Keep track of your spending and manage your expenses.
            </p>
          </div>
        </div>

        {/* Summary Cards */}

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
          {/* Total Expense */}

          <div
            className="
                    bg-white
                    rounded-2xl
                    p-6
                    border
                    border-slate-100
                    shadow-sm
                    hover:shadow-md
                    transition-all
                    duration-200
                "
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Expense</p>

                <p className="text-3xl font-bold text-red-500 mt-2">
                  ₹{formatAmount(totalExpense)}
                </p>
              </div>

              <div
                className="
                            w-12
                            h-12
                            rounded-xl
                            bg-red-50
                            text-red-500
                            flex
                            items-center
                            justify-center
                        "
              >
                <FaWallet size={19} />
              </div>
            </div>
          </div>

          {/* Transactions */}

          <div
            className="
                    bg-white
                    rounded-2xl
                    p-6
                    border
                    border-slate-100
                    shadow-sm
                    hover:shadow-md
                    transition-all
                    duration-200
                "
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Transactions</p>

                <p className="text-3xl font-bold text-indigo-600 mt-2">
                  {expenses.length}
                </p>
              </div>

              <div
                className="
                            w-12
                            h-12
                            rounded-xl
                            bg-indigo-50
                            text-indigo-600
                            flex
                            items-center
                            justify-center
                        "
              >
                <FaReceipt size={19} />
              </div>
            </div>
          </div>

          {/* Categories */}

          <div
            className="
                    bg-gradient-to-br
                    from-indigo-600
                    to-violet-600
                    rounded-2xl
                    p-6
                    shadow-md
                    text-white
                    hover:shadow-lg
                    transition-all
                    duration-200
                "
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-indigo-100 text-sm">Categories</p>

                <p className="text-3xl font-bold mt-2">{categories.length}</p>
              </div>

              <div
                className="
                            w-12
                            h-12
                            rounded-xl
                            bg-white/20
                            flex
                            items-center
                            justify-center
                        "
              >
                <FaTags size={19} />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Recent Expenses */}

          <div
            className="
                    lg:col-span-2
                    bg-white
                    rounded-2xl
                    border
                    border-slate-100
                    shadow-sm
                    overflow-hidden
                "
          >
            <div
              className="
                        flex
                        items-center
                        justify-between
                        px-6
                        py-5
                        border-b
                        border-slate-100
                    "
            >
              <div>
                <h2 className="text-lg font-bold text-slate-800">
                  Recent Expenses
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Your latest transactions
                </p>
              </div>

              <button
                onClick={() => navigate("/expenses")}
                className="
                                flex
                                items-center
                                gap-2
                                text-sm
                                font-semibold
                                text-indigo-600
                                hover:text-indigo-800
                                transition
                            "
              >
                View all
                <FaArrowRight size={11} />
              </button>
            </div>

            {recentExpenses.length === 0 ? (
              <div
                className="
                            flex
                            flex-col
                            items-center
                            justify-center
                            py-16
                            text-gray-400
                        "
              >
                <div
                  className="
                                w-14
                                h-14
                                rounded-full
                                bg-slate-100
                                flex
                                items-center
                                justify-center
                                mb-4
                            "
                >
                  <FaReceipt size={22} />
                </div>

                <p className="font-medium">No expenses yet</p>

                <p className="text-sm mt-1">Start tracking your spending.</p>

                <button
                  onClick={() => navigate("/expenses")}
                  className="
                                    mt-4
                                    text-indigo-600
                                    font-semibold
                                    hover:text-indigo-800
                                "
                >
                  Add your first expense
                </button>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {recentExpenses.map((expense) => {
                  const category = categoryMap[expense.category_id];

                  return (
                    <div
                      key={expense.id}
                      className="
                                            px-6
                                            py-4
                                            flex
                                            items-center
                                            justify-between
                                            gap-4
                                            hover:bg-slate-50
                                            transition
                                            duration-200
                                        "
                    >
                      <div
                        className="
                                            flex
                                            items-center
                                            gap-4
                                            min-w-0
                                        "
                      >
                        {/* Category Color */}

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
                            backgroundColor: category?.color_code || "#E5E7EB",
                          }}
                        >
                          {category?.name?.charAt(0)?.toUpperCase() || "?"}
                        </div>

                        <div className="min-w-0">
                          <h3
                            className="
                                                    font-semibold
                                                    text-slate-800
                                                    truncate
                                                "
                          >
                            {expense.title}
                          </h3>

                          <p
                            className="
                                                    text-sm
                                                    text-gray-500
                                                    mt-1
                                                "
                          >
                            {category?.name || "Unknown category"}
                          </p>
                        </div>
                      </div>

                      <p
                        className="
                                            font-bold
                                            text-slate-800
                                            whitespace-nowrap
                                        "
                      >
                        ₹{formatAmount(expense.amount)}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Categories */}

          <div
            className="
                    bg-white
                    rounded-2xl
                    border
                    border-slate-100
                    shadow-sm
                    overflow-hidden
                "
          >
            <div
              className="
                        flex
                        items-center
                        justify-between
                        px-6
                        py-5
                        border-b
                        border-slate-100
                    "
            >
              <div>
                <h2 className="text-lg font-bold text-slate-800">Categories</h2>

                <p className="text-sm text-gray-500 mt-1">Spending breakdown</p>
              </div>
            </div>

            {categoryTotals.length === 0 ? (
              <div
                className="
                            py-14
                            px-6
                            text-center
                            text-gray-400
                        "
              >
                <FaTags size={25} className="mx-auto mb-3" />

                <p className="text-sm">No category expenses yet.</p>
              </div>
            ) : (
              <div
                className="
                            p-4
                            max-h-[430px]
                            overflow-y-auto
                        "
              >
                <div className="space-y-3">
                  {categoryTotals.map((category) => {

                    return (
                      <div
                        key={category.id}
                        className="
                                                p-3
                                                rounded-xl
                                                hover:bg-slate-50
                                                transition
                                                duration-200
                                            "
                      >
                        <div
                          className="
                                                flex
                                                items-center
                                                justify-between
                                                gap-3
                                                mb-2
                                            "
                        >
                          <div
                            className="
                                                    flex
                                                    items-center
                                                    gap-3
                                                    min-w-0
                                                "
                          >
                            <span
                              className="
                                                            w-3
                                                            h-3
                                                            rounded-full
                                                            shrink-0
                                                        "
                              style={{
                                backgroundColor: category.color_code,
                              }}
                            />

                            <span
                              className="
                                                        font-medium
                                                        text-slate-700
                                                        truncate
                                                    "
                            >
                              {category.name}
                            </span>
                          </div>

                          <div
                            className="
                                                    flex
                                                    items-center
                                                    gap-2
                                                    whitespace-nowrap
                                                "
                          >

                            <span
                              className="
                                                        font-semibold
                                                        text-slate-800
                                                        text-sm
                                                    "
                            >
                              ₹{formatAmount(category.total)}
                            </span>
                          </div>
                        </div>

                        {/* Progress Bar */}

                        <div
                          className="
                                                h-2
                                                bg-slate-100
                                                rounded-full
                                                overflow-hidden
                                            "
                        >
                          <div
                            className="
                                                        h-full
                                                        rounded-full
                                                        transition-all
                                                        duration-500
                                                    "
                            style={{
                              width: `${(category.total/totalExpense)*100}%`,
                              backgroundColor: category.color_code,
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
