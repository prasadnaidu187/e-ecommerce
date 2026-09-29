import { useEffect, useState } from "react";
import {
    getProducts,
    getProductsByCategory,
    getCategories
} from "../services/api";

import type { Product } from "../types/Product";
import type { Category } from "../types/Category";

type ProductsProps = {
    onViewDetails: (id: number) => void;
};

function Products({ onViewDetails }: ProductsProps) {

    const [products, setProducts] = useState<Product[]>([]);

    const [categories, setCategories] =
        useState<Category[]>([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [search, setSearch] = useState("");

    const [sort, setSort] = useState("default");

    const [selectedCategory, setSelectedCategory] =
        useState<number | null>(null);


    // ================= LOAD ALL PRODUCTS =================

    const loadAllProducts = async () => {

        try {

            setLoading(true);
            setError("");
            setSelectedCategory(null);

            const data = await getProducts();

            setProducts(data);

        } catch (error) {

            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError("Failed to load products");
            }

        } finally {

            setLoading(false);

        }
    };


    // ================= LOAD BY CATEGORY =================

    const loadProductsByCategory = async (
        categoryId: number
    ) => {

        try {

            setLoading(true);
            setError("");
            setSelectedCategory(categoryId);

            const data =
                await getProductsByCategory(categoryId);

            setProducts(data);

        } catch (error) {

            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError(
                    "Failed to load category products"
                );
            }

        } finally {

            setLoading(false);

        }
    };


    // ================= LOAD CATEGORIES =================

    const loadCategories = async () => {

        try {

            const data = await getCategories();

            setCategories(data);

        } catch (error) {

            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError("Failed to load categories");
            }

        }
    };


    // ================= INITIAL LOAD =================

    useEffect(() => {

        loadAllProducts();
        loadCategories();

    }, []);


    // ================= SEARCH + SORT =================

    const filteredProducts = products
        .filter((product) => {

            const searchText =
                search.toLowerCase().trim();

            return (
                product.name
                    .toLowerCase()
                    .includes(searchText) ||

                product.description
                    .toLowerCase()
                    .includes(searchText) ||

                product.categoryName
                    .toLowerCase()
                    .includes(searchText)
            );

        })
        .sort((a, b) => {

            if (sort === "low") {
                return a.price - b.price;
            }

            if (sort === "high") {
                return b.price - a.price;
            }

            if (sort === "name") {
                return a.name.localeCompare(b.name);
            }

            return 0;

        });


    // ================= UI =================

    return (

        <div className="min-h-screen bg-slate-50 text-slate-900">


            {/* ================= PAGE HEADER ================= */}

            <section className="bg-white border-b border-slate-200">

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

                    <p className="text-blue-600 text-sm font-bold uppercase tracking-wider">
                        Explore our collection
                    </p>

                    <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5">

                        <div>

                            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mt-2">
                                All Products
                            </h1>

                            <p className="text-slate-500 mt-3 max-w-xl">
                                Discover products you'll love,
                                carefully selected for your shopping experience.
                            </p>

                        </div>

                        <div className="text-sm text-slate-500">

                            <span className="font-bold text-slate-900">
                                {filteredProducts.length}
                            </span>{" "}
                            products found

                        </div>

                    </div>

                </div>

            </section>


            {/* ================= FILTER AREA ================= */}

            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-7">

                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">


                    {/* SEARCH + SORT */}

                    <div className="flex flex-col md:flex-row gap-3">


                        {/* SEARCH */}

                        <div className="relative flex-1">

                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                🔍
                            </span>

                            <input
                                type="text"
                                value={search}
                                onChange={(e) =>
                                    setSearch(e.target.value)
                                }
                                placeholder="Search products..."
                                className="w-full h-12 pl-11 pr-4 rounded-xl bg-slate-50 border border-slate-200 outline-none text-sm focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition"
                            />

                        </div>


                        {/* SORT */}

                        <select
                            value={sort}
                            onChange={(e) =>
                                setSort(e.target.value)
                            }
                            className="h-12 px-4 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium outline-none focus:border-blue-500 cursor-pointer"
                        >

                            <option value="default">
                                Sort: Featured
                            </option>

                            <option value="low">
                                Price: Low to High
                            </option>

                            <option value="high">
                                Price: High to Low
                            </option>

                            <option value="name">
                                Name: A to Z
                            </option>

                        </select>

                    </div>


                    {/* CATEGORIES */}

                    <div className="flex items-center gap-2 overflow-x-auto pt-4">

                        <button
                            onClick={loadAllProducts}
                            className={`px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition ${
                                selectedCategory === null
                                    ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                            }`}
                        >
                            All Products
                        </button>


                        {categories.map((category) => (

                            <button
                                key={category.id}
                                onClick={() =>
                                    loadProductsByCategory(
                                        category.id
                                    )
                                }
                                className={`px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition ${
                                    selectedCategory === category.id
                                        ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                }`}
                            >
                                {category.name}
                            </button>

                        ))}

                    </div>

                </div>

            </section>


            {/* ================= PRODUCTS ================= */}

            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">


                {/* LOADING */}

                {loading && (

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

                        {[1, 2, 3, 4].map((item) => (

                            <div
                                key={item}
                                className="bg-white rounded-2xl border border-slate-100 p-4 animate-pulse"
                            >

                                <div className="h-60 bg-slate-200 rounded-xl" />

                                <div className="h-4 bg-slate-200 rounded mt-5 w-1/3" />

                                <div className="h-5 bg-slate-200 rounded mt-3 w-3/4" />

                                <div className="h-4 bg-slate-200 rounded mt-3 w-full" />

                                <div className="h-10 bg-slate-200 rounded-xl mt-5" />

                            </div>

                        ))}

                    </div>

                )}


                {/* ERROR */}

                {!loading && error && (

                    <div className="bg-red-50 border border-red-100 text-red-600 rounded-2xl px-6 py-5 text-center">

                        <p className="font-semibold">
                            {error}
                        </p>

                        <button
                            onClick={loadAllProducts}
                            className="mt-4 px-5 py-2.5 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700"
                        >
                            Try Again
                        </button>

                    </div>

                )}


                {/* EMPTY */}

                {!loading &&
                    !error &&
                    filteredProducts.length === 0 && (

                        <div className="bg-white rounded-2xl border border-slate-200 p-16 text-center">

                            <div className="text-6xl">
                                🔍
                            </div>

                            <h2 className="text-xl font-bold mt-5">
                                No products found
                            </h2>

                            <p className="text-slate-500 mt-2">
                                Try searching for something else.
                            </p>

                            <button
                                onClick={() => {
                                    setSearch("");
                                    loadAllProducts();
                                }}
                                className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700"
                            >
                                View All Products
                            </button>

                        </div>

                    )}


                {/* PRODUCT GRID */}

                {!loading &&
                    !error &&
                    filteredProducts.length > 0 && (

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

                            {filteredProducts.map((product) => (

                                <div
                                    key={product.id}
                                    className="group bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                                >

                                    {/* IMAGE */}

                                    <div className="relative h-64 bg-gradient-to-br from-slate-100 to-blue-50 overflow-hidden">

                                        <div className="absolute inset-0 flex items-center justify-center">

                                            <span className="text-7xl group-hover:scale-110 transition duration-500">
                                                🛍️
                                            </span>

                                        </div>


                                        {/* WISHLIST */}

                                        <button
                                            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/95 shadow-md flex items-center justify-center text-lg text-slate-500 hover:text-red-500 hover:scale-105 transition"
                                        >
                                            ♡
                                        </button>


                                        {/* CATEGORY */}

                                        <div className="absolute top-4 left-4">

                                            <span className="px-3 py-1.5 bg-white/90 backdrop-blur rounded-full text-[10px] font-bold uppercase tracking-wider text-blue-600">
                                                {product.categoryName}
                                            </span>

                                        </div>

                                    </div>


                                    {/* CONTENT */}

                                    <div className="p-5">


                                        <h2 className="font-bold text-lg text-slate-900 truncate">
                                            {product.name}
                                        </h2>


                                        <p className="text-sm text-slate-500 mt-2 line-clamp-2 min-h-10">
                                            {product.description}
                                        </p>


                                        {/* RATING */}

                                        <div className="flex items-center gap-2 mt-4">

                                            <span className="text-yellow-400 text-sm">
                                                ★★★★★
                                            </span>

                                            <span className="text-xs text-slate-400">
                                                4.8
                                            </span>

                                        </div>


                                        {/* PRICE */}

                                        <div className="flex items-end justify-between mt-4">

                                            <div>

                                                <p className="text-2xl font-extrabold text-blue-600">
                                                    ₹{product.price}
                                                </p>

                                                {product.quantity > 0 ? (

                                                    <p className="text-xs text-green-600 font-semibold mt-1">
                                                        ✓ In Stock
                                                    </p>

                                                ) : (

                                                    <p className="text-xs text-red-500 font-semibold mt-1">
                                                        Out of Stock
                                                    </p>

                                                )}

                                            </div>

                                        </div>


                                        {/* BUTTON */}

                                        <button
                                            onClick={() =>
                                                onViewDetails(
                                                    product.id
                                                )
                                            }
                                            className="w-full mt-5 py-3 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 active:bg-blue-800 transition shadow-sm"
                                        >
                                            View Product
                                        </button>

                                    </div>

                                </div>

                            ))}

                        </div>

                    )}

            </section>

        </div>
    );
}

export default Products;