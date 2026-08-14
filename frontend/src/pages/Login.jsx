import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api/api";

export default function Login() {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const login = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post("/login", {
                username,
                password
            });
            localStorage.setItem(
                "token",
                response.data.access_token
            );
            localStorage.setItem(
                "user",
                JSON.stringify(response.data.user)
            );
            toast.success("Login successful");
            navigate("/");
        } catch (error) {
            toast.error(
                error.response?.data?.detail ||
                "Invalid username or password"
            );
        }
    };

    return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center">
            <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-xl">
                <h1 className="text-3xl font-bold text-center">
                    Welcome Back
                </h1>
                <p className="text-gray-500 text-center mt-2">
                    Login to your expense tracker
                </p>
                <form
                    onSubmit={login}
                    className="mt-8 space-y-5"
                >
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) =>
                            setUsername(e.target.value)
                        }
                        className="w-full border rounded-xl p-3 outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) =>
                            setPassword(e.target.value)
                        }
                        className="w-full border rounded-xl p-3 outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <button
                        type="submit"
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold"
                    >
                        Login
                    </button>
                </form>

                <p className="text-center mt-6 text-gray-500">
                    Don't have an account?{" "}
                    <Link
                        to="/register"
                        className="text-indigo-600 font-semibold"
                    >
                        Register
                    </Link>
                </p>
            </div>
        </div>
    );
}