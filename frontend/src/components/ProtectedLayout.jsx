import { Outlet } from "react-router-dom";
import Layout from "../components/Layout";
import { CategoryProvider } from "../context/CategoryContext";
import { ExpenseProvider } from "../context/ExpenseContext";

function ProtectedLayout() {
    return (
        <ExpenseProvider>
            <CategoryProvider>
                <Layout>
                    <Outlet />
                </Layout>
            </CategoryProvider>
        </ExpenseProvider>
    );
}

export default ProtectedLayout;