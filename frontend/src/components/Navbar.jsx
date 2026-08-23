import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaChevronDown, FaSignOutAlt } from "react-icons/fa";

function Navbar() {

  const [showMenu, setShowMenu] = useState(false);

  const navigate = useNavigate();
  const menuRef = useRef(null);

  const user = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  useEffect(() => {
    const handleClickOutside = (event) => {

      if (
        menuRef.current &&
        !menuRef.current.contains(event.target)
      ) {
        setShowMenu(false);
      }

    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };

  }, []);

  const logout = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setShowMenu(false);

    navigate("/login");
  };

  return (
    <nav className="bg-indigo-600 text-white shadow">
      <div className="max-w-6xl mx-auto flex justify-between items-center p-4">

        <h1 className="text-2xl font-bold">
          Expense Tracker
        </h1>

        <div className="space-x-6">
          <Link to="/">Dashboard</Link>
          <Link to="/expenses">Expenses</Link>
          <Link to="/analytics">Analytics</Link>
        </div>

        <div
            className="relative"
            ref={menuRef}
          >

            <button
              onClick={() => setShowMenu(!showMenu)}
              className="flex items-center gap-2
                         bg-indigo-500 hover:bg-indigo-400
                         px-3 py-2 rounded-xl
                         transition"
            >

              {/* User Icon */}

              <div
                className="w-8 h-8 rounded-full
                           bg-white text-indigo-600
                           flex items-center justify-center"
              >
                <FaUser size={18} />
              </div>

              <span className="hidden sm:block font-medium">
                {user || "User"}
              </span>

              <FaChevronDown
                size={16}
                className={`transition-transform ${
                  showMenu ? "rotate-180" : ""
                }`}
              />

            </button>


            {/* Dropdown */}

            {showMenu && (

              <div
                className="absolute right-0 mt-2 w-64
                           bg-white text-gray-800
                           rounded-xl shadow-xl
                           overflow-hidden z-50"
              >

                {/* User Information */}

                <div className="p-4 border-b">

                  <div className="flex items-center gap-3">

                    <div
                      className="w-10 h-10 rounded-full
                                 bg-indigo-100 text-indigo-600
                                 flex items-center justify-center"
                    >
                      <FaUser size={20} />
                    </div>

                    <div className="min-w-0">

                      <p className="font-semibold truncate">
                        {user || "User"}
                      </p>

                    </div>

                  </div>

                </div>


                {/* Logout */}

                <button
                  onClick={logout}
                  className="w-full flex items-center gap-3
                             px-7 py-3
                             text-red-600
                             hover:bg-red-50
                             transition"
                >

                  <FaSignOutAlt size={18} />

                  <span>
                    Logout
                  </span>

                </button>

              </div>

            )}

          </div>

      </div>
    </nav>
  );
}

export default Navbar;