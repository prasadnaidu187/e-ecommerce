type NavbarProps = {
    onHome: () => void;
    onProducts: () => void;
    onProfile: () => void;
    onLogout: () => void;
    onCart: () => void;
    cartCount: number;
};

function Navbar({
                    onHome,
                    onProducts,
                    onProfile,
                    onLogout,
                    onCart,
                    cartCount
                }: NavbarProps) {

    return (
        <header className="sticky top-0 z-50">

            {/* ================= TOP NAVBAR ================= */}

            <div className="bg-slate-950 text-white">

                <div className="max-w-[1600px] mx-auto px-4">

                    <div className="h-[72px] flex items-center gap-3 lg:gap-5">

                        {/* LOGO */}

                        <button
                            onClick={onHome}
                            className="flex items-center gap-2 px-2 py-2 rounded-md hover:border hover:border-white transition shrink-0"
                        >

                            <div className="text-3xl">
                                🛍️
                            </div>

                            <div className="text-left leading-none">

                                <div className="text-xl font-extrabold tracking-tight">
                                    MY<span className="text-blue-400">STORE</span>
                                </div>

                                <div className="text-[9px] text-slate-400 tracking-[0.25em] mt-1">
                                    SHOP SMARTER
                                </div>

                            </div>

                        </button>


                        {/* DELIVERY */}

                        <button
                            className="hidden lg:flex items-center gap-2 px-3 py-2 rounded-md hover:border hover:border-white transition"
                        >

                            <span className="text-lg">
                                📍
                            </span>

                            <div className="text-left leading-tight">

                                <p className="text-[11px] text-slate-400">
                                    Deliver to
                                </p>

                                <p className="text-sm font-bold">
                                    Your Location
                                </p>

                            </div>

                        </button>


                        {/* SEARCH */}

                        <div className="flex-1 flex h-11 max-w-3xl">

                            <button
                                className="hidden sm:block bg-slate-100 text-slate-600 px-4 rounded-l-md text-sm font-medium border-r border-slate-300"
                            >
                                All
                            </button>

                            <input
                                type="text"
                                placeholder="Search products, brands and more..."
                                className="flex-1 min-w-0 px-4 bg-white text-slate-900 outline-none text-sm placeholder:text-slate-400"
                            />

                            <button
                                className="w-12 bg-blue-500 hover:bg-blue-400 text-white flex items-center justify-center rounded-r-md transition"
                            >

                                <span className="text-xl">
                                    🔍
                                </span>

                            </button>

                        </div>


                        {/* ACCOUNT */}

                        <button
                            onClick={onProfile}
                            className="hidden md:block px-3 py-2 rounded-md hover:border hover:border-white transition text-left shrink-0"
                        >

                            <p className="text-[11px] text-slate-400">
                                Hello, User
                            </p>

                            <p className="text-sm font-bold">
                                Account & Profile
                            </p>

                        </button>


                        {/* ORDERS */}

                        <button
                            className="hidden lg:block px-3 py-2 rounded-md hover:border hover:border-white transition text-left shrink-0"
                        >

                            <p className="text-[11px] text-slate-400">
                                Your
                            </p>

                            <p className="text-sm font-bold">
                                Orders
                            </p>

                        </button>


                        {/* ================= CART ================= */}

                        <button
                            onClick={onCart}
                            className="flex items-center gap-2 px-2 py-2 rounded-md hover:border hover:border-white transition shrink-0"
                        >

                            <div className="relative">

                                <span className="text-3xl">
                                    🛒
                                </span>


                                {/* CART COUNT */}

                                <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-[10px] font-bold min-w-5 h-5 px-1 rounded-full flex items-center justify-center">

                                    {cartCount}

                                </span>

                            </div>


                            <span className="hidden sm:block text-sm font-bold">
                                Cart
                            </span>

                        </button>

                    </div>

                </div>

            </div>


            {/* ================= SECOND NAVBAR ================= */}

            <div className="bg-slate-900 text-white border-t border-slate-800">

                <div className="max-w-[1600px] mx-auto px-4">

                    <div className="h-12 flex items-center gap-1 overflow-x-auto">

                        {/* ALL */}

                        <button
                            onClick={onProducts}
                            className="flex items-center gap-2 px-4 py-2 rounded-md border border-transparent hover:border-white transition text-sm font-bold whitespace-nowrap"
                        >

                            <span className="text-lg">
                                ☰
                            </span>

                            All

                        </button>


                        {/* DEALS */}

                        <button
                            onClick={onProducts}
                            className="px-4 py-2 rounded-md border border-transparent hover:border-white transition text-sm whitespace-nowrap"
                        >
                            Today's Deals
                        </button>


                        {/* PRODUCTS */}

                        <button
                            onClick={onProducts}
                            className="px-4 py-2 rounded-md border border-transparent hover:border-white transition text-sm whitespace-nowrap"
                        >
                            Products
                        </button>


                        {/* CATEGORIES */}

                        <button
                            onClick={onProducts}
                            className="px-4 py-2 rounded-md border border-transparent hover:border-white transition text-sm whitespace-nowrap"
                        >
                            Categories
                        </button>


                        {/* NEW */}

                        <button
                            onClick={onProducts}
                            className="px-4 py-2 rounded-md border border-transparent hover:border-white transition text-sm whitespace-nowrap"
                        >
                            New Arrivals
                        </button>


                        {/* SUPPORT */}

                        <button
                            className="px-4 py-2 rounded-md border border-transparent hover:border-white transition text-sm whitespace-nowrap"
                        >
                            Customer Service
                        </button>


                        {/* PROFILE */}

                        <button
                            onClick={onProfile}
                            className="ml-auto px-4 py-2 rounded-md border border-transparent hover:border-white transition text-sm font-semibold whitespace-nowrap"
                        >
                            👤 My Account
                        </button>


                        {/* LOGOUT */}

                        <button
                            onClick={onLogout}
                            className="px-4 py-2 rounded-md border border-transparent hover:border-white transition text-sm font-semibold whitespace-nowrap"
                        >
                            Sign Out
                        </button>

                    </div>

                </div>

            </div>

        </header>
    );
}

export default Navbar;