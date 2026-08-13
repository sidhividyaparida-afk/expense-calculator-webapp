import { useEffect, useState } from "react";
import api from "../api/api.js";

function Categories() {

    const [categories, setCategories] = useState([]);
    const [name, setName] = useState("");

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const res = await api.get("/categories");
            setCategories(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const addCategory = async () => {
        try {
            await api.post("/categories", null, {
                params: {
                    name: name
                }
            });

            setName("");
            fetchCategories();

        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-lg p-6">

            <h2 className="text-2xl font-semibold mb-6">
                Categories
            </h2>

            <div className="flex gap-3">

                <input
                className="flex-1 border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Category Name"
                value={name}
                onChange={(e)=>setName(e.target.value)}
                />

                <button
                onClick={addCategory}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 rounded-lg transition"
                >
                    Add
                </button>

            </div>

            <div className="mt-6 space-y-2">

                {
                    categories.map(cat=>(

                        <div
                        key={cat.id}
                        className="flex justify-between bg-slate-100 p-3 rounded-lg"
                        >
                            <span>{cat.name}</span>

                            <span className="text-gray-500">
                                #{cat.id}
                            </span>

                        </div>

                    ))
                }

            </div>

        </div>
    );
}

export default Categories;