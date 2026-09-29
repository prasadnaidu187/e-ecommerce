import { useEffect, useState } from "react";

import {
    getCart,
    removeFromCart,
    updateCartQuantity
} from "../services/api";


type CartItem = {
    cartId: number;
    productId: number;
    productName: string;
    price: number;
    quantity: number;
    totalPrice: number;
};


type CartProps = {
    onContinueShopping: () => void;
};


function Cart({
    onContinueShopping
}: CartProps) {

    const [cart, setCart] =
        useState<CartItem[]>([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    // ================= LOAD CART =================

    useEffect(() => {

        const loadCart = async () => {

            try {

                setLoading(true);
                setError("");

                const data =
                    await getCart();

                console.log(
                    "Cart products:",
                    data
                );

                setCart(data);

            } catch (error) {

                if (error instanceof Error) {

                    setError(
                        error.message
                    );

                } else {

                    setError(
                        "Failed to load cart"
                    );

                }

            } finally {

                setLoading(false);

            }
        };

        loadCart();

    }, []);


    // ================= UPDATE QUANTITY =================

    const handleQuantityChange = async (
        cartId: number,
        newQuantity: number
    ) => {

        // Don't allow quantity below 1
        if (newQuantity < 1) {
            return;
        }

        try {

            const updatedItem =
                await updateCartQuantity(
                    cartId,
                    newQuantity
                );

            console.log(
                "Updated cart item:",
                updatedItem
            );

            setCart((currentCart) =>
                currentCart.map((item) =>
                    item.cartId === cartId
                        ? {
                            ...item,
                            quantity:
                                updatedItem.quantity,
                            totalPrice:
                                updatedItem.totalPrice
                        }
                        : item
                )
            );

        } catch (error) {

            console.error(
                "Failed to update quantity:",
                error
            );

            alert(
                "Failed to update cart quantity"
            );

        }

    };


    // ================= REMOVE ITEM =================

    const handleRemove = async (
        cartId: number
    ) => {

        try {

            await removeFromCart(
                cartId
            );

            setCart((currentCart) =>
                currentCart.filter(
                    (item) =>
                        item.cartId !== cartId
                )
            );

        } catch (error) {

            console.error(
                "Failed to remove item:",
                error
            );

            alert(
                "Failed to remove item from cart"
            );

        }

    };


    // ================= TOTAL =================

    const cartTotal = cart.reduce(
        (total, item) =>
            total + item.totalPrice,
        0
    );


    const totalItems = cart.reduce(
        (total, item) =>
            total + item.quantity,
        0
    );


    // ================= LOADING =================

    if (loading) {

        return (

            <div className="min-h-screen bg-slate-50 px-4 py-10">

                <div className="max-w-7xl mx-auto">

                    <div className="animate-pulse">

                        <div className="h-10 bg-slate-200 rounded w-1/3 mb-8" />

                        <div className="grid lg:grid-cols-3 gap-6">

                            <div className="lg:col-span-2 space-y-4">

                                <div className="h-40 bg-slate-200 rounded-2xl" />

                                <div className="h-40 bg-slate-200 rounded-2xl" />

                            </div>

                            <div className="h-64 bg-slate-200 rounded-2xl" />

                        </div>

                    </div>

                </div>

            </div>

        );
    }


    // ================= ERROR =================

    if (error) {

        return (

            <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">

                <div className="bg-white rounded-2xl border border-red-100 shadow-sm p-10 text-center max-w-md">

                    <div className="text-5xl">
                        ⚠️
                    </div>

                    <h2 className="text-xl font-bold text-slate-900 mt-5">
                        Unable to load cart
                    </h2>

                    <p className="text-red-500 text-sm mt-3">
                        {error}
                    </p>

                    <button
                        onClick={onContinueShopping}
                        className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition"
                    >
                        Continue Shopping
                    </button>

                </div>

            </div>

        );
    }


    // ================= EMPTY CART =================

    if (cart.length === 0) {

        return (

            <div className="min-h-screen bg-slate-50 px-4 py-12">

                <div className="max-w-4xl mx-auto">

                    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-12 text-center">

                        <div className="text-7xl">
                            🛒
                        </div>

                        <h1 className="text-3xl font-extrabold text-slate-900 mt-6">
                            Your Cart is Empty
                        </h1>

                        <p className="text-slate-500 mt-3">
                            Looks like you haven't added
                            anything to your cart yet.
                        </p>

                        <button
                            onClick={onContinueShopping}
                            className="mt-7 px-8 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-200"
                        >
                            Continue Shopping
                        </button>

                    </div>

                </div>

            </div>

        );
    }


    // ================= CART =================

    return (

        <div className="min-h-screen bg-slate-50 text-slate-900">

            {/* ================= HEADER ================= */}

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">

                <div className="flex items-center justify-between">

                    <div>

                        <h1 className="text-3xl sm:text-4xl font-extrabold">
                            Shopping Cart
                        </h1>

                        <p className="text-slate-500 mt-2">
                            {totalItems} item
                            {totalItems !== 1
                                ? "s"
                                : ""}{" "}
                            in your cart
                        </p>

                    </div>

                </div>

            </div>


            {/* ================= CART CONTENT ================= */}

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                <div className="grid lg:grid-cols-3 gap-6">


                    {/* ================= PRODUCTS ================= */}

                    <div className="lg:col-span-2 space-y-4">

                        {cart.map((item) => (

                            <div
                                key={item.cartId}
                                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm"
                            >

                                <div className="flex gap-5">


                                    {/* PRODUCT IMAGE */}

                                    <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl bg-gradient-to-br from-blue-50 via-indigo-50 to-slate-100 flex items-center justify-center shrink-0">

                                        <span className="text-6xl">
                                            🛍️
                                        </span>

                                    </div>


                                    {/* PRODUCT INFO */}

                                    <div className="flex-1">

                                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">

                                            <div>

                                                <h2 className="text-xl font-bold text-slate-900">
                                                    {item.productName}
                                                </h2>

                                                <p className="text-sm text-slate-500 mt-2">
                                                    Product ID: {item.productId}
                                                </p>

                                            </div>


                                            <p className="text-xl font-extrabold text-blue-600">
                                                ₹{item.totalPrice}
                                            </p>

                                        </div>


                                        {/* PRICE */}

                                        <p className="text-sm text-slate-500 mt-4">
                                            ₹{item.price} ×{" "}
                                            {item.quantity}
                                        </p>


                                        {/* QUANTITY + REMOVE */}

                                        <div className="flex items-center justify-between mt-5">

                                            <div className="flex items-center gap-3">

                                                <span className="text-sm font-semibold">
                                                    Quantity:
                                                </span>


                                                {/* MINUS */}

                                                <button
                                                    onClick={() =>
                                                        handleQuantityChange(
                                                            item.cartId,
                                                            item.quantity - 1
                                                        )
                                                    }
                                                    disabled={
                                                        item.quantity <= 1
                                                    }
                                                    className="w-9 h-9 rounded-lg bg-slate-100 text-slate-700 font-bold text-lg hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed transition"
                                                >
                                                    −
                                                </button>


                                                {/* QUANTITY */}

                                                <div className="w-12 h-9 flex items-center justify-center bg-slate-100 rounded-lg font-bold">
                                                    {item.quantity}
                                                </div>


                                                {/* PLUS */}

                                                <button
                                                    onClick={() =>
                                                        handleQuantityChange(
                                                            item.cartId,
                                                            item.quantity + 1
                                                        )
                                                    }
                                                    className="w-9 h-9 rounded-lg bg-slate-100 text-slate-700 font-bold text-lg hover:bg-slate-200 transition"
                                                >
                                                    +
                                                </button>

                                            </div>


                                            {/* REMOVE */}

                                            <button
                                                onClick={() =>
                                                    handleRemove(
                                                        item.cartId
                                                    )
                                                }
                                                className="text-sm font-semibold text-red-500 hover:text-red-700 transition"
                                            >
                                                🗑️ Remove
                                            </button>

                                        </div>

                                    </div>

                                </div>

                            </div>

                        ))}

                    </div>


                    {/* ================= ORDER SUMMARY ================= */}

                    <div>

                        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm sticky top-32">

                            <h2 className="text-xl font-extrabold">
                                Order Summary
                            </h2>


                            <div className="border-t border-slate-200 my-5" />


                            <div className="flex justify-between text-sm">

                                <span className="text-slate-500">
                                    Items
                                </span>

                                <span className="font-semibold">
                                    {totalItems}
                                </span>

                            </div>


                            <div className="flex justify-between text-sm mt-4">

                                <span className="text-slate-500">
                                    Subtotal
                                </span>

                                <span className="font-semibold">
                                    ₹{cartTotal}
                                </span>

                            </div>


                            <div className="flex justify-between text-sm mt-4">

                                <span className="text-slate-500">
                                    Delivery
                                </span>

                                <span className="text-green-600 font-semibold">
                                    FREE
                                </span>

                            </div>


                            <div className="border-t border-slate-200 my-5" />


                            <div className="flex justify-between">

                                <span className="text-lg font-bold">
                                    Total
                                </span>

                                <span className="text-2xl font-extrabold text-blue-600">
                                    ₹{cartTotal}
                                </span>

                            </div>


                            <button
                                className="w-full mt-6 h-14 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-200"
                            >
                                Proceed to Checkout
                            </button>


                            <button
                                onClick={onContinueShopping}
                                className="w-full mt-3 h-12 border-2 border-slate-200 rounded-xl font-semibold text-slate-700 hover:bg-slate-50 transition"
                            >
                                Continue Shopping
                            </button>

                        </div>

                    </div>

                </div>

            </main>

        </div>

    );
}


export default Cart;

