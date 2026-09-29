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

const Orders = ({
                    onContinueShopping,
                }: OrdersProps) => {

    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadOrders = async () => {

        try {

            setLoading(true);
            setError("");

            const data = await getOrders();

            setOrders(data);

        } catch (error) {

            console.error(
                "Failed to load orders:",
                error
            );

            setError(
                "Failed to load your orders."
            );

        } finally {

            setLoading(false);

        }
    };

    useEffect(() => {
        loadOrders();
    }, []);

    const formatDate = (date: string) => {

        return new Date(date).toLocaleString(
            "en-IN",
            {
                dateStyle: "medium",
                timeStyle: "short",
            }
        );
    };

    if (loading) {

        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-100">

                <div className="text-center">

                    <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"></div>

                    <p className="mt-4 text-gray-600">
                        Loading your orders...
                    </p>

                </div>

            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 px-4 py-8">

            <div className="mx-auto max-w-5xl">

                {/* Header */}

                <div className="mb-8">

                    <h1 className="text-3xl font-bold text-gray-900">
                        My Orders
                    </h1>

                    <p className="mt-2 text-gray-600">
                        View your previous orders and order details.
                    </p>

                </div>


                {/* Error */}

                {error && (

                    <div className="mb-6 rounded-lg bg-red-100 p-4 text-red-700">

                        {error}

                    </div>

                )}


                {/* No Orders */}

                {!error && orders.length === 0 && (

                    <div className="rounded-2xl bg-white p-10 text-center shadow">

                        <div className="mb-4 text-5xl">
                            📦
                        </div>

                        <h2 className="text-2xl font-semibold text-gray-900">
                            No orders yet
                        </h2>

                        <p className="mt-2 text-gray-500">
                            You haven't placed any orders yet.
                        </p>

                        <button
                            onClick={onContinueShopping}
                            className="mt-6 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
                        >
                            Start Shopping
                        </button>

                    </div>

                )}


                {/* Orders */}

                <div className="space-y-6">

                    {orders.map((order) => (

                        <div
                            key={order.id}
                            className="overflow-hidden rounded-2xl bg-white shadow"
                        >

                            {/* Order Header */}

                            <div className="flex flex-col gap-4 border-b p-5 sm:flex-row sm:items-center sm:justify-between">

                                <div>

                                    <p className="text-sm text-gray-500">
                                        Order ID
                                    </p>

                                    <h2 className="text-lg font-bold text-gray-900">
                                        #{order.id}
                                    </h2>

                                    <p className="mt-1 text-sm text-gray-500">
                                        {formatDate(order.orderDate)}
                                    </p>

                                </div>


                                <div className="flex items-center gap-4">

                                    <span className="rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-700">
                                        {order.status}
                                    </span>

                                    <div className="text-right">

                                        <p className="text-sm text-gray-500">
                                            Total
                                        </p>

                                        <p className="text-xl font-bold text-gray-900">
                                            ₹{Number(order.totalAmount).toLocaleString("en-IN")}
                                        </p>

                                    </div>

                                </div>

                            </div>


                            {/* Order Items */}

                            <div className="divide-y">

                                {order.items.map((item) => (

                                    <div
                                        key={item.id}
                                        className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between"
                                    >

                                        <div>

                                            <h3 className="font-semibold text-gray-900">
                                                {item.productName}
                                            </h3>

                                            <p className="mt-1 text-sm text-gray-500">
                                                Product ID: {item.productId}
                                            </p>

                                        </div>


                                        <div className="flex items-center justify-between gap-8 sm:justify-end">

                                            <p className="text-sm text-gray-600">
                                                Qty: {item.quantity}
                                            </p>

                                            <p className="font-semibold text-gray-900">
                                                ₹{Number(item.price).toLocaleString("en-IN")}
                                            </p>

                                        </div>

                                    </div>

                                ))}

                            </div>

                        </div>

                    ))}

                </div>


                {/* Continue Shopping */}

                {orders.length > 0 && (

                    <div className="mt-8 text-center">

                        <button
                            onClick={onContinueShopping}
                            className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
                        >
                            Continue Shopping
                        </button>

                    </div>

                )}

            </div>

        </div>
    );
};

export default Orders;