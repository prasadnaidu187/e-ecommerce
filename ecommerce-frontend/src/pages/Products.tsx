import { useEffect, useMemo, useState } from "react";
import {
    getProducts,
    getProductsByCategory,
    getCategories,
} from "../services/api";

import type { Product } from "../types/Product";
import type { Category } from "../types/Category";

type ProductsProps = {
    onViewDetails: (id: number) => void;
};

type ViewMode = "grid" | "list";


// ================= SAMPLE DATA =================
// Shown only when your API returns an empty product list.
// Delete this block (and the references to it below) once your database has real products.
// If TypeScript complains, your Product type has extra required fields: add them here.

const SAMPLE_CATEGORIES = [
    { id: 9001, name: "Electronics" },
    { id: 9002, name: "Fashion" },
    { id: 9003, name: "Home & Kitchen" },
    { id: 9004, name: "Fitness" },
    { id: 9005, name: "Books" },
] as Category[];

const SAMPLE_PRODUCTS = [
    {
        id: 9101,
        name: "Wireless Noise-Cancelling Headphones",
        description: "Over-ear Bluetooth headphones with 30-hour battery life, active noise cancellation and a built-in microphone.",
        price: 4999,
        quantity: 24,
        categoryName: "Electronics",
    },
    {
        id: 9102,
        name: "Smart Fitness Watch",
        description: "AMOLED display, heart-rate and sleep tracking, GPS, and 7-day battery life. Water resistant up to 50 m.",
        price: 3499,
        quantity: 3,
        categoryName: "Electronics",
    },
    {
        id: 9103,
        name: "20,000 mAh Power Bank",
        description: "Fast-charging power bank with dual USB-A and one USB-C port. Charges a phone about five times.",
        price: 1799,
        quantity: 60,
        categoryName: "Electronics",
    },
    {
        id: 9104,
        name: "Classic Cotton Crew T-Shirt",
        description: "Soft 100% combed cotton, regular fit, pre-shrunk. Available in everyday colours.",
        price: 499,
        quantity: 120,
        categoryName: "Fashion",
    },
    {
        id: 9105,
        name: "Slim Fit Stretch Jeans",
        description: "Mid-rise slim jeans with stretch denim for all-day comfort. Machine washable.",
        price: 1599,
        quantity: 45,
        categoryName: "Fashion",
    },
    {
        id: 9106,
        name: "Everyday Running Shoes",
        description: "Lightweight mesh upper with cushioned sole and non-slip grip. Built for daily runs and walks.",
        price: 2499,
        quantity: 0,
        categoryName: "Fashion",
    },
    {
        id: 9107,
        name: "Stainless Steel Water Bottle",
        description: "1 litre double-wall insulated bottle. Keeps drinks cold for 24 hours or hot for 12.",
        price: 699,
        quantity: 85,
        categoryName: "Home & Kitchen",
    },
    {
        id: 9108,
        name: "Non-Stick Cookware Set",
        description: "Three-piece set with a frying pan, kadhai and tawa. Induction and gas compatible.",
        price: 2199,
        quantity: 18,
        categoryName: "Home & Kitchen",
    },
    {
        id: 9109,
        name: "LED Study Desk Lamp",
        description: "Eye-care lamp with three colour modes, five brightness levels and a flexible neck.",
        price: 899,
        quantity: 4,
        categoryName: "Home & Kitchen",
    },
    {
        id: 9110,
        name: "Anti-Slip Yoga Mat",
        description: "6 mm thick eco-friendly mat with a non-slip surface and a carry strap.",
        price: 799,
        quantity: 70,
        categoryName: "Fitness",
    },
    {
        id: 9111,
        name: "Adjustable Dumbbell Pair",
        description: "Pair of adjustable dumbbells, 2 to 10 kg each, with a secure locking collar.",
        price: 2999,
        quantity: 12,
        categoryName: "Fitness",
    },
    {
        id: 9112,
        name: "Atomic Habits",
        description: "A practical guide to building good habits and breaking bad ones, by James Clear. Paperback.",
        price: 449,
        quantity: 200,
        categoryName: "Books",
    },
] as Product[];


// ================= CONSTANTS =================

const PAGE_SIZE = 12;
const LOW_STOCK_LIMIT = 5;

const PRICE_RANGES = [
    { id: "all", label: "Any price", min: 0, max: Infinity },
    { id: "u500", label: "Under ₹500", min: 0, max: 500 },
    { id: "500-2000", label: "₹500 – ₹2,000", min: 500, max: 2000 },
    { id: "2000-10000", label: "₹2,000 – ₹10,000", min: 2000, max: 10000 },
    { id: "10000+", label: "₹10,000 and above", min: 10000, max: Infinity },
];

const SORT_OPTIONS = [
    { value: "default", label: "Featured" },
    { value: "low", label: "Price: low to high" },
    { value: "high", label: "Price: high to low" },
    { value: "name", label: "Name: A to Z" },
];

// Static class names so Tailwind can detect them
const TONES = [
    "from-teal-50 to-emerald-100",
    "from-amber-50 to-orange-100",
    "from-sky-50 to-indigo-100",
    "from-rose-50 to-pink-100",
    "from-violet-50 to-purple-100",
    "from-lime-50 to-green-100",
];

const ICONS: { match: string; icon: string }[] = [
    { match: "electron", icon: "🎧" },
    { match: "mobile", icon: "📱" },
    { match: "laptop", icon: "💻" },
    { match: "fashion", icon: "👕" },
    { match: "cloth", icon: "👕" },
    { match: "shoe", icon: "👟" },
    { match: "home", icon: "🏡" },
    { match: "kitchen", icon: "🍳" },
    { match: "fitness", icon: "🏋️" },
    { match: "sport", icon: "⚽" },
    { match: "book", icon: "📚" },
    { match: "beauty", icon: "💄" },
    { match: "toy", icon: "🧸" },
    { match: "grocer", icon: "🛒" },
];

const toneFor = (name: string) => {
    let sum = 0;
    for (const ch of name) sum += ch.charCodeAt(0);
    return TONES[sum % TONES.length];
};

const iconFor = (name: string) => {
    const lower = name.toLowerCase();
    return ICONS.find((i) => lower.includes(i.match))?.icon ?? "🛍️";
};

const formatPrice = (value: number) =>
    `₹${Number(value).toLocaleString("en-IN")}`;

const focusRing =
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2";


// ================= PRODUCT CARD =================

type CardProps = {
    product: Product;
    view: ViewMode;
    wished: boolean;
    onToggleWish: (id: number) => void;
    onViewDetails: (id: number) => void;
};

function ProductCard({
                         product,
                         view,
                         wished,
                         onToggleWish,
                         onViewDetails,
                     }: CardProps) {
    const inStock = product.quantity > 0;
    const lowStock = inStock && product.quantity <= LOW_STOCK_LIMIT;
    const isList = view === "list";

    return (
        <article
            className={`group flex bg-white rounded-xl border border-stone-200 overflow-hidden transition-shadow hover:shadow-lg hover:shadow-stone-900/5 ${
                isList ? "flex-row" : "flex-col"
            }`}
        >
            {/* IMAGE AREA */}
            <div
                className={`relative shrink-0 bg-gradient-to-br ${toneFor(
                    product.categoryName
                )} ${isList ? "w-32 sm:w-52" : "aspect-[4/3]"}`}
            >
                <button
                    type="button"
                    onClick={() => onViewDetails(product.id)}
                    aria-label={`View ${product.name}`}
                    className={`absolute inset-0 flex items-center justify-center ${focusRing}`}
                >
                    <span
                        className={`transition-transform duration-300 group-hover:scale-105 ${
                            isList ? "text-5xl" : "text-6xl"
                        } ${inStock ? "" : "opacity-40 grayscale"}`}
                    >
                        {iconFor(product.categoryName)}
                    </span>
                </button>

                {!inStock && (
                    <span className="absolute left-3 top-3 rounded-md bg-stone-900 px-2 py-1 text-xs font-semibold text-white">
                        Sold out
                    </span>
                )}

                {lowStock && (
                    <span className="absolute left-3 top-3 rounded-md bg-amber-500 px-2 py-1 text-xs font-semibold text-white">
                        Only {product.quantity} left
                    </span>
                )}

                <button
                    type="button"
                    onClick={() => onToggleWish(product.id)}
                    aria-pressed={wished}
                    aria-label={
                        wished ? "Remove from wishlist" : "Add to wishlist"
                    }
                    className={`absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-lg shadow-sm transition hover:scale-105 ${
                        wished
                            ? "text-rose-500"
                            : "text-stone-400 hover:text-rose-500"
                    } ${focusRing}`}
                >
                    {wished ? "♥" : "♡"}
                </button>
            </div>

            {/* DETAILS */}
            <div className="flex min-w-0 flex-1 flex-col p-4 sm:p-5">
                <p className="text-xs font-medium text-teal-700">
                    {product.categoryName}
                </p>

                <h2 className="mt-1 text-base font-semibold leading-snug text-stone-900 line-clamp-2">
                    <button
                        type="button"
                        onClick={() => onViewDetails(product.id)}
                        className={`text-left hover:text-teal-700 ${focusRing} rounded`}
                    >
                        {product.name}
                    </button>
                </h2>

                <p
                    className={`mt-2 text-sm leading-relaxed text-stone-500 ${
                        isList ? "line-clamp-2 sm:line-clamp-3" : "line-clamp-2"
                    }`}
                >
                    {product.description}
                </p>

                <div className="mt-auto flex items-end justify-between gap-3 pt-4">
                    <div>
                        <p
                            className={`text-xl font-bold tracking-tight ${
                                inStock ? "text-stone-900" : "text-stone-400"
                            }`}
                        >
                            {formatPrice(product.price)}
                        </p>
                        <p
                            className={`mt-0.5 text-xs font-medium ${
                                inStock ? "text-emerald-700" : "text-stone-400"
                            }`}
                        >
                            {inStock ? "In stock" : "Currently unavailable"}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => onViewDetails(product.id)}
                        className={`rounded-lg bg-stone-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-700 active:bg-teal-800 ${focusRing}`}
                    >
                        View details
                    </button>
                </div>
            </div>
        </article>
    );
}


// ================= PAGE =================

function Products({ onViewDetails }: ProductsProps) {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [usingSamples, setUsingSamples] = useState(false);

    const [search, setSearch] = useState("");
    const [sort, setSort] = useState("default");
    const [priceRange, setPriceRange] = useState("all");
    const [inStockOnly, setInStockOnly] = useState(false);
    const [selectedCategory, setSelectedCategory] =
        useState<number | null>(null);

    const [view, setView] = useState<ViewMode>("grid");
    const [showFilters, setShowFilters] = useState(false);
    const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
    const [wishlist, setWishlist] = useState<number[]>([]);


    // ================= LOAD ALL PRODUCTS =================

    const loadAllProducts = async () => {
        try {
            setLoading(true);
            setError("");
            setSelectedCategory(null);

            const data = await getProducts();

            if (data.length === 0) {
                setProducts(SAMPLE_PRODUCTS);
                setUsingSamples(true);
            } else {
                setProducts(data);
                setUsingSamples(false);
            }
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Failed to load products"
            );
        } finally {
            setLoading(false);
        }
    };


    // ================= LOAD BY CATEGORY =================

    const loadProductsByCategory = async (categoryId: number) => {
        setSelectedCategory(categoryId);

        if (usingSamples) {
            const name = SAMPLE_CATEGORIES.find(
                (c) => c.id === categoryId
            )?.name;
            setProducts(
                SAMPLE_PRODUCTS.filter((p) => p.categoryName === name)
            );
            return;
        }

        try {
            setLoading(true);
            setError("");

            const data = await getProductsByCategory(categoryId);
            setProducts(data);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Failed to load category products"
            );
        } finally {
            setLoading(false);
        }
    };


    // ================= LOAD CATEGORIES =================

    const loadCategories = async () => {
        try {
            const data = await getCategories();
            setCategories(data);
        } catch {
            // Category list is optional; the product grid still works without it
            setCategories([]);
        }
    };


    useEffect(() => {
        loadAllProducts();
        loadCategories();
    }, []);

    const categoryList =
        categories.length > 0
            ? categories
            : usingSamples
                ? SAMPLE_CATEGORIES
                : [];


    // ================= FILTER + SORT =================

    const filteredProducts = useMemo(() => {
        const text = search.toLowerCase().trim();
        const range =
            PRICE_RANGES.find((r) => r.id === priceRange) ?? PRICE_RANGES[0];

        return products
            .filter((p) => {
                const matchesText =
                    text === "" ||
                    p.name.toLowerCase().includes(text) ||
                    p.description.toLowerCase().includes(text) ||
                    p.categoryName.toLowerCase().includes(text);

                const matchesPrice = p.price >= range.min && p.price < range.max;
                const matchesStock = !inStockOnly || p.quantity > 0;

                return matchesText && matchesPrice && matchesStock;
            })
            .sort((a, b) => {
                if (sort === "low") return a.price - b.price;
                if (sort === "high") return b.price - a.price;
                if (sort === "name") return a.name.localeCompare(b.name);
                return 0;
            });
    }, [products, search, sort, priceRange, inStockOnly]);

    useEffect(() => {
        setVisibleCount(PAGE_SIZE);
    }, [search, sort, priceRange, inStockOnly, selectedCategory]);

    const visibleProducts = filteredProducts.slice(0, visibleCount);
    const remaining = filteredProducts.length - visibleProducts.length;

    const activeFilterCount =
        (search.trim() ? 1 : 0) +
        (priceRange !== "all" ? 1 : 0) +
        (inStockOnly ? 1 : 0) +
        (selectedCategory !== null ? 1 : 0);

    const clearFilters = () => {
        setSearch("");
        setPriceRange("all");
        setInStockOnly(false);
        setSort("default");
        loadAllProducts();
    };

    const toggleWish = (id: number) =>
        setWishlist((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );

    const activeCategoryName =
        categoryList.find((c) => c.id === selectedCategory)?.name;


    // ================= UI =================

    return (
        <div className="min-h-screen bg-stone-50 text-stone-900">

            {/* ================= HEADER ================= */}

            <header className="border-b border-stone-200 bg-white">
                <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
                    <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                        {activeCategoryName ?? "All products"}
                    </h1>
                    <p className="mt-2 max-w-xl text-stone-500">
                        Browse the full range, filter by price and availability,
                        and open any product for details.
                    </p>
                </div>
            </header>

            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">

                {usingSamples && (
                    <div
                        role="status"
                        className="mb-5 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800"
                    >
                        Your store has no products yet, so sample products are
                        shown. Add products in the admin panel to replace them.
                    </div>
                )}

                {/* ================= TOOLBAR ================= */}

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">

                    <div className="relative flex-1">
                        <label htmlFor="product-search" className="sr-only">
                            Search products
                        </label>
                        <span
                            aria-hidden="true"
                            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-stone-400"
                        >
                            🔍
                        </span>
                        <input
                            id="product-search"
                            type="search"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by name, description or category"
                            className="h-11 w-full rounded-lg border border-stone-300 bg-white pl-11 pr-4 text-sm outline-none transition placeholder:text-stone-400 focus:border-teal-600 focus:ring-4 focus:ring-teal-100"
                        />
                    </div>

                    <div className="flex items-center gap-3">

                        <button
                            type="button"
                            onClick={() => setShowFilters((s) => !s)}
                            aria-expanded={showFilters}
                            className={`h-11 rounded-lg border border-stone-300 bg-white px-4 text-sm font-medium hover:bg-stone-100 lg:hidden ${focusRing}`}
                        >
                            Filters{activeFilterCount > 0 && ` (${activeFilterCount})`}
                        </button>

                        <label htmlFor="product-sort" className="sr-only">
                            Sort products
                        </label>
                        <select
                            id="product-sort"
                            value={sort}
                            onChange={(e) => setSort(e.target.value)}
                            className="h-11 flex-1 cursor-pointer rounded-lg border border-stone-300 bg-white px-3 text-sm font-medium outline-none focus:border-teal-600 focus:ring-4 focus:ring-teal-100 sm:flex-none"
                        >
                            {SORT_OPTIONS.map((o) => (
                                <option key={o.value} value={o.value}>
                                    {o.label}
                                </option>
                            ))}
                        </select>

                        <div
                            role="group"
                            aria-label="Layout"
                            className="hidden h-11 overflow-hidden rounded-lg border border-stone-300 bg-white sm:flex"
                        >
                            {(["grid", "list"] as ViewMode[]).map((mode) => (
                                <button
                                    key={mode}
                                    type="button"
                                    onClick={() => setView(mode)}
                                    aria-pressed={view === mode}
                                    className={`px-4 text-sm font-medium transition ${
                                        view === mode
                                            ? "bg-stone-900 text-white"
                                            : "text-stone-600 hover:bg-stone-100"
                                    } ${focusRing}`}
                                >
                                    {mode === "grid" ? "Grid" : "List"}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>


                <div className="mt-6 flex flex-col gap-8 lg:flex-row">

                    {/* ================= SIDEBAR FILTERS ================= */}

                    <aside
                        className={`${showFilters ? "block" : "hidden"} lg:block lg:w-64 lg:shrink-0`}
                    >
                        <div className="space-y-6 rounded-xl border border-stone-200 bg-white p-5">

                            <section>
                                <h2 className="text-sm font-semibold">Category</h2>
                                <ul className="mt-3 space-y-1">
                                    <li>
                                        <button
                                            type="button"
                                            onClick={loadAllProducts}
                                            aria-pressed={selectedCategory === null}
                                            className={`w-full rounded-md px-3 py-2 text-left text-sm transition ${
                                                selectedCategory === null
                                                    ? "bg-teal-50 font-semibold text-teal-800"
                                                    : "text-stone-600 hover:bg-stone-100"
                                            } ${focusRing}`}
                                        >
                                            All categories
                                        </button>
                                    </li>
                                    {categoryList.map((category) => (
                                        <li key={category.id}>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    loadProductsByCategory(category.id)
                                                }
                                                aria-pressed={selectedCategory === category.id}
                                                className={`w-full rounded-md px-3 py-2 text-left text-sm transition ${
                                                    selectedCategory === category.id
                                                        ? "bg-teal-50 font-semibold text-teal-800"
                                                        : "text-stone-600 hover:bg-stone-100"
                                                } ${focusRing}`}
                                            >
                                                {category.name}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </section>

                            <section>
                                <h2 className="text-sm font-semibold">Price</h2>
                                <div className="mt-3 space-y-2">
                                    {PRICE_RANGES.map((range) => (
                                        <label
                                            key={range.id}
                                            className="flex cursor-pointer items-center gap-2.5 text-sm text-stone-600"
                                        >
                                            <input
                                                type="radio"
                                                name="price-range"
                                                checked={priceRange === range.id}
                                                onChange={() => setPriceRange(range.id)}
                                                className="h-4 w-4 accent-teal-700"
                                            />
                                            {range.label}
                                        </label>
                                    ))}
                                </div>
                            </section>

                            <section>
                                <h2 className="text-sm font-semibold">Availability</h2>
                                <label className="mt-3 flex cursor-pointer items-center gap-2.5 text-sm text-stone-600">
                                    <input
                                        type="checkbox"
                                        checked={inStockOnly}
                                        onChange={(e) => setInStockOnly(e.target.checked)}
                                        className="h-4 w-4 accent-teal-700"
                                    />
                                    In stock only
                                </label>
                            </section>

                            {activeFilterCount > 0 && (
                                <button
                                    type="button"
                                    onClick={clearFilters}
                                    className={`w-full rounded-lg border border-stone-300 py-2.5 text-sm font-medium hover:bg-stone-100 ${focusRing}`}
                                >
                                    Clear all filters
                                </button>
                            )}
                        </div>
                    </aside>


                    {/* ================= RESULTS ================= */}

                    <main className="min-w-0 flex-1">

                        {!loading && !error && (
                            <p className="mb-4 text-sm text-stone-500" aria-live="polite">
                                Showing{" "}
                                <span className="font-semibold text-stone-900">
                                    {visibleProducts.length}
                                </span>{" "}
                                of{" "}
                                <span className="font-semibold text-stone-900">
                                    {filteredProducts.length}
                                </span>{" "}
                                {filteredProducts.length === 1 ? "product" : "products"}
                            </p>
                        )}

                        {/* LOADING */}

                        {loading && (
                            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                                {[1, 2, 3, 4, 5, 6].map((n) => (
                                    <div
                                        key={n}
                                        className="animate-pulse overflow-hidden rounded-xl border border-stone-200 bg-white"
                                    >
                                        <div className="aspect-[4/3] bg-stone-200" />
                                        <div className="space-y-3 p-5">
                                            <div className="h-3 w-1/4 rounded bg-stone-200" />
                                            <div className="h-4 w-3/4 rounded bg-stone-200" />
                                            <div className="h-3 w-full rounded bg-stone-200" />
                                            <div className="flex items-center justify-between pt-3">
                                                <div className="h-6 w-20 rounded bg-stone-200" />
                                                <div className="h-10 w-28 rounded-lg bg-stone-200" />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* ERROR */}

                        {!loading && error && (
                            <div
                                role="alert"
                                className="rounded-xl border border-red-200 bg-red-50 px-6 py-8 text-center"
                            >
                                <p className="font-semibold text-red-700">
                                    We couldn't load the products
                                </p>
                                <p className="mt-1 text-sm text-red-600">{error}</p>
                                <button
                                    type="button"
                                    onClick={loadAllProducts}
                                    className={`mt-5 rounded-lg bg-red-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-700 ${focusRing}`}
                                >
                                    Try again
                                </button>
                            </div>
                        )}

                        {/* EMPTY */}

                        {!loading && !error && filteredProducts.length === 0 && (
                            <div className="rounded-xl border border-dashed border-stone-300 bg-white px-6 py-16 text-center">
                                <div className="text-5xl" aria-hidden="true">
                                    🔍
                                </div>
                                <h2 className="mt-4 text-lg font-semibold">
                                    No products match your filters
                                </h2>
                                <p className="mt-1 text-sm text-stone-500">
                                    Try a different search term, widen the price
                                    range, or clear your filters.
                                </p>
                                <button
                                    type="button"
                                    onClick={clearFilters}
                                    className={`mt-6 rounded-lg bg-stone-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-teal-700 ${focusRing}`}
                                >
                                    Clear filters
                                </button>
                            </div>
                        )}

                        {/* PRODUCTS */}

                        {!loading && !error && filteredProducts.length > 0 && (
                            <>
                                <div
                                    className={
                                        view === "grid"
                                            ? "grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3"
                                            : "flex flex-col gap-4"
                                    }
                                >
                                    {visibleProducts.map((product) => (
                                        <ProductCard
                                            key={product.id}
                                            product={product}
                                            view={view}
                                            wished={wishlist.includes(product.id)}
                                            onToggleWish={toggleWish}
                                            onViewDetails={onViewDetails}
                                        />
                                    ))}
                                </div>

                                {remaining > 0 && (
                                    <div className="mt-8 text-center">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setVisibleCount((c) => c + PAGE_SIZE)
                                            }
                                            className={`rounded-lg border border-stone-300 bg-white px-6 py-3 text-sm font-semibold hover:bg-stone-100 ${focusRing}`}
                                        >
                                            Show {Math.min(PAGE_SIZE, remaining)} more
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
}

export default Products;