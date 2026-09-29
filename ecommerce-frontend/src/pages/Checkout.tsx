import { useState } from "react";
import { createOrder } from "../services/api";

interface CheckoutProps {
    onOrderSuccess: (order: any) => void;
    onBack: () => void;
}

const Checkout = ({
                      onOrderSuccess,
                      onBack,
                  }: CheckoutProps) => {

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handlePlaceOrder = async () => {

        setLoading(true);
        setError("");

        try {

            const order = await createOrder();

            onOrderSuccess(order);

        } catch (error) {

            console.error(error);

            setError(
                "Failed to place order. Please try again."
            );

        } finally {

            setLoading(false);

        }
    };

    return (
        <div className="min-h-screen bg-gray-100 px-4 py-8">

            <div className="mx-auto max-w-3xl">

                {/* Header */}
                <div className="mb-8">

                    <h1 className="text-3xl font-bold text-gray-900">
                        Checkout
                    </h1>

                    <p className="mt-2 text-gray-600">
                        Review your order and place it.
                    </p>

                </div>

                {/* Checkout Steps */}
                <div className="mb-8 flex items-center justify-center gap-3 text-sm">

                    <div className="rounded-full bg-green-600 px-4 py-2 text-white">
                        Cart
                    </div>

                    <span className="text-gray-400">
                        →
                    </span>

                    <div className="rounded-full bg-green-600 px-4 py-2 text-white">
                        Address
                    </div>

                    <span className="text-gray-400">
                        →
                    </span>

                    <div className="rounded-full bg-blue-600 px-4 py-2 text-white">
                        Checkout
                    </div>

                </div>

                {/* Order Summary */}
                <div className="rounded-xl bg-white p-6 shadow">

                    <h2 className="mb-4 text-xl font-semibold text-gray-900">
                        Order Summary
                    </h2>

                    <div className="rounded-lg bg-gray-50 p-5">

                        <p className="text-gray-700">
                            Your cart items will be converted into an order.
                        </p>

                        <p className="mt-2 text-sm text-gray-500">
                            Your selected products, quantities and current
                            prices will be saved with the order.
                        </p>

                    </div>

                    {/* Error */}
                    {error && (
                        <div className="mt-5 rounded-lg bg-red-100 p-4 text-sm text-red-700">
                            {error}
                        </div>
                    )}

                    {/* Buttons */}
                    <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-between">

                        <button
                            onClick={onBack}
                            disabled={loading}
                            className="rounded-lg border border-gray-300 px-6 py-3 font-medium text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            ← Back
                        </button>

                        <button
                            onClick={handlePlaceOrder}
                            disabled={loading}
                            className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {loading
                                ? "Placing Order..."
                                : "Place Order"}
                        </button>

                    </div>

                </div>

            </div>

        </div>
    );
};

export default Checkout;