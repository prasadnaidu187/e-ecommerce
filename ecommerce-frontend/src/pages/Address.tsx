import { useEffect, useState } from "react";
import {
    createAddress,
    getAddresses,
    updateAddress,
    deleteAddress,
} from "../services/api";

interface Address {
    id: number;
    fullName: string;
    phone: string;
    addressLine: string;
    city: string;
    state: string;
    pincode: string;
}

interface AddressProps {
    onContinue: () => void;
}

const Address = ({ onContinue }: AddressProps) => {
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [editingId, setEditingId] =
        useState<number | null>(null);

    const [form, setForm] = useState({
        fullName: "",
        phone: "",
        addressLine: "",
        city: "",
        state: "",
        pincode: "",
    });

    // ================= LOAD ADDRESSES =================

    const loadAddresses = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await getAddresses();

            setAddresses(data);
        } catch (err) {
            setError("Failed to load addresses");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadAddresses();
    }, []);

    // ================= HANDLE INPUT =================

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    // ================= RESET FORM =================

    const resetForm = () => {
        setForm({
            fullName: "",
            phone: "",
            addressLine: "",
            city: "",
            state: "",
            pincode: "",
        });

        setEditingId(null);
    };

    // ================= ADD / UPDATE =================

    const handleSubmit = async (
        e: React.FormEvent
    ) => {
        e.preventDefault();

        try {
            setError("");

            if (editingId !== null) {
                const updated = await updateAddress(
                    editingId,
                    form
                );

                setAddresses(
                    addresses.map((address) =>
                        address.id === editingId
                            ? updated
                            : address
                    )
                );
            } else {
                const created = await createAddress(form);

                setAddresses([
                    ...addresses,
                    created,
                ]);
            }

            resetForm();
        } catch (err) {
            setError(
                "Failed to save address. Please try again."
            );
        }
    };

    // ================= EDIT =================

    const handleEdit = (address: Address) => {
        setEditingId(address.id);

        setForm({
            fullName: address.fullName,
            phone: address.phone,
            addressLine: address.addressLine,
            city: address.city,
            state: address.state,
            pincode: address.pincode,
        });

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    // ================= DELETE =================

    const handleDelete = async (id: number) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this address?"
        );

        if (!confirmed) {
            return;
        }

        try {
            await deleteAddress(id);

            setAddresses(
                addresses.filter(
                    (address) => address.id !== id
                )
            );
        } catch (err) {
            setError("Failed to delete address.");
        }
    };

    // ================= LOADING =================

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="h-10 w-10 border-4 border-gray-200 border-t-black rounded-full animate-spin mx-auto" />

                    <p className="mt-4 text-gray-500">
                        Loading your addresses...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 px-4 py-8 md:px-8">

            <div className="max-w-6xl mx-auto">

                {/* ================= HEADER ================= */}

                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">

                    <div>
                        <p className="text-xs font-bold tracking-[0.2em] text-gray-500 mb-2">
                            CHECKOUT
                        </p>

                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                            Delivery Address
                        </h1>

                        <p className="text-gray-500 mt-2">
                            Where should we deliver your order?
                        </p>
                    </div>

                    {/* Checkout Steps */}

                    <div className="hidden sm:flex items-center">

                        <div className="w-9 h-9 rounded-full bg-black text-white flex items-center justify-center font-semibold">
                            1
                        </div>

                        <div className="w-12 h-px bg-gray-300" />

                        <div className="w-9 h-9 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center font-semibold">
                            2
                        </div>

                        <div className="w-12 h-px bg-gray-300" />

                        <div className="w-9 h-9 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center font-semibold">
                            3
                        </div>

                    </div>

                </div>

                {/* ================= ERROR ================= */}

                {error && (
                    <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-red-600">
                        ⚠️ {error}
                    </div>
                )}

                {/* ================= MAIN GRID ================= */}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                    {/* ================= FORM ================= */}

                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8">

                        <div className="flex items-center gap-4 mb-7">

                            <div className="h-12 w-12 rounded-xl bg-gray-100 flex items-center justify-center text-2xl">
                                📍
                            </div>

                            <div>
                                <h2 className="text-xl font-bold text-gray-900">
                                    {editingId !== null
                                        ? "Edit Address"
                                        : "Add New Address"}
                                </h2>

                                <p className="text-sm text-gray-500 mt-1">
                                    Enter your complete delivery details
                                </p>
                            </div>

                        </div>

                        <form
                            onSubmit={handleSubmit}
                            className="space-y-5"
                        >

                            {/* Full Name */}

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Full Name
                                </label>

                                <input
                                    type="text"
                                    name="fullName"
                                    placeholder="Enter your full name"
                                    value={form.fullName}
                                    onChange={handleChange}
                                    required
                                    className="w-full h-12 rounded-lg border border-gray-300 px-4 text-sm outline-none focus:border-black focus:ring-2 focus:ring-gray-100"
                                />
                            </div>

                            {/* Phone */}

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Phone Number
                                </label>

                                <input
                                    type="tel"
                                    name="phone"
                                    placeholder="Enter phone number"
                                    value={form.phone}
                                    onChange={handleChange}
                                    required
                                    className="w-full h-12 rounded-lg border border-gray-300 px-4 text-sm outline-none focus:border-black focus:ring-2 focus:ring-gray-100"
                                />
                            </div>

                            {/* Address */}

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Address
                                </label>

                                <input
                                    type="text"
                                    name="addressLine"
                                    placeholder="House no, street, area"
                                    value={form.addressLine}
                                    onChange={handleChange}
                                    required
                                    className="w-full h-12 rounded-lg border border-gray-300 px-4 text-sm outline-none focus:border-black focus:ring-2 focus:ring-gray-100"
                                />
                            </div>

                            {/* City / State */}

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        City
                                    </label>

                                    <input
                                        type="text"
                                        name="city"
                                        placeholder="City"
                                        value={form.city}
                                        onChange={handleChange}
                                        required
                                        className="w-full h-12 rounded-lg border border-gray-300 px-4 text-sm outline-none focus:border-black focus:ring-2 focus:ring-gray-100"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        State
                                    </label>

                                    <input
                                        type="text"
                                        name="state"
                                        placeholder="State"
                                        value={form.state}
                                        onChange={handleChange}
                                        required
                                        className="w-full h-12 rounded-lg border border-gray-300 px-4 text-sm outline-none focus:border-black focus:ring-2 focus:ring-gray-100"
                                    />
                                </div>

                            </div>

                            {/* Pincode */}

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Pincode
                                </label>

                                <input
                                    type="text"
                                    name="pincode"
                                    placeholder="6-digit pincode"
                                    value={form.pincode}
                                    onChange={handleChange}
                                    required
                                    className="w-full h-12 rounded-lg border border-gray-300 px-4 text-sm outline-none focus:border-black focus:ring-2 focus:ring-gray-100"
                                />
                            </div>

                            {/* Buttons */}

                            <div className="flex gap-3 pt-2">

                                <button
                                    type="submit"
                                    className="flex-1 h-12 rounded-lg bg-black text-white font-semibold hover:bg-gray-800 transition"
                                >
                                    {editingId !== null
                                        ? "Update Address"
                                        : "Save Address"}
                                </button>

                                {editingId !== null && (
                                    <button
                                        type="button"
                                        onClick={resetForm}
                                        className="px-6 h-12 rounded-lg border border-gray-300 bg-white text-gray-700 font-semibold hover:bg-gray-50 transition"
                                    >
                                        Cancel
                                    </button>
                                )}

                            </div>

                        </form>

                    </div>

                    {/* ================= SAVED ADDRESSES ================= */}

                    <div>

                        <div className="mb-4">

                            <h2 className="text-xl font-bold text-gray-900">
                                Saved Addresses
                            </h2>

                            <p className="text-sm text-gray-500 mt-1">
                                {addresses.length}{" "}
                                {addresses.length === 1
                                    ? "address"
                                    : "addresses"}{" "}
                                saved
                            </p>

                        </div>

                        {addresses.length === 0 ? (

                            <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-10 text-center">

                                <div className="text-5xl mb-4">
                                    🏠
                                </div>

                                <h3 className="font-bold text-lg text-gray-900">
                                    No saved addresses
                                </h3>

                                <p className="text-sm text-gray-500 mt-2">
                                    Add your first delivery address
                                    using the form.
                                </p>

                            </div>

                        ) : (

                            <div className="space-y-4">

                                {addresses.map(
                                    (address) => (

                                        <div
                                            key={address.id}
                                            className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition"
                                        >

                                            {/* Address Header */}

                                            <div className="flex items-center gap-3 pb-4 border-b border-gray-100">

                                                <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center">
                                                    🏠
                                                </div>

                                                <div>

                                                    <h3 className="font-bold text-gray-900">
                                                        {address.fullName}
                                                    </h3>

                                                    <span className="text-[10px] font-bold tracking-wider text-gray-400">
                                                        DELIVERY ADDRESS
                                                    </span>

                                                </div>

                                            </div>

                                            {/* Details */}

                                            <div className="py-4 text-sm text-gray-600 space-y-1">

                                                <p>
                                                    📞 {address.phone}
                                                </p>

                                                <p>
                                                    {address.addressLine}
                                                </p>

                                                <p>
                                                    {address.city},{" "}
                                                    {address.state}
                                                </p>

                                                <p>
                                                    India -{" "}
                                                    {address.pincode}
                                                </p>

                                            </div>

                                            {/* Actions */}

                                            <div className="flex gap-3">

                                                <button
                                                    onClick={() =>
                                                        handleEdit(
                                                            address
                                                        )
                                                    }
                                                    className="px-4 py-2 rounded-lg bg-gray-100 text-gray-800 text-sm font-semibold hover:bg-gray-200 transition"
                                                >
                                                    ✏️ Edit
                                                </button>

                                                <button
                                                    onClick={() =>
                                                        handleDelete(
                                                            address.id
                                                        )
                                                    }
                                                    className="px-4 py-2 rounded-lg bg-red-50 text-red-600 text-sm font-semibold hover:bg-red-100 transition"
                                                >
                                                    🗑️ Delete
                                                </button>

                                            </div>

                                        </div>

                                    )
                                )}

                            </div>

                        )}

                    </div>

                </div>

                {/* ================= CONTINUE ================= */}

                {addresses.length > 0 && (

                    <div className="mt-8 bg-white rounded-2xl border border-gray-200 shadow-sm p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-5">

                        <div>

                            <p className="font-semibold text-gray-900">
                                ✓ Address selected
                            </p>

                            <p className="text-sm text-gray-500 mt-1">
                                Continue to review your order
                                and complete checkout.
                            </p>

                        </div>

                        <button
                            onClick={onContinue}
                            className="h-12 px-7 rounded-lg bg-black text-white font-semibold hover:bg-gray-800 transition"
                        >
                            Continue to Checkout →
                        </button>

                    </div>

                )}

            </div>

        </div>
    );
};

export default Address;