import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api/api";

export default function Register() {

    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const register = async (e) => {

        e.preventDefault();

        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        try {

            await api.post("/register", {
                username,
                password
            });

            toast.success(
                "Account created successfully"
            );

            navigate("/login");

        } catch (error) {

            toast.error(
                error.response?.data?.detail ||
                "Registration failed"
            );
        }
    };

    return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center">

            <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-xl">

                <h1 className="text-3xl font-bold text-center">
                    Create Account
                </h1>

                <p className="text-gray-500 text-center mt-2">
                    Start tracking your expenses
                </p>

                <form
                    onSubmit={register}
                    className="mt-8 space-y-4"
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

                    <input
                        type="password"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) =>
                            setConfirmPassword(e.target.value)
                        }
                        className="w-full border rounded-xl p-3 outline-none focus:ring-2 focus:ring-indigo-500"
                    />

                    <button
                        type="submit"
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold"
                    >
                        Create Account
                    </button>

                </form>

                <p className="text-center mt-6 text-gray-500">

                    Already have an account?{" "}

                    <Link
                        to="/login"
                        className="text-indigo-600 font-semibold"
                    >
                        Login
                    </Link>

                </p>

            </div>

        </div>
    );
}