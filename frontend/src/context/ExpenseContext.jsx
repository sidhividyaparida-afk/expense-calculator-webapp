import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/api";

const ExpenseContext = createContext(null);

export function ExpenseProvider({ children }) {
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchExpenses = async () => {
        try {
            const response = await api.get("/expenses");
            setExpenses(response.data);
        } catch (error) {
            console.error("Unable to fetch expenses", error);
        } finally {
            setLoading(false);
        }
    };

    const addExpense = async (expenseData) => {
        const response = await api.post("/expenses", expenseData);

        const newExpense = response.data.expense;

        setExpenses((current) => [
            ...current,
            newExpense
        ]);

        return newExpense;
    };

    const updateExpense = async (expenseId, expenseData) => {
        const response = await api.put(
            `/expenses/${expenseId}`,
            expenseData
        );

        const updatedExpense = response.data.expense;

        setExpenses((current) =>
            current.map((expense) =>
                expense.id === expenseId
                    ? updatedExpense
                    : expense
            )
        );

        return updatedExpense;
    };

    const deleteExpense = async (expenseId) => {
        await api.delete(`/expenses/${expenseId}`);

        setExpenses((current) =>
            current.filter(
                (expense) => expense.id !== expenseId
            )
        );
    };

    useEffect(() => {
        fetchExpenses();
    }, []);

    return (
        <ExpenseContext.Provider
            value={{
                expenses,
                loading,
                fetchExpenses,
                addExpense,
                updateExpense,
                deleteExpense
            }}
        >
            {children}
        </ExpenseContext.Provider>
    );
}

export function useExpenses() {
    return useContext(ExpenseContext);
}