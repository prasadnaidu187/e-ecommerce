import { useState } from "react";
import { registerUser } from "../services/api";

type RegisterProps = {
    onRegisterSuccess: () => void;
};

function Register({
    onRegisterSuccess
}: RegisterProps) {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleRegister = async (
        event: React.FormEvent
    ) => {

        event.preventDefault();

        try {

            const data = await registerUser(
                name,
                email,
                password
            );

            setMessage(
                data.message || "Registration successful!"
            );

            setName("");
            setEmail("");
            setPassword("");

            setTimeout(() => {
                onRegisterSuccess();
            }, 800);

        } catch (error) {

            if (error instanceof Error) {
                setMessage(error.message);
            } else {
                setMessage("Registration failed");
            }

        }
    };

    return (

        <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 py-8">

            <div className="w-full max-w-6xl bg-white rounded-3xl overflow-hidden shadow-2xl grid md:grid-cols-2">

                {/* LEFT SIDE */}

                <div className="hidden md:flex relative overflow-hidden bg-gradient-to-br from-indigo-950 via-indigo-900 to-purple-900 text-white p-12 lg:p-16 min-h-[650px] flex-col justify-between">

                    {/* Decorative circles */}

                    <div className="absolute -top-24 -right-24 w-72 h-72 bg-purple-500/20 rounded-full" />

                    <div className="absolute -bottom-32 -left-20 w-80 h-80 bg-indigo-400/10 rounded-full" />

                    <div className="relative z-10">

                        {/* Logo */}

                        <div className="flex items-center gap-3">

                            <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-2xl">
                                🛍️
                            </div>

                            <span className="text-2xl font-bold">
                                My Store
                            </span>

                        </div>

                        {/* Main content */}

                        <div className="mt-28">

                            <p className="text-indigo-300 text-sm font-semibold uppercase tracking-[0.2em]">
                                Join our community
                            </p>

                            <h1 className="text-5xl lg:text-6xl font-bold leading-[1.05] mt-5">
                                Start
                                <br />
                                shopping.
                            </h1>

                            <p className="text-indigo-100/70 text-lg leading-relaxed mt-7 max-w-md">
                                Create your account and discover
                                products you'll love at prices
                                you'll enjoy.
                            </p>

                        </div>

                    </div>

                    {/* Bottom */}

                    <div className="relative z-10 flex items-center gap-3 text-indigo-200/60 text-sm">

                        <span className="w-2 h-2 rounded-full bg-indigo-400" />

                        Quick and secure registration

                    </div>

                </div>


                {/* RIGHT SIDE */}

                <div className="flex items-center justify-center p-7 sm:p-12 lg:p-16">

                    <div className="w-full max-w-md">

                        {/* Mobile Logo */}

                        <div className="md:hidden text-center mb-9">

                            <div className="inline-flex w-12 h-12 rounded-xl bg-indigo-600 text-white items-center justify-center text-2xl">
                                🛍️
                            </div>

                            <h1 className="text-2xl font-bold text-slate-900 mt-3">
                                My Store
                            </h1>

                        </div>


                        {/* Heading */}

                        <div className="mb-8">

                            <p className="text-indigo-600 font-semibold text-sm uppercase tracking-wider">
                                Create account
                            </p>

                            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mt-2">
                                Join My Store
                            </h2>

                            <p className="text-slate-500 mt-3">
                                Create an account to start shopping.
                            </p>

                        </div>


                        {/* FORM */}

                        <form
                            onSubmit={handleRegister}
                            className="space-y-5"
                        >

                            {/* Name */}

                            <div>

                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Full name
                                </label>

                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) =>
                                        setName(e.target.value)
                                    }
                                    placeholder="Enter your name"
                                    required
                                    className="w-full h-13 px-4 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 placeholder:text-slate-400 outline-none transition focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                                />

                            </div>


                            {/* Email */}

                            <div>

                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Email address
                                </label>

                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) =>
                                        setEmail(e.target.value)
                                    }
                                    placeholder="you@example.com"
                                    required
                                    className="w-full h-13 px-4 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 placeholder:text-slate-400 outline-none transition focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                                />

                            </div>


                            {/* Password */}

                            <div>

                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Password
                                </label>

                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    placeholder="Create a password"
                                    required
                                    className="w-full h-13 px-4 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 placeholder:text-slate-400 outline-none transition focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                                />

                            </div>


                            {/* Register button */}

                            <button
                                type="submit"
                                className="w-full h-13 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white rounded-xl font-semibold transition shadow-lg shadow-indigo-200"
                            >
                                Create Account
                            </button>

                        </form>


                        {/* Message */}

                        {message && (

                            <div className="mt-5 rounded-xl bg-indigo-50 border border-indigo-100 px-4 py-3 text-sm text-indigo-600 text-center">
                                {message}
                            </div>

                        )}


                        {/* Login link */}

                        <div className="mt-8 pt-7 border-t border-slate-200 text-center">

                            <p className="text-slate-500 text-sm">
                                Already have an account?
                            </p>

                            <button
                                type="button"
                                onClick={onRegisterSuccess}
                                className="mt-2 text-indigo-600 hover:text-indigo-800 font-semibold"
                            >
                                Back to Login
                            </button>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default Register;

