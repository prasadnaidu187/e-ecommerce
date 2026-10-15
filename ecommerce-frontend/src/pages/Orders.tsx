import { useEffect, useState } from "react";
import { getOrders } from "../services/api";

interface OrderItem {
    id: number;
    productId: number;
    productName: string;
    quantity: number;
    price: number;
}

interface Order {
    id: number;
    totalAmount: number;
    status: string;
    orderDate: string;
    items: OrderItem[];
}

interface OrdersProps {
    onContinueShopping: () => void;
}

const Orders = ({ onContinueShopping }: OrdersProps) => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedFilter, setSelectedFilter] = useState("all");

    const loadOrders = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await getOrders();

            setOrders(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Failed to load orders:", err);
            setError("We couldn't load your orders. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadOrders();
    }, []);

    const formatDate = (date: string) => {
        if (!date) return "Date unavailable";

        const parsedDate = new Date(date);

        if (Number.isNaN(parsedDate.getTime())) {
            return date;
        }

        return parsedDate.toLocaleDateString("en-IN", {
            day: "numeric",
            month: "long",
            year: "numeric",
        });
    };

    const formatPrice = (price: number) =>
        Number(price || 0).toLocaleString("en-IN", {
            maximumFractionDigits: 2,
        });

    const getStatusStyle = (status: string) => {
        const normalized = status?.toLowerCase() || "";

        if (normalized.includes("deliver")) {
            return "bg-green-100 text-green-800";
        }

        if (
            normalized.includes("cancel") ||
            normalized.includes("fail")
        ) {
            return "bg-red-100 text-red-700";
        }

        if (
            normalized.includes("pending") ||
            normalized.includes("process") ||
            normalized.includes("created")
        ) {
            return "bg-amber-100 text-amber-800";
        }

        return "bg-blue-100 text-blue-800";
    };

    const filteredOrders = orders.filter((order) => {
        const search = searchTerm.toLowerCase().trim();

        const matchesSearch =
            String(order.id).includes(search) ||
            order.items?.some((item) =>
                item.productName?.toLowerCase().includes(search)
            );

        const status = order.status?.toLowerCase() || "";

        const matchesFilter =
            selectedFilter === "all" ||
            (selectedFilter === "delivered" &&
                status.includes("deliver")) ||
            (selectedFilter === "cancelled" &&
                status.includes("cancel")) ||
            (selectedFilter === "pending" &&
                !status.includes("deliver") &&
                !status.includes("cancel"));

        return matchesSearch && matchesFilter;
    });

    if (loading) {
        return (
            <div className="flex min-h-[70vh] items-center justify-center bg-[#eaeded]">
                <div className="text-center">
                    <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-[#f3a847]" />
                    <p className="mt-4 text-sm text-gray-600">
                        Loading your orders...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#eaeded] text-[#0f1111]">

            {/* Orders navigation */}
            <div className="bg-[#232f3e] text-white">
                <div className="mx-auto flex max-w-7xl items-center gap-5 overflow-x-auto px-4 py-3 text-sm sm:px-6">
                    <button
                        onClick={onContinueShopping}
                        className="shrink-0 font-bold hover:text-[#febd69]"
                    >
                        ☰ All
                    </button>

                    <button
                        onClick={onContinueShopping}
                        className="shrink-0 hover:text-[#febd69]"
                    >
                        Today's Deals
                    </button>

                    <button
                        onClick={onContinueShopping}
                        className="shrink-0 hover:text-[#febd69]"
                    >
                        Electronics
                    </button>

                    <button
                        onClick={onContinueShopping}
                        className="shrink-0 hover:text-[#febd69]"
                    >
                        Mobiles
                    </button>

                    <button
                        onClick={onContinueShopping}
                        className="shrink-0 hover:text-[#febd69]"
                    >
                        Home & Kitchen
                    </button>

                    <button
                        onClick={onContinueShopping}
                        className="shrink-0 hover:text-[#febd69]"
                    >
                        Fashion
                    </button>
                </div>
            </div>

            <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:py-8">

                {/* Breadcrumb */}
                <div className="mb-4 text-xs text-gray-500">
                    <button
                        onClick={onContinueShopping}
                        className="hover:text-[#c45500] hover:underline"
                    >
                        Home
                    </button>
                    <span className="mx-2">&gt;</span>
                    <span className="text-gray-700">Your Orders</span>
                </div>

                {/* Page heading */}
                <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                    <div>
                        <h1 className="text-2xl font-normal tracking-tight sm:text-3xl">
                            Your Orders
                        </h1>

                        <p className="mt-2 text-sm text-gray-600">
                            Track, return, or buy items again.
                        </p>
                    </div>

                    <button
                        onClick={onContinueShopping}
                        className="rounded-full border border-gray-400 bg-white px-5 py-2 text-sm font-medium shadow-sm transition hover:bg-gray-50"
                    >
                        Continue Shopping
                    </button>
                </div>

                {/* Search orders */}
                <div className="mb-6 flex flex-col gap-3 sm:flex-row">
                    <div className="flex flex-1 overflow-hidden rounded-lg border border-gray-400 bg-white shadow-sm focus-within:border-[#e77600] focus-within:ring-2 focus-within:ring-[#f3a847]">
                        <span className="flex items-center pl-4 text-gray-400">
                            <svg
                                className="h-5 w-5"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                            >
                                <circle cx="11" cy="11" r="7" />
                                <path d="m20 20-4-4" />
                            </svg>
                        </span>

                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) =>
                                setSearchTerm(e.target.value)
                            }
                            placeholder="Search all orders by product name or order ID"
                            className="w-full border-0 bg-transparent px-3 py-3 text-sm outline-none focus:ring-0"
                        />

                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm("")}
                                className="px-3 text-sm text-gray-500 hover:text-black"
                                aria-label="Clear search"
                            >
                                ✕
                            </button>
                        )}
                    </div>

                    <button
                        onClick={() => {
                            setSearchTerm("");
                            setSelectedFilter("all");
                        }}
                        className="rounded-lg bg-[#febd69] px-6 py-3 text-sm font-semibold shadow-sm transition hover:bg-[#f3a847]"
                    >
                        Reset Filters
                    </button>
                </div>

                {/* Order filter tabs */}
                <div className="mb-6 overflow-x-auto rounded-xl border border-gray-300 bg-white shadow-sm">
                    <div className="flex min-w-max border-b border-gray-200">
                        {[
                            { label: "All Orders", value: "all" },
                            { label: "Delivered", value: "delivered" },
                            { label: "In Progress", value: "pending" },
                            { label: "Cancelled", value: "cancelled" },
                        ].map((filter) => (
                            <button
                                key={filter.value}
                                onClick={() =>
                                    setSelectedFilter(filter.value)
                                }
                                className={`border-b-4 px-5 py-4 text-sm font-medium transition sm:px-7 ${
    selectedFilter === filter.value
        ? "border-[#e77600] font-bold text-[#c45500]"
        : "border-transparent text-gray-600 hover:text-[#c45500]"
}`}
                            >
                                {filter.label}
                            </button>
                        ))}
                    </div>

                    <div className="px-5 py-3 text-sm text-gray-600">
                        {filteredOrders.length}{" "}
                        {filteredOrders.length === 1 ? "order" : "orders"} found
                    </div>
                </div>

                {/* Error state */}
                {error && (
                    <div className="mb-6 rounded-xl border border-red-200 bg-white p-6">
                        <p className="font-semibold text-red-700">
                            Something went wrong
                        </p>

                        <p className="mt-2 text-sm text-gray-600">
                            {error}
                        </p>

                        <button
                            onClick={loadOrders}
                            className="mt-4 rounded-full bg-[#febd69] px-5 py-2 text-sm font-semibold hover:bg-[#f3a847]"
                        >
                            Try Again
                        </button>
                    </div>
                )}

                {/* Empty state */}
                {!error && filteredOrders.length === 0 && (
                    <div className="rounded-xl border border-gray-300 bg-white px-5 py-16 text-center shadow-sm">
                        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#f7f8f8]">
                            <svg
                                className="h-10 w-10 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M3 3h2l2.2 11.2a2 2 0 0 0 2 1.6h7.9a2 2 0 0 0 2-1.6L21 8H6"
                                />
                                <circle cx="10" cy="20" r="1" />
                                <circle cx="18" cy="20" r="1" />
                            </svg>
                        </div>

                        <h2 className="mt-5 text-xl font-semibold">
                            {orders.length === 0
                                ? "You haven't placed any orders yet"
                                : "No matching orders found"}
                        </h2>

                        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
                            {orders.length === 0
                                ? "Discover your favorite products and find something you love."
                                : "Try a different search term or select another order filter."}
                        </p>

                        <button
                            onClick={
                                orders.length === 0
                                    ? onContinueShopping
                                    : () => {
                                          setSearchTerm("");
                                          setSelectedFilter("all");
                                      }
                            }
                            className="mt-6 rounded-full border border-[#fcd200] bg-[#ffd814] px-7 py-3 text-sm font-semibold shadow-sm transition hover:bg-[#f7ca00]"
                        >
                            {orders.length === 0
                                ? "Start Shopping"
                                : "Show All Orders"}
                        </button>
                    </div>
                )}

                {/* Order cards */}
                {!error && filteredOrders.length > 0 && (
                    <div className="space-y-6">
                        {filteredOrders.map((order) => (
                            <article
                                key={order.id}
                                className="overflow-hidden rounded-xl border border-gray-300 bg-white shadow-sm transition hover:shadow-md"
                            >
                                {/* Order metadata */}
                                <div className="grid grid-cols-2 gap-x-5 gap-y-4 border-b border-gray-200 bg-[#f0f2f2] px-4 py-4 sm:grid-cols-4 sm:px-6">
                                    <div>
                                        <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-600">
                                            Order placed
                                        </p>
                                        <p className="mt-1 text-sm text-gray-800">
                                            {formatDate(order.orderDate)}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-600">
                                            Total
                                        </p>
                                        <p className="mt-1 text-sm font-semibold text-gray-900">
                                            ₹{formatPrice(order.totalAmount)}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-600">
                                            Order number
                                        </p>
                                        <p className="mt-1 break-all text-sm text-gray-800">
                                            #{order.id}
                                        </p>
                                    </div>

                                    <div className="sm:text-right">
                                        <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-600">
                                            Order details
                                        </p>
                                        <p className="mt-1 text-sm text-gray-700">
                                            {order.items?.length || 0}{" "}
                                            {(order.items?.length || 0) === 1
                                                ? "item"
                                                : "items"}
                                        </p>
                                    </div>
                                </div>

                                {/* Order content */}
                                <div className="p-4 sm:p-6">
                                    <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                        <div>
                                            <h2 className="text-xl font-bold text-[#007600]">
                                                {order.status || "Order placed"}
                                            </h2>

                                            <p className="mt-1 text-sm text-gray-600">
                                                Order #{order.id}
                                            </p>
                                        </div>

                                        <span
                                            className={`w-fit rounded-full px-3 py-1.5 text-xs font-semibold ${getStatusStyle(
    order.status
)}`}
                                        >
                                            {order.status || "Processing"}
                                        </span>
                                    </div>

                                    {/* Products */}
                                    <div className="space-y-5">
                                        {(order.items || []).map((item) => (
                                            <div
                                                key={item.id}
                                                className="flex flex-col gap-4 border-t border-gray-100 pt-5 sm:flex-row sm:items-center"
                                            >
                                                {/* Product illustration */}
                                                <div className="flex h-28 w-28 shrink-0 items-center justify-center self-start rounded-lg bg-[#f7f8f8]">
                                                    <svg
                                                        className="h-12 w-12 text-gray-400"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="1.4"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <rect
                                                            x="7"
                                                            y="2"
                                                            width="10"
                                                            height="20"
                                                            rx="2"
                                                        />
                                                        <path d="M10 5h4M11 19h2" />
                                                    </svg>
                                                </div>

                                                <div className="min-w-0 flex-1">
                                                    <h3 className="text-base font-semibold leading-6 text-[#007185] hover:text-[#c45500] hover:underline">
                                                        {item.productName}
                                                    </h3>

                                                    <p className="mt-2 text-sm text-gray-600">
                                                        Product ID: {item.productId}
                                                    </p>

                                                    <p className="mt-1 text-sm text-gray-600">
                                                        Quantity: {item.quantity}
                                                    </p>

                                                    <p className="mt-2 text-lg font-bold text-gray-900">
                                                        ₹{formatPrice(item.price)}
                                                    </p>

                                                    <button
                                                        onClick={onContinueShopping}
                                                        className="mt-3 rounded-full border border-[#fcd200] bg-[#ffd814] px-5 py-2 text-sm font-medium shadow-sm transition hover:bg-[#f7ca00]"
                                                    >
                                                        Continue Shopping
                                                    </button>
                                                </div>

                                                <div className="flex shrink-0 flex-col gap-2 sm:w-48">
                                                    <button
                                                        onClick={onContinueShopping}
                                                        className="rounded-full border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium shadow-sm transition hover:bg-gray-50"
                                                    >
                                                        Shop Similar Items
                                                    </button>

                                                    <button
                                                        onClick={onContinueShopping}
                                                        className="rounded-full border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium shadow-sm transition hover:bg-gray-50"
                                                    >
                                                        Explore Products
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                )}

                {/* Footer */}
                <div className="mt-10 border-t border-gray-300 py-6 text-center">
                    <button
                        onClick={onContinueShopping}
                        className="text-sm font-semibold text-[#007185] hover:text-[#c45500] hover:underline"
                    >
                        Back to shopping
                    </button>

                    <p className="mt-2 text-xs text-gray-500">
                        Thank you for shopping with us.
                    </p>
                </div>
            </main>
        </div>
    );
};

export default Orders;