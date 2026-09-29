import { useEffect, useState } from "react";

import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";

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


        // User is not logged in

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

        </div>

    );
}

export default App;