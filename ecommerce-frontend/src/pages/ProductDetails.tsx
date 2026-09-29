import { useEffect, useState } from "react";

import {
    getProductById,
    addToCart
} from "../services/api";

import type { Product } from "../types/Product";


type ProductDetailsProps = {
    productId: number;

    // Called when product is successfully added to cart
    onCartUpdated: (quantity: number) => void;
};


function ProductDetails({
                            productId,
                            onCartUpdated
                        }: ProductDetailsProps) {

    const [product, setProduct] =
        useState<Product | null>(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [quantity, setQuantity] =
        useState(1);

    const [cartMessage, setCartMessage] =
        useState("");

    const [cartLoading, setCartLoading] =
        useState(false);


    // ================= LOAD PRODUCT =================

    useEffect(() => {

        const loadProduct = async () => {

            try {

                setLoading(true);
                setError("");

                const data =
                    await getProductById(productId);

                console.log(
                    "Product details:",
                    data
                );

                setProduct(data);

            } catch (error) {

                if (error instanceof Error) {

                    setError(
                        error.message
                    );

                } else {

                    setError(
                        "Failed to load product"
                    );

                }

            } finally {

                setLoading(false);

            }
        };

        loadProduct();

    }, [productId]);


    // ================= LOADING =================

    if (loading) {

        return (

            <div className="min-h-screen bg-slate-50 px-4 py-10">

                <div className="max-w-7xl mx-auto">

                    <div className="grid lg:grid-cols-2 gap-10 animate-pulse">

                        <div className="h-[500px] bg-slate-200 rounded-3xl" />

                        <div className="space-y-5">

                            <div className="h-5 bg-slate-200 rounded w-1/4" />

                            <div className="h-12 bg-slate-200 rounded w-3/4" />

                            <div className="h-6 bg-slate-200 rounded w-1/2" />

                            <div className="h-12 bg-slate-200 rounded w-1/3" />

                            <div className="h-24 bg-slate-200 rounded" />

                            <div className="h-14 bg-slate-200 rounded" />

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
                        Unable to load product
                    </h2>

                    <p className="text-red-500 text-sm mt-3">
                        {error}
                    </p>

                </div>

            </div>

        );
    }


    // ================= NOT FOUND =================

    if (!product) {

        return (

            <div className="min-h-screen bg-slate-50 flex items-center justify-center">

                <div className="text-center">

                    <div className="text-6xl">
                        🔍
                    </div>

                    <h2 className="text-xl font-bold text-slate-900 mt-5">
                        Product not found
                    </h2>

                </div>

            </div>

        );
    }


    // ================= QUANTITY =================

    const increaseQuantity = () => {

        if (quantity < product.quantity) {

            setQuantity(
                quantity + 1
            );

        }

    };


    const decreaseQuantity = () => {

        if (quantity > 1) {

            setQuantity(
                quantity - 1
            );

        }

    };


    // ================= ADD TO CART =================

    const handleAddToCart = async () => {

        try {

            setCartLoading(true);

            setCartMessage("");


            // Send product + quantity to backend

            const data =
                await addToCart(
                    product.id,
                    quantity
                );


            console.log(
                "Added to cart:",
                data
            );


            // Update Navbar cart count

            onCartUpdated(
                quantity
            );


            // Show success message

            setCartMessage(
                "Product added to cart successfully!"
            );


        } catch (error) {

            if (error instanceof Error) {

                setCartMessage(
                    error.message
                );

            } else {

                setCartMessage(
                    "Failed to add product to cart"
                );

            }

        } finally {

            setCartLoading(false);

        }

    };


    return (

        <div className="min-h-screen bg-slate-50 text-slate-900">


            {/* ================= BREADCRUMB ================= */}

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-7">

                <div className="text-sm text-slate-500">

                    Home

                    <span className="mx-2">
                        /
                    </span>

                    Products

                    <span className="mx-2">
                        /
                    </span>

                    <span className="text-slate-900 font-medium">
                        {product.name}
                    </span>

                </div>

            </div>


            {/* ================= MAIN PRODUCT ================= */}

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                <div className="grid lg:grid-cols-2 gap-8 lg:gap-14">


                    {/* ================= LEFT IMAGE ================= */}

                    <div>

                        <div className="relative h-[420px] sm:h-[540px] rounded-3xl overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-slate-100 flex items-center justify-center">

                            <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-blue-200/50" />

                            <div className="absolute -bottom-32 -left-24 w-96 h-96 rounded-full bg-indigo-200/40" />


                            <div className="relative z-10 text-[150px] sm:text-[190px] drop-shadow-2xl">
                                🛍️
                            </div>


                            {/* Wishlist */}

                            <button
                                className="absolute top-5 right-5 w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center text-xl text-slate-500 hover:text-red-500 hover:scale-105 transition"
                            >
                                ♡
                            </button>


                            {/* Category */}

                            <div className="absolute top-5 left-5">

                                <span className="px-4 py-2 rounded-full bg-white/90 backdrop-blur text-xs font-bold uppercase tracking-wider text-blue-600 shadow-sm">

                                    {product.categoryName}

                                </span>

                            </div>

                        </div>


                        {/* ================= THUMBNAILS ================= */}

                        <div className="flex gap-3 mt-4">

                            <button
                                className="w-20 h-20 rounded-xl bg-white border-2 border-blue-500 flex items-center justify-center"
                            >

                                <span className="text-3xl">
                                    🛍️
                                </span>

                            </button>


                            <button
                                className="w-20 h-20 rounded-xl bg-white border border-slate-200 flex items-center justify-center hover:border-blue-400 transition"
                            >

                                <span className="text-3xl">
                                    📦
                                </span>

                            </button>


                            <button
                                className="w-20 h-20 rounded-xl bg-white border border-slate-200 flex items-center justify-center hover:border-blue-400 transition"
                            >

                                <span className="text-3xl">
                                    ✨
                                </span>

                            </button>

                        </div>

                    </div>


                    {/* ================= RIGHT PRODUCT INFO ================= */}

                    <div>

                        <p className="text-blue-600 text-sm font-bold uppercase tracking-wider">

                            {product.categoryName}

                        </p>


                        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-3">

                            {product.name}

                        </h1>


                        {/* Rating */}

                        <div className="flex items-center gap-3 mt-5">

                            <span className="bg-green-600 text-white px-3 py-1.5 rounded-lg text-sm font-bold">

                                4.8 ★

                            </span>

                            <span className="text-slate-400">
                                |
                            </span>

                            <span className="text-sm text-slate-500">
                                48 customer reviews
                            </span>

                        </div>


                        <div className="border-t border-slate-200 my-6" />


                        {/* ================= PRICE ================= */}

                        <div>

                            <p className="text-sm text-slate-500">
                                Price
                            </p>

                            <p className="text-4xl font-extrabold text-blue-600 mt-1">

                                ₹{product.price}

                            </p>

                            <p className="text-sm text-green-600 font-semibold mt-2">

                                Inclusive of all taxes

                            </p>

                        </div>


                        {/* ================= DESCRIPTION ================= */}

                        <div className="mt-7">

                            <h2 className="text-lg font-bold">
                                About this product
                            </h2>

                            <p className="text-slate-600 leading-relaxed mt-3">

                                {product.description}

                            </p>

                        </div>


                        {/* ================= STOCK ================= */}

                        <div className="mt-6">

                            {product.quantity > 0 ? (

                                <div className="flex items-center gap-2">

                                    <span className="w-2.5 h-2.5 bg-green-500 rounded-full" />

                                    <span className="text-green-600 font-semibold text-sm">
                                        In Stock
                                    </span>

                                    <span className="text-slate-400 text-sm">
                                        ({product.quantity} available)
                                    </span>

                                </div>

                            ) : (

                                <p className="text-red-500 font-semibold">
                                    Currently Out of Stock
                                </p>

                            )}

                        </div>


                        {/* ================= QUANTITY ================= */}

                        {product.quantity > 0 && (

                            <div className="mt-6">

                                <p className="text-sm font-semibold mb-2">
                                    Quantity
                                </p>


                                <div className="flex items-center w-fit bg-white border border-slate-300 rounded-xl overflow-hidden">

                                    <button
                                        onClick={decreaseQuantity}
                                        className="w-12 h-12 font-bold text-lg hover:bg-slate-100 transition"
                                    >
                                        −
                                    </button>


                                    <span className="w-14 h-12 flex items-center justify-center border-x border-slate-300 font-bold">
                                        {quantity}
                                    </span>


                                    <button
                                        onClick={increaseQuantity}
                                        className="w-12 h-12 font-bold text-lg hover:bg-slate-100 transition"
                                    >
                                        +
                                    </button>

                                </div>

                            </div>

                        )}


                        {/* ================= ACTION BUTTONS ================= */}

                        {product.quantity > 0 && (

                            <div className="grid sm:grid-cols-2 gap-3 mt-7">


                                {/* ADD TO CART */}

                                <button
                                    onClick={
                                        handleAddToCart
                                    }
                                    disabled={
                                        cartLoading
                                    }
                                    className="h-14 rounded-xl border-2 border-blue-600 text-blue-600 font-bold hover:bg-blue-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                >

                                    {cartLoading
                                        ? "Adding..."
                                        : "🛒 Add to Cart"}

                                </button>


                                {/* BUY NOW */}

                                <button
                                    className="h-14 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-200"
                                >
                                    Buy Now
                                </button>

                            </div>

                        )}


                        {/* ================= CART MESSAGE ================= */}

                        {cartMessage && (

                            <div className="mt-4">

                                <p
                                    className={
                                        cartMessage.includes(
                                            "successfully"
                                        )
                                            ? "text-sm font-semibold text-green-600"
                                            : "text-sm font-semibold text-red-500"
                                    }
                                >

                                    {cartMessage}

                                </p>

                            </div>

                        )}


                        {/* ================= DELIVERY CARD ================= */}

                        <div className="mt-8 bg-white rounded-2xl border border-slate-200 p-5">

                            <h3 className="font-bold text-lg">
                                Delivery & Services
                            </h3>


                            <div className="grid sm:grid-cols-2 gap-5 mt-5">


                                <div className="flex gap-3">

                                    <span className="text-xl">
                                        🚚
                                    </span>

                                    <div>

                                        <p className="text-sm font-semibold">
                                            Fast Delivery
                                        </p>

                                        <p className="text-xs text-slate-500 mt-1">
                                            Delivered to your doorstep
                                        </p>

                                    </div>

                                </div>


                                <div className="flex gap-3">

                                    <span className="text-xl">
                                        🔒
                                    </span>

                                    <div>

                                        <p className="text-sm font-semibold">
                                            Secure Payment
                                        </p>

                                        <p className="text-xs text-slate-500 mt-1">
                                            Safe and secure checkout
                                        </p>

                                    </div>

                                </div>


                                <div className="flex gap-3">

                                    <span className="text-xl">
                                        ↩️
                                    </span>

                                    <div>

                                        <p className="text-sm font-semibold">
                                            Easy Returns
                                        </p>

                                        <p className="text-xs text-slate-500 mt-1">
                                            Hassle-free returns
                                        </p>

                                    </div>

                                </div>


                                <div className="flex gap-3">

                                    <span className="text-xl">
                                        🛡️
                                    </span>

                                    <div>

                                        <p className="text-sm font-semibold">
                                            Buyer Protection
                                        </p>

                                        <p className="text-xs text-slate-500 mt-1">
                                            Shop with confidence
                                        </p>

                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </main>


            {/* ================= PRODUCT INFORMATION ================= */}

            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">

                <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8">

                    <h2 className="text-2xl font-extrabold">
                        Product Information
                    </h2>


                    <div className="grid sm:grid-cols-2 gap-x-10 gap-y-5 mt-7">


                        <div className="flex justify-between border-b border-slate-100 pb-3">

                            <span className="text-slate-500">
                                Product
                            </span>

                            <span className="font-semibold text-right">
                                {product.name}
                            </span>

                        </div>


                        <div className="flex justify-between border-b border-slate-100 pb-3">

                            <span className="text-slate-500">
                                Category
                            </span>

                            <span className="font-semibold">
                                {product.categoryName}
                            </span>

                        </div>


                        <div className="flex justify-between border-b border-slate-100 pb-3">

                            <span className="text-slate-500">
                                Available
                            </span>

                            <span className="font-semibold">
                                {product.quantity}
                            </span>

                        </div>


                        <div className="flex justify-between border-b border-slate-100 pb-3">

                            <span className="text-slate-500">
                                Price
                            </span>

                            <span className="font-semibold">
                                ₹{product.price}
                            </span>

                        </div>

                    </div>

                </div>

            </section>

        </div>

    );
}

export default ProductDetails;