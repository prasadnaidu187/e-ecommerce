import { useEffect, useState } from "react";
import { getProducts } from "../services/api";
import type { Product } from "../types/Product";

type HomeProps = {
    onViewDetails: (id: number) => void;
    onShopNow: () => void;
};

function Home({ onViewDetails, onShopNow }: HomeProps) {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");

    useEffect(() => {
        const loadProducts = async () => {
            try {
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

        loadProducts();
    }, []);

    const categories = [
        {
            name: "Electronics",
            description: "Smartphones, Laptops, etc.",
            icon: "📱",
            bg: "bg-blue-50",
        },
        {
            name: "Fashion",
            description: "Men, Women, Kids",
            icon: "👕",
            bg: "bg-indigo-50",
        },
        {
            name: "Home & Living",
            description: "Furniture, Decor, Kitchen",
            icon: "🛋️",
            bg: "bg-green-50",
        },
        {
            name: "Accessories",
            description: "Bags, Watches, More",
            icon: "🎧",
            bg: "bg-purple-50",
        },
        {
            name: "Beauty & Health",
            description: "Skincare, Makeup, Health",
            icon: "🧴",
            bg: "bg-pink-50",
        },
        {
            name: "Sports",
            description: "Fitness, Outdoor, Sports",
            icon: "👟",
            bg: "bg-orange-50",
        },
    ];

    const productImages = [
        "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&w=600&q=80",
    ];

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900">

            {/* ================= HERO ================= */}

            <section className="px-4 sm:px-6 lg:px-8 pt-4">
                <div className="max-w-7xl mx-auto overflow-hidden rounded-[28px] bg-gradient-to-br from-blue-50 via-indigo-50 to-slate-100">

                    <div className="grid lg:grid-cols-2 items-center min-h-[520px]">

                        {/* LEFT SIDE */}

                        <div className="px-7 sm:px-10 lg:px-14 py-14">

                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-sm text-sm font-semibold text-slate-700">
                                🔥
                                <span>Up to 50% Off</span>
                            </div>

                            <h1 className="mt-6 text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.05]">
                                Shop Everything
                                <br />
                                <span className="text-blue-600">
                                    You Love
                                </span>
                            </h1>

                            <p className="mt-6 max-w-xl text-base sm:text-lg text-slate-600 leading-relaxed">
                                Discover amazing products, best deals and a
                                seamless shopping experience — all in one place.
                            </p>

                            <button
                                onClick={onShopNow}
                                className="mt-8 inline-flex items-center gap-3 rounded-xl bg-blue-600 px-7 py-4 text-white font-bold shadow-lg shadow-blue-200 transition hover:bg-blue-700 hover:-translate-y-0.5"
                            >
                                Shop Now
                                <span>→</span>
                            </button>

                            {/* BENEFITS */}

                            <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-5">

                                <div className="flex items-center gap-3">
                                    <div className="h-11 w-11 rounded-xl bg-white flex items-center justify-center text-xl shadow-sm">
                                        🚚
                                    </div>

                                    <div>
                                        <p className="text-sm font-bold">
                                            Free Shipping
                                        </p>

                                        <p className="text-xs text-slate-500">
                                            On orders over ₹999
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="h-11 w-11 rounded-xl bg-white flex items-center justify-center text-xl shadow-sm">
                                        🛡️
                                    </div>

                                    <div>
                                        <p className="text-sm font-bold">
                                            Secure Payments
                                        </p>

                                        <p className="text-xs text-slate-500">
                                            100% secure checkout
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="h-11 w-11 rounded-xl bg-white flex items-center justify-center text-xl shadow-sm">
                                        🎧
                                    </div>

                                    <div>
                                        <p className="text-sm font-bold">
                                            24/7 Support
                                        </p>

                                        <p className="text-xs text-slate-500">
                                            We're here to help
                                        </p>
                                    </div>
                                </div>

                            </div>

                        </div>


                        {/* RIGHT SIDE */}

                        <div className="relative min-h-[400px] lg:min-h-[520px] flex items-center justify-center p-8">

                            {/* Background circles */}

                            <div className="absolute h-72 w-72 sm:h-96 sm:w-96 rounded-full bg-blue-100/70" />

                            <div className="absolute h-52 w-52 rounded-full bg-indigo-100/80 translate-x-28 -translate-y-16" />


                            {/* Headphone */}

                            <div className="relative z-10">

                                <div className="w-52 h-52 sm:w-64 sm:h-64 rounded-full bg-slate-900 shadow-2xl flex items-center justify-center">

                                    <div className="w-40 h-40 sm:w-48 sm:h-48 rounded-full border-[22px] border-slate-800 flex items-center justify-center">

                                        <div className="w-24 h-24 rounded-full bg-slate-950" />

                                    </div>

                                </div>

                                <div className="absolute -left-5 top-20 w-12 h-24 bg-slate-800 rounded-2xl" />

                                <div className="absolute -right-5 top-20 w-12 h-24 bg-slate-800 rounded-2xl" />

                            </div>


                            {/* PHONE */}

                            <div className="absolute z-20 right-[13%] top-[20%] rotate-6">

                                <div className="w-24 h-48 sm:w-28 sm:h-56 rounded-[22px] bg-slate-900 p-2 shadow-2xl">

                                    <div className="h-full rounded-[17px] bg-gradient-to-br from-slate-700 to-slate-950 flex items-center justify-center">

                                        <span className="text-4xl text-white">
                                            
                                        </span>

                                    </div>

                                </div>

                            </div>


                            {/* WATCH */}

                            <div className="absolute z-30 right-[6%] bottom-[18%]">

                                <div className="w-24 h-28 rounded-[28px] bg-slate-900 shadow-2xl flex items-center justify-center">

                                    <div className="w-16 h-16 rounded-2xl bg-black border border-slate-600 flex items-center justify-center text-white text-xs font-bold">
                                        10:09
                                    </div>

                                </div>

                            </div>


                            {/* DEAL TEXT */}

                            <div className="absolute right-4 top-12 rotate-[-8deg] text-blue-500 font-semibold">
                                Better
                                <br />
                                Deals
                                <br />
                                Everyday ↗
                            </div>

                        </div>

                    </div>


                    {/* SLIDER DOTS */}

                    <div className="flex justify-center gap-2 pb-5">

                        <span className="w-3 h-3 rounded-full bg-blue-600" />

                        <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />

                        <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />

                        <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />

                    </div>

                </div>
            </section>


            {/* ================= CATEGORIES ================= */}

            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">

                <div className="flex items-center justify-between mb-7">

                    <h2 className="text-2xl sm:text-3xl font-extrabold">
                        Shop by Category
                    </h2>

                    <button
                        onClick={onShopNow}
                        className="text-blue-600 font-semibold text-sm hover:text-blue-800"
                    >
                        View All →
                    </button>

                </div>


                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">

                    {categories.map((category) => (

                        <button
                            key={category.name}
                            onClick={onShopNow}
                            className={`${category.bg} rounded-2xl p-5 min-h-[145px] flex flex-col items-center justify-center text-center transition duration-300 hover:-translate-y-1 hover:shadow-lg`}
                        >

                            <div className="text-5xl mb-3">
                                {category.icon}
                            </div>

                            <h3 className="font-bold text-sm">
                                {category.name}
                            </h3>

                            <p className="text-[11px] text-slate-500 mt-1">
                                {category.description}
                            </p>

                        </button>

                    ))}

                </div>

            </section>


            {/* ================= FEATURED PRODUCTS ================= */}

            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

                <div className="flex items-end justify-between mb-7">

                    <div>

                        <p className="text-blue-600 text-sm font-bold uppercase tracking-wider">
                            Explore
                        </p>

                        <h2 className="text-2xl sm:text-3xl font-extrabold mt-1">
                            Featured Products
                        </h2>

                    </div>

                    <button
                        onClick={onShopNow}
                        className="text-blue-600 font-semibold text-sm hover:text-blue-800"
                    >
                        View All →
                    </button>

                </div>


                {/* LOADING */}

                {loading && (

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">

                        {[1, 2, 3, 4, 5].map((item) => (

                            <div
                                key={item}
                                className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm animate-pulse"
                            >

                                <div className="h-52 bg-slate-200 rounded-xl" />

                                <div className="h-4 bg-slate-200 rounded mt-5 w-3/4" />

                                <div className="h-4 bg-slate-200 rounded mt-3 w-1/2" />

                                <div className="h-10 bg-slate-200 rounded-xl mt-5" />

                            </div>

                        ))}

                    </div>

                )}


                {/* ERROR */}

                {error && (

                    <div className="bg-red-50 border border-red-100 text-red-600 rounded-xl px-5 py-4">
                        {error}
                    </div>

                )}


                {/* EMPTY */}

                {!loading && !error && products.length === 0 && (

                    <div className="bg-white rounded-2xl p-10 text-center">
                        <p className="text-slate-500">
                            No products available.
                        </p>
                    </div>

                )}


                {/* PRODUCTS */}

                {!loading && !error && products.length > 0 && (

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">

                        {products.slice(0, 5).map((product, index) => (

                            <div
                                key={product.id}
                                className="group bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                            >

                                {/* IMAGE */}

                                <div className="relative h-52 bg-slate-50 overflow-hidden">

                                    <img
                                        src={productImages[index % productImages.length]}
                                        alt={product.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                                    />

                                    <button
                                        className="absolute top-3 right-3 h-9 w-9 rounded-full bg-white/95 shadow-sm flex items-center justify-center text-slate-500 hover:text-red-500 transition"
                                    >
                                        ♡
                                    </button>

                                </div>


                                {/* PRODUCT CONTENT */}

                                <div className="p-4">

                                    <p className="text-blue-600 text-[11px] font-bold uppercase tracking-wider">
                                        {product.categoryName}
                                    </p>

                                    <h3 className="font-bold text-slate-900 mt-2 truncate">
                                        {product.name}
                                    </h3>

                                    <div className="flex items-center gap-1 mt-2">

                                        <span className="text-yellow-400 text-sm">
                                            ★★★★★
                                        </span>

                                        <span className="text-xs text-slate-400">
                                            (48 reviews)
                                        </span>

                                    </div>

                                    <p className="text-lg font-extrabold text-blue-600 mt-4">
                                        ₹{product.price}
                                    </p>

                                    <button
                                        onClick={() =>
                                            onViewDetails(product.id)
                                        }
                                        className="w-full mt-4 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 transition"
                                    >
                                        🛒 Add to Cart
                                    </button>

                                </div>

                            </div>

                        ))}

                    </div>

                )}

            </section>


            {/* ================= OFFER ================= */}

            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">

                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-950 via-indigo-900 to-blue-900 text-white">

                    <div className="absolute -right-20 -top-20 w-72 h-72 rounded-full bg-blue-500/20" />

                    <div className="relative z-10 px-7 sm:px-12 py-10 sm:py-12 flex flex-col lg:flex-row lg:items-center justify-between gap-8">

                        <div>

                            <span className="inline-block px-4 py-1.5 rounded-full bg-blue-500/30 text-blue-200 text-xs font-bold">
                                LIMITED TIME OFFER
                            </span>

                            <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold">
                                Get Up to 50% Off
                            </h2>

                            <p className="mt-2 text-blue-100">
                                On selected products. Don't miss out!
                            </p>

                            <button
                                onClick={onShopNow}
                                className="mt-6 bg-white text-blue-900 px-6 py-3 rounded-lg font-bold hover:bg-blue-50 transition"
                            >
                                Shop Now →
                            </button>

                        </div>

                        <div className="text-8xl sm:text-9xl">
                            🛒
                        </div>

                    </div>

                </div>

            </section>


            {/* ================= FOOTER ================= */}

            <footer className="bg-slate-950 text-white">

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

                        {/* BRAND */}

                        <div>

                            <div className="flex items-center gap-3">

                                <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-xl">
                                    🛍️
                                </div>

                                <h2 className="text-xl font-extrabold">
                                    MY <span className="text-blue-500">
                                        STORE
                                    </span>
                                </h2>

                            </div>

                            <p className="text-slate-400 text-sm leading-relaxed mt-5 max-w-xs">
                                Your one-stop shop for the best products
                                at the best prices.
                            </p>

                        </div>


                        {/* QUICK LINKS */}

                        <div>

                            <h3 className="font-bold mb-5">
                                Quick Links
                            </h3>

                            <div className="space-y-3 text-sm text-slate-400">

                                <p>Home</p>

                                <p
                                    onClick={onShopNow}
                                    className="cursor-pointer hover:text-white"
                                >
                                    Products
                                </p>

                                <p>Categories</p>
                                <p>About</p>
                                <p>Contact</p>

                            </div>

                        </div>


                        {/* CUSTOMER SERVICE */}

                        <div>

                            <h3 className="font-bold mb-5">
                                Customer Service
                            </h3>

                            <div className="space-y-3 text-sm text-slate-400">

                                <p>Help Center</p>
                                <p>Shipping Info</p>
                                <p>Returns & Refunds</p>
                                <p>Track Order</p>
                                <p>FAQ</p>

                            </div>

                        </div>


                        {/* NEWSLETTER */}

                        <div>

                            <h3 className="font-bold mb-5">
                                Newsletter
                            </h3>

                            <p className="text-sm text-slate-400 leading-relaxed">
                                Subscribe to get special offers,
                                latest products and more!
                            </p>

                            <div className="flex mt-5">

                                <input
                                    type="email"
                                    placeholder="Enter your email address"
                                    className="min-w-0 flex-1 px-4 py-3 rounded-l-lg text-sm text-slate-900 outline-none"
                                />

                                <button className="bg-blue-600 px-5 rounded-r-lg text-sm font-bold hover:bg-blue-700">
                                    Subscribe
                                </button>

                            </div>

                        </div>

                    </div>


                    <div className="border-t border-slate-800 mt-12 pt-6 text-center">

                        <p className="text-xs text-slate-500">
                            © 2026 MY STORE. All rights reserved.
                        </p>

                    </div>

                </div>

            </footer>

        </div>
    );
}

export default Home;