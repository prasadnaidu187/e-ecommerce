import { useEffect, useState } from "react";

import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Address from "./pages/Address";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";

import Navbar from "./components/Navbar";

import {
    logoutUser,
    getCart
} from "./services/api";


function App() {

    const [page, setPage] =
        useState("login");


    const [selectedProductId, setSelectedProductId] =
        useState<number | null>(null);


    // ================= CART COUNT =================

    const [cartCount, setCartCount] =
        useState(0);


    // ================= LOAD CART COUNT =================

    const loadCartCount = async () => {

        const token =
            localStorage.getItem("token");


        if (!token) {

            setCartCount(0);

            return;
        }


        try {

            const cart =
                await getCart();


            const totalItems =
                cart.reduce(
                    (
                        total: number,
                        item: {
                            quantity: number;
                        }
                    ) => {

                        return total + item.quantity;

                    },
                    0
                );


            setCartCount(
                totalItems
            );

        } catch (error) {

            console.error(
                "Failed to load cart count:",
                error
            );

            setCartCount(0);

        }

    };


    // ================= LOAD CART WHEN PAGE CHANGES =================

    useEffect(() => {

        loadCartCount();

    }, [page]);


    // ================= LOGOUT =================

    const handleLogout = () => {

        logoutUser();

        setCartCount(0);

        setPage("login");

    };


    // ================= CART UPDATED =================

    const handleCartUpdated = (
        quantity: number
    ) => {

        setCartCount(
            (currentCount) =>
                currentCount + quantity
        );

    };


    return (

        <div>


            {/* ================= NAVBAR ================= */}

            {page !== "register" &&
                page !== "login" && (

                    <Navbar

                        onHome={() =>
                            setPage("home")
                        }


                        onProducts={() =>
                            setPage("products")
                        }


                        onProfile={() =>
                            setPage("profile")
                        }


                        onCart={() =>
                            setPage("cart")
                        }


                        onOrders={() =>
                            setPage("orders")
                        }


                        onLogout={
                            handleLogout
                        }


                        cartCount={
                            cartCount
                        }

                    />

                )}


            {/* ================= REGISTER ================= */}

            {page === "register" && (

                <Register

                    onRegisterSuccess={() =>
                        setPage("login")
                    }

                />

            )}


            {/* ================= LOGIN ================= */}

            {page === "login" && (

                <Login

                    onLoginSuccess={() => {

                        setPage("home");

                    }}


                    onRegister={() =>
                        setPage("register")
                    }

                />

            )}


            {/* ================= HOME ================= */}

            {page === "home" && (

                <Home

                    onShopNow={() =>
                        setPage("products")
                    }


                    onViewDetails={(id) => {

                        setSelectedProductId(id);

                        setPage(
                            "product-details"
                        );

                    }}

                />

            )}


            {/* ================= PROFILE ================= */}

            {page === "profile" && (

                <Profile />

            )}


            {/* ================= PRODUCTS ================= */}

            {page === "products" && (

                <Products

                    onViewDetails={(id) => {

                        setSelectedProductId(id);

                        setPage(
                            "product-details"
                        );

                    }}

                />

            )}


            {/* ================= PRODUCT DETAILS ================= */}

            {page === "product-details" &&
                selectedProductId !== null && (

                    <ProductDetails

                        productId={
                            selectedProductId
                        }


                        onCartUpdated={
                            handleCartUpdated
                        }

                    />

                )}


            {/* ================= CART ================= */}

            

            {page === "cart" && (

                <Cart

                    onContinueShopping={() =>
                        setPage("products")
                    }

                />

            )}


            {/* ================= ADDRESS ================= */}

            {page === "address" && (

                <Address

                    onContinue={() =>
                        setPage("checkout")
                    }

                />

            )}


            {/* ================= CHECKOUT ================= */}

            {page === "checkout" && (

                <Checkout

                    onBack={() =>
                        setPage("address")
                    }


                    onOrderSuccess={(order) => {

                        console.log(
                            "Order created:",
                            order
                        );

                        setPage(
                            "order-success"
                        );

                    }}

                />

            )}


            {/* ================= ORDERS ================= */}

            {page === "orders" && (

                <Orders

                    onContinueShopping={() =>
                        setPage("products")
                    }

                />

            )}


            {/* ================= ORDER SUCCESS ================= */}

            {page === "order-success" && (

                <div className="min-h-screen bg-gray-100 px-4 py-12">

                    <div className="mx-auto max-w-xl rounded-2xl bg-white p-8 text-center shadow">

                        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl">

                            ✓

                        </div>


                        <h1 className="text-3xl font-bold text-gray-900">

                            Order Placed Successfully!

                        </h1>


                        <p className="mt-3 text-gray-600">

                            Thank you for your purchase.

                        </p>


                        <button
                            onClick={() =>
                                setPage("orders")
                            }
                            className="mt-8 mr-3 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
                        >

                            View My Orders

                        </button>


                        <button
                            onClick={() =>
                                setPage("products")
                            }
                            className="mt-8 rounded-lg border border-gray-300 px-6 py-3 font-semibold text-gray-700 hover:bg-gray-100"
                        >

                            Continue Shopping

                        </button>

                    </div>

                </div>

            )}

        </div>

    );
}

export default App;