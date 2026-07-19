function Dashboard() {
  return (
    <>
      <h1 className="text-3xl font-bold">
        Dashboard
      </h1>

      <div className="grid md:grid-cols-3 gap-5 mt-8">

        <div className="bg-white rounded-xl p-6 shadow">
          <h2 className="text-gray-500">Total Income</h2>
          <p className="text-3xl font-bold text-green-600">
            ₹0
          </p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow">
          <h2 className="text-gray-500">Total Expense</h2>
          <p className="text-3xl font-bold text-red-600">
            ₹0
          </p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow">
          <h2 className="text-gray-500">Balance</h2>
          <p className="text-3xl font-bold text-blue-600">
            ₹0
          </p>
        </div>

      </div>
    </>
  );
}
  
export default Dashboard;