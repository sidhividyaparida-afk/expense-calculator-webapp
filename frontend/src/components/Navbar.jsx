import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="bg-indigo-600 text-white shadow">
      <div className="max-w-6xl mx-auto flex justify-between items-center p-4">

        <h1 className="text-2xl font-bold">
          Expense Tracker
        </h1>

        <div className="space-x-6">
          <Link to="/">Dashboard</Link>
          <Link to="/expenses">Expenses</Link>
          <Link to="/categories">Categories</Link>
          <Link to="/analytics">Analytics</Link>
        </div>

      </div>
    </nav>
  );
}

export default Navbar;