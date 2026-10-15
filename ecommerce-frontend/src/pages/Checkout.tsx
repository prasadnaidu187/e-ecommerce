
import { useState } from "react";
import {
    createPaymentOrder,
    verifyPayment,
} from "../services/api";

interface CheckoutProps {
    onOrderSuccess: (order: any) => void;
    onBack: () => void;
}

interface RazorpaySuccessResponse {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
}

interface RazorpayOptions {
    key: string;
    amount: number;
    currency: string;
    name: string;
    description: string;
    order_id: string;

    prefill: {
        email: string;
    };

    theme: {
        color: string;
    };

    config: {
        display: {
            blocks: {
                upi: {
                    name: string;
                    instruments: {
                        method: string;
                    }[];
                };
            };
            sequence: string[];
            preferences: {
                show_default_blocks: boolean;
            };
        };
    };

    handler: (
        response: RazorpaySuccessResponse
    ) => void | Promise<void>;

    modal: {
        ondismiss: () => void;
    };
}

interface RazorpayInstance {
    open: () => void;
}

declare global {
    interface Window {
        Razorpay?: new (
            options: RazorpayOptions
        ) => RazorpayInstance;
    }
}

const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
        if (window.Razorpay) {
            resolve(true);
            return;
        }

        const script = document.createElement("script");
        script.src =
            "https://checkout.razorpay.com/v1/checkout.js";

        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);

        document.body.appendChild(script);
    });
};

const Checkout = ({
                      onOrderSuccess,
                      onBack,
                  }: CheckoutProps) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const handlePlaceOrder = async () => {
        setLoading(true);
        setError("");
        setMessage("");

        try {
            const scriptLoaded = await loadRazorpayScript();

            if (!scriptLoaded || !window.Razorpay) {
                throw new Error(
                    "Unable to load Razorpay. Check your internet connection."
                );
            }

            // Create the local order and Razorpay order.
            const paymentOrder = await createPaymentOrder();

            const options: RazorpayOptions = {
                key: paymentOrder.keyId,
                amount: paymentOrder.amount,
                currency: paymentOrder.currency,
                name: paymentOrder.name,
                description: paymentOrder.description,
                order_id: paymentOrder.razorpayOrderId,

                prefill: {
                    email: paymentOrder.email,
                },

                theme: {
                    color: "#2563eb",
                },

                // Highlight UPI and retain default methods.
                config: {
                    display: {
                        blocks: {
                            upi: {
                                name: "Pay using UPI",
                                instruments: [
                                    {
                                        method: "upi",
                                    },
                                ],
                            },
                        },
                        sequence: ["block.upi"],
                        preferences: {
                            show_default_blocks: true,
                        },
                    },
                },

                handler: async (paymentResponse) => {
                    try {
                        setLoading(true);
                        setError("");
                        setMessage("Verifying payment...");

                        // Verify the payment on your backend.
                        const confirmedOrder =
                            await verifyPayment({
                                localOrderId:
                                paymentOrder.localOrderId,
                                razorpay_order_id:
                                paymentResponse.razorpay_order_id,
                                razorpay_payment_id:
                                paymentResponse.razorpay_payment_id,
                                razorpay_signature:
                                paymentResponse.razorpay_signature,
                            });

                        setMessage("Payment successful!");
                        onOrderSuccess(confirmedOrder);
                    } catch (verificationError) {
                        console.error(verificationError);

                        setMessage("");
                        setError(
                            verificationError instanceof Error
                                ? verificationError.message
                                : "Payment verification failed. Contact support before retrying."
                        );
                    } finally {
                        setLoading(false);
                    }
                },

                modal: {
                    ondismiss: () => {
                        setLoading(false);
                        setMessage("");
                    },
                },
            };

            const razorpay = new window.Razorpay(options);
            razorpay.open();
        } catch (paymentError) {
            console.error(paymentError);

            setError(
                paymentError instanceof Error
                    ? paymentError.message
                    : "Unable to start payment. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 px-4 py-8">
            <div className="mx-auto max-w-3xl">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">
                        Checkout
                    </h1>

                    <p className="mt-2 text-gray-600">
                        Review your order and complete your test payment.
                    </p>
                </div>

                <div className="mb-8 flex items-center justify-center gap-3 text-sm">
                    <div className="rounded-full bg-green-600 px-4 py-2 text-white">
                        Cart
                    </div>

                    <span className="text-gray-400">→</span>

                    <div className="rounded-full bg-green-600 px-4 py-2 text-white">
                        Address
                    </div>

                    <span className="text-gray-400">→</span>

                    <div className="rounded-full bg-blue-600 px-4 py-2 text-white">
                        Checkout
                    </div>
                </div>

                <div className="rounded-xl bg-white p-6 shadow">
                    <h2 className="mb-4 text-xl font-semibold text-gray-900">
                        Payment
                    </h2>

                    <div className="rounded-lg bg-gray-50 p-5">
                        <p className="font-medium text-gray-800">
                            Secure test payment with Razorpay
                        </p>

                        <p className="mt-2 text-sm text-gray-600">
                            Your order will be confirmed after the backend
                            verifies the payment.
                        </p>
                    </div>

                    {error && (
                        <div className="mt-5 rounded-lg bg-red-100 p-4 text-sm text-red-700">
                            {error}
                        </div>
                    )}

                    {message && (
                        <div className="mt-5 rounded-lg bg-blue-50 p-4 text-sm text-blue-700">
                            {message}
                        </div>
                    )}

                    <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-between">
                        <button
                            onClick={onBack}
                            disabled={loading}
                            className="rounded-lg border border-gray-300 px-6 py-3 font-medium text-gray-700 transition hover:bg-gray-100 disabled:opacity-50"
                        >
                            ← Back
                        </button>

                        <button
                            onClick={handlePlaceOrder}
                            disabled={loading}
                            className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {loading
                                ? "Processing..."
                                : "Pay with Razorpay"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
