
import { useEffect, useState } from "react";
import { getProducts } from "../services/api";
import type { Product } from "../types/Product";

type HomeProps = {
    onViewDetails: (id: number) => void;
    onShopNow: () => void;
};

const heroImage =
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=85";

const productImages = [
    "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&w=600&q=80",
];

const categories = [
    {
        name: "Electronics",
        description: "Phones and gadgets",
        icon: "📱",
        style: "bg-blue-50 text-blue-700",
    },
    {
        name: "Fashion",
        description: "Style for everyone",
        icon: "👕",
        style: "bg-purple-50 text-purple-700",
    },
    {
        name: "Home & Living",
        description: "Make home beautiful",
        icon: "🏠",
        style: "bg-emerald-50 text-emerald-700",
    },
    {
        name: "Accessories",
        description: "Everyday essentials",
        icon: "⌚",
        style: "bg-amber-50 text-amber-700",
    },
    {
        name: "Beauty",
        description: "Care and wellness",
        icon: "✨",
        style: "bg-pink-50 text-pink-700",
    },
    {
        name: "Sports",
        description: "Move with confidence",
        icon: "👟",
        style: "bg-orange-50 text-orange-700",
    },
];

function Home({ onViewDetails, onShopNow }: HomeProps) {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let active = true;

        const loadProducts = async () => {
            try {
                setError("");
                const data = await getProducts();

                if (active) {
                    setProducts(data);
                }
            } catch (err) {
                if (active) {
                    setError(
                        err instanceof Error
                            ? err.message
                            : "Failed to load products."
                    );
                }
            } finally {
                if (active) {
                    setLoading(false);
                }
            }
        };

        loadProducts();

        return () => {
            active = false;
        };
    }, []);

    return (
        <main className="min-h-screen overflow-hidden bg-white text-slate-900">
            {/* HERO SECTION */}
            <section className="px-4 pb-10 pt-5 sm:px-6 lg:px-8 lg:pt-8">
                <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
                    <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-blue-200/40 blur-3xl" />
                    <div className="pointer-events-none absolute -bottom-32 left-1/3 h-80 w-80 rounded-full bg-indigo-200/40 blur-3xl" />

                    <div className="relative grid items-center lg:min-h-[570px] lg:grid-cols-2">
                        {/* HERO TEXT */}
                        <div className="relative z-10 px-6 pb-4 pt-12 sm:px-10 lg:px-14 lg:py-16">
                            <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white/80 px-4 py-2 text-sm font-semibold text-blue-700 shadow-sm">
                                <span>✦</span>
                                <span>Your everyday shopping destination</span>
                            </div>

                            <h1 className="mt-7 max-w-xl text-4xl font-black leading-[1.08] tracking-tight text-slate-950 sm:text-5xl lg:text-6xl xl:text-7xl">
                                Find Your
                                <br />
                                Next{" "}
                                <span className="text-blue-600">
                                    Favorite
                                </span>
                                <br />
                                Thing.
                            </h1>

                            <p className="mt-6 max-w-lg text-base leading-7 text-slate-600 sm:text-lg">
                                Discover the products you love, explore
                                exciting new finds, and enjoy a smoother
                                shopping experience from start to finish.
                            </p>

                            <div className="mt-8 flex flex-wrap items-center gap-4">
                                <button
                                    type="button"
                                    onClick={onShopNow}
                                    className="inline-flex items-center justify-center gap-3 rounded-xl bg-blue-600 px-7 py-4 font-bold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200"
                                >
                                    Explore Products
                                    <span aria-hidden="true">→</span>
                                </button>

                                <a
                                    href="#categories"
                                    className="inline-flex items-center gap-2 rounded-xl px-4 py-3 font-semibold text-slate-700 transition hover:bg-white/70"
                                >
                                    Browse Categories
                                    <span aria-hidden="true">↓</span>
                                </a>
                            </div>

                            <div className="mt-10 grid max-w-lg grid-cols-3 gap-3 border-t border-slate-200/80 pt-6">
                                <div>
                                    <div className="text-xl font-extrabold text-slate-900 sm:text-2xl">
                                        Quality
                                    </div>
                                    <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                                        Selected products
                                    </p>
                                </div>

                                <div>
                                    <div className="text-xl font-extrabold text-slate-900 sm:text-2xl">
                                        Secure
                                    </div>
                                    <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                                        Checkout experience
                                    </p>
                                </div>

                                <div>
                                    <div className="text-xl font-extrabold text-slate-900 sm:text-2xl">
                                        Simple
                                    </div>
                                    <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                                        Easy shopping
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* HERO IMAGE */}
                        <div className="relative flex min-h-[350px] items-center justify-center px-6 pb-12 sm:min-h-[450px] lg:min-h-[570px] lg:px-10 lg:py-12">
                            <div className="absolute h-64 w-64 rounded-full border border-blue-200/70 sm:h-80 sm:w-80 lg:h-[420px] lg:w-[420px]" />
                            <div className="absolute h-52 w-52 rounded-full bg-blue-200/40 sm:h-64 sm:w-64 lg:h-80 lg:w-80" />

                            <div className="relative z-10 w-full max-w-md">
                                <div className="overflow-hidden rounded-[2rem] bg-white p-3 shadow-2xl shadow-blue-950/15 sm:p-5">
                                    <img
                                        src={heroImage}
                                        alt="Premium wireless headphones"
                                        className="h-64 w-full rounded-[1.5rem] object-cover sm:h-80"
                                    />

                                    <div className="flex items-center justify-between gap-3 px-2 pb-2 pt-5">
                                        <div>
                                            <p className="text-xs font-semibold uppercase tracking-widest text-blue-600">
                                                Featured pick
                                            </p>
                                            <h2 className="mt-1 text-lg font-extrabold text-slate-900 sm:text-xl">
                                                Everyday essentials
                                            </h2>
                                            <p className="mt-1 text-sm text-slate-500">
                                                Find something you love.
                                            </p>
                                        </div>

                                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-2xl">
                                            ✨
                                        </div>
                                    </div>
                                </div>

                                {/* FLOATING DELIVERY CARD */}
                                <div className="absolute -left-2 top-8 flex items-center gap-3 rounded-2xl border border-white/80 bg-white/95 p-3 shadow-xl sm:-left-8 sm:p-4">
                                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-xl">
                                        🚚
                                    </div>
                                    <div>
                                        <p className="text-sm font-extrabold text-slate-900">
                                            Easy shopping
                                        </p>
                                        <p className="text-xs text-slate-500">
                                            Shop from home
                                        </p>
                                    </div>
                                </div>

                                {/* FLOATING PAYMENT CARD */}
                                <div className="absolute -right-1 bottom-8 flex items-center gap-3 rounded-2xl border border-white/80 bg-white/95 p-3 shadow-xl sm:-right-6 sm:p-4">
                                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-xl">
                                        🛡️
                                    </div>
                                    <div>
                                        <p className="text-sm font-extrabold text-slate-900">
                                            Secure checkout
                                        </p>
                                        <p className="text-xs text-slate-500">
                                            Payment verification
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* BENEFITS STRIP */}
            <section className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
                <div className="grid gap-4 rounded-2xl border border-slate-100 bg-white p-5 sm:grid-cols-3 sm:p-6">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-xl">
                            🚚
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-900">
                                Convenient Shopping
                            </h3>
                            <p className="mt-1 text-sm text-slate-500">
                                Browse from anywhere
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 sm:border-x sm:border-slate-100 sm:px-5">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-xl">
                            🔒
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-900">
                                Secure Payments
                            </h3>
                            <p className="mt-1 text-sm text-slate-500">
                                Payment verification
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-xl">
                            💬
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-900">
                                Customer Support
                            </h3>
                            <p className="mt-1 text-sm text-slate-500">
                                Help when you need it
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CATEGORIES */}
            <section
                id="categories"
                className="mx-auto max-w-7xl scroll-mt-24 px-4 py-16 sm:px-6 lg:px-8 lg:py-20"
            >
                <div className="mb-8 flex items-end justify-between gap-4">
                    <div>
                        <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-600">
                            Explore your interests
                        </p>
                        <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
                            Shop by Category
                        </h2>
                        <p className="mt-3 text-sm text-slate-500 sm:text-base">
                            Discover something for every part of your life.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onShopNow}
                        className="hidden shrink-0 items-center gap-2 font-bold text-blue-600 transition hover:text-blue-800 sm:inline-flex"
                    >
                        View products <span>→</span>
                    </button>
                </div>

                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
                    {categories.map((category) => (
                        <button
                            key={category.name}
                            type="button"
                            onClick={onShopNow}
                            className="group rounded-2xl border border-slate-100 bg-white p-5 text-left transition duration-300 hover:-translate-y-1 hover:border-blue-100 hover:shadow-xl hover:shadow-slate-200/50"
                        >
                            <div
                                className={`flex h-14 w-14 items-center justify-center rounded-2xl text-3xl transition duration-300 group-hover:scale-110 ${category.style}`}
                            >
                                {category.icon}
                            </div>

                            <h3 className="mt-5 font-extrabold text-slate-900">
                                {category.name}
                            </h3>

                            <p className="mt-2 text-xs leading-5 text-slate-500">
                                {category.description}
                            </p>

                            <span className="mt-4 inline-block text-sm font-bold text-blue-600 transition group-hover:translate-x-1">
                                Explore →
                            </span>
                        </button>
                    ))}
                </div>
            </section>

            {/* FEATURED PRODUCTS */}
            <section
                id="products"
                className="scroll-mt-24 bg-slate-50 py-16 sm:py-20"
            >
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-9 flex items-end justify-between gap-4">
                        <div>
                            <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-600">
                                Handpicked for you
                            </p>
                            <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
                                Featured Products
                            </h2>
                            <p className="mt-3 text-sm text-slate-500 sm:text-base">
                                Explore products from our collection.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={onShopNow}
                            className="shrink-0 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 transition hover:border-blue-200 hover:text-blue-700"
                        >
                            View all →
                        </button>
                    </div>

                    {/* LOADING */}
                    {loading && (
                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5 lg:gap-5">
                            {[1, 2, 3, 4, 5].map((item) => (
                                <div
                                    key={item}
                                    className="animate-pulse rounded-2xl border border-slate-100 bg-white p-3 sm:p-4"
                                >
                                    <div className="h-36 rounded-xl bg-slate-200 sm:h-48" />
                                    <div className="mt-5 h-3 w-1/3 rounded bg-slate-200" />
                                    <div className="mt-3 h-4 w-4/5 rounded bg-slate-200" />
                                    <div className="mt-5 h-5 w-1/2 rounded bg-slate-200" />
                                    <div className="mt-5 h-10 rounded-xl bg-slate-200" />
                                </div>
                            ))}
                        </div>
                    )}

                    {/* ERROR */}
                    {!loading && error && (
                        <div className="rounded-2xl border border-red-100 bg-red-50 p-6 text-red-700">
                            <p className="font-bold">
                                We couldn't load the products.
                            </p>
                            <p className="mt-2 text-sm">{error}</p>
                            <button
                                type="button"
                                onClick={() => window.location.reload()}
                                className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-bold text-white hover:bg-red-700"
                            >
                                Reload page
                            </button>
                        </div>
                    )}

                    {/* EMPTY */}
                    {!loading && !error && products.length === 0 && (
                        <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
                            <div className="text-5xl">🛍️</div>
                            <h3 className="mt-5 text-xl font-extrabold text-slate-900">
                                Products coming soon
                            </h3>
                            <p className="mt-2 text-slate-500">
                                There are no products available to display yet.
                            </p>
                        </div>
                    )}

                    {/* PRODUCTS */}
                    {!loading && !error && products.length > 0 && (
                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5 lg:gap-5">
                            {products.slice(0, 5).map((product, index) => (
                                <article
                                    key={product.id}
                                    className="group overflow-hidden rounded-2xl border border-slate-100 bg-white transition duration-300 hover:-translate-y-1 hover:border-blue-100 hover:shadow-xl hover:shadow-slate-200/60"
                                >
                                    <button
                                        type="button"
                                        onClick={() =>
                                            onViewDetails(product.id)
                                        }
                                        className="block w-full text-left"
                                        aria-label={`View ${product.name}`}
                                    >
                                        <div className="relative flex h-36 items-center justify-center overflow-hidden bg-white p-3 sm:h-52 sm:p-5">
                                            <img
                                                src={
                                                    productImages[
                                                    index %
                                                    productImages.length
                                                        ]
                                                }
                                                alt={product.name}
                                                loading="lazy"
                                                className="h-full w-full object-contain transition duration-500 group-hover:scale-110"
                                            />

                                            <span className="absolute left-3 top-3 rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-blue-700 sm:text-xs">
                                                Featured
                                            </span>
                                        </div>

                                        <div className="px-3 pb-2 pt-3 sm:px-4 sm:pt-4">
                                            <p className="truncate text-[10px] font-bold uppercase tracking-wider text-blue-600 sm:text-xs">
                                                {product.categoryName ||
                                                    "Collection"}
                                            </p>

                                            <h3 className="mt-2 min-h-10 font-bold leading-5 text-slate-900 transition group-hover:text-blue-700 sm:text-base">
                                                {product.name}
                                            </h3>

                                            <p className="mt-3 text-lg font-black text-slate-950 sm:text-xl">
                                                {Number(
                                                    product.price
                                                ).toLocaleString("en-IN", {
                                                    style: "currency",
                                                    currency: "INR",
                                                    maximumFractionDigits: 2,
                                                })}
                                            </p>

                                            <p className="mt-1 text-xs text-slate-500">
                                                {product.quantity > 0
                                                    ? "Available now"
                                                    : "Currently out of stock"}
                                            </p>
                                        </div>
                                    </button>

                                    <div className="px-3 pb-3 pt-2 sm:px-4 sm:pb-4">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                onViewDetails(product.id)
                                            }
                                            disabled={product.quantity <= 0}
                                            className="w-full rounded-xl bg-slate-950 px-3 py-3 text-xs font-bold text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-slate-300 sm:text-sm"
                                        >
                                            {product.quantity > 0
                                                ? "View Product →"
                                                : "Out of Stock"}
                                        </button>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}

                    <div className="mt-9 text-center">
                        <button
                            type="button"
                            onClick={onShopNow}
                            className="rounded-xl bg-blue-600 px-7 py-3.5 font-bold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-blue-700"
                        >
                            Explore All Products →
                        </button>
                    </div>
                </div>
            </section>

            {/* PROMOTIONAL BANNER */}
            <section className="px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
                <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-slate-950">
                    <div className="absolute -right-20 -top-28 h-80 w-80 rounded-full bg-blue-600/30 blur-3xl" />
                    <div className="absolute -bottom-36 left-1/3 h-80 w-80 rounded-full bg-indigo-600/20 blur-3xl" />

                    <div className="relative flex flex-col items-start justify-between gap-10 px-6 py-12 sm:px-10 sm:py-16 lg:flex-row lg:items-center lg:px-16">
                        <div className="max-w-2xl">
                            <span className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-400/10 px-4 py-2 text-xs font-bold uppercase tracking-widest text-blue-300">
                                <span>✦</span>
                                Your next great find
                            </span>

                            <h2 className="mt-6 text-3xl font-black leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
                                Good finds.
                                <br />
                                Great shopping.
                            </h2>

                            <p className="mt-4 max-w-xl leading-7 text-slate-300">
                                Explore our collection and find products that
                                fit your style, needs, and everyday life.
                            </p>

                            <button
                                type="button"
                                onClick={onShopNow}
                                className="mt-7 rounded-xl bg-white px-7 py-4 font-bold text-slate-950 transition hover:bg-blue-50"
                            >
                                Start Exploring →
                            </button>
                        </div>

                        <div className="grid w-full max-w-sm grid-cols-2 gap-3 lg:w-72">
                            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
                                <div className="text-3xl">🎧</div>
                                <p className="mt-4 text-sm font-bold text-white">
                                    Tech & Gadgets
                                </p>
                                <p className="mt-1 text-xs text-slate-400">
                                    Everyday upgrades
                                </p>
                            </div>

                            <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
                                <div className="text-3xl">✨</div>
                                <p className="mt-4 text-sm font-bold text-white">
                                    Lifestyle
                                </p>
                                <p className="mt-1 text-xs text-slate-400">
                                    Find your favorites
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <footer className="bg-slate-950 text-white">
                <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                    <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
                        <div>
                            <button
                                type="button"
                                onClick={() => window.scrollTo({
                                    top: 0,
                                    behavior: "smooth",
                                })}
                                className="flex items-center gap-3 text-left"
                            >
                                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-xl">
                                    🛍️
                                </span>
                                <span className="text-xl font-black">
                                    MY <span className="text-blue-400">STORE</span>
                                </span>
                            </button>

                            <p className="mt-5 max-w-xs text-sm leading-6 text-slate-400">
                                Discover your favorites and enjoy a simple,
                                convenient online shopping experience.
                            </p>
                        </div>

                        <div>
                            <h3 className="font-extrabold">Quick Links</h3>
                            <div className="mt-5 space-y-3 text-sm text-slate-400">
                                <button
                                    type="button"
                                    onClick={() => window.scrollTo({
                                        top: 0,
                                        behavior: "smooth",
                                    })}
                                    className="block transition hover:text-white"
                                >
                                    Home
                                </button>
                                <button
                                    type="button"
                                    onClick={onShopNow}
                                    className="block transition hover:text-white"
                                >
                                    Products
                                </button>
                                <a
                                    href="#categories"
                                    className="block transition hover:text-white"
                                >
                                    Categories
                                </a>
                            </div>
                        </div>

                        <div>
                            <h3 className="font-extrabold">
                                Shopping Information
                            </h3>
                            <div className="mt-5 space-y-3 text-sm text-slate-400">
                                <p>Secure checkout</p>
                                <p>Order history</p>
                                <p>Product availability</p>
                            </div>
                        </div>

                        <div>
                            <h3 className="font-extrabold">Stay Connected</h3>
                            <p className="mt-5 text-sm leading-6 text-slate-400">
                                Visit our store to discover the latest
                                products and collections.
                            </p>
                            <button
                                type="button"
                                onClick={onShopNow}
                                className="mt-5 rounded-xl border border-slate-700 px-5 py-3 text-sm font-bold text-white transition hover:border-blue-400 hover:bg-blue-600"
                            >
                                Browse Products →
                            </button>
                        </div>
                    </div>

                    <div className="mt-12 border-t border-slate-800 pt-6 text-center text-xs text-slate-500">
                        © {new Date().getFullYear()} MY STORE. All rights reserved.
                    </div>
                </div>
            </footer>
        </main>
    );
}

export default Home;
