import { useEffect, useState } from "react";
import {
    User,
    Mail,
    Hash,
    ShieldCheck,
    Loader2,
    AlertCircle,
    ArrowUpRight,
    LockKeyhole,
    BadgeCheck,
    Fingerprint,
    Sparkles,
} from "lucide-react";
import { getProfile } from "../services/api";

type ProfileData = {
    id: number | string;
    name: string;
    email: string;
};

function Profile() {
    const [profile, setProfile] = useState<ProfileData | null>(null);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let active = true;

        const loadProfile = async () => {
            try {
                setLoading(true);
                setMessage("");

                const data = await getProfile();

                if (active) {
                    setProfile(data);
                }
            } catch (error) {
                if (active) {
                    setMessage(
                        error instanceof Error
                            ? error.message
                            : "Failed to load profile."
                    );
                }
            } finally {
                if (active) {
                    setLoading(false);
                }
            }
        };

        loadProfile();

        return () => {
            active = false;
        };
    }, []);

    const initial = profile?.name?.trim()?.charAt(0).toUpperCase() || "U";

    return (
        <div className="min-h-[calc(100vh-76px)] bg-[#F7F7F5] px-4 py-8 text-[#25272D] sm:px-6 sm:py-12 lg:px-8">

            <div className="mx-auto max-w-5xl">

                {/* Breadcrumb */}
                <div className="mb-7 flex items-center gap-2 text-xs text-stone-400">
                    <span>Account</span>
                    <span>/</span>
                    <span className="font-medium text-stone-700">
                        My Profile
                    </span>
                </div>

                {/* Page heading */}
                <div className="mb-9 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                    <div>
                        <div className="mb-3 flex items-center gap-2">
                            <span className="h-px w-7 bg-[#A3A58C]" />
                            <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-stone-500">
                                Personal space
                            </span>
                        </div>

                        <h1 className="text-3xl font-semibold tracking-tight text-[#25272D] sm:text-4xl">
                            My Profile
                        </h1>

                        <p className="mt-2 text-sm leading-6 text-stone-500 sm:text-[15px]">
                            Manage your identity and account information.
                        </p>
                    </div>

                    <div className="flex w-fit items-center gap-2 rounded-full border border-stone-200 bg-white px-3.5 py-2 shadow-sm">
                        <ShieldCheck
                            size={15}
                            className="text-emerald-600"
                        />
                        <span className="text-xs font-medium text-stone-600">
                            Secure account
                        </span>
                    </div>
                </div>

                {/* Loading state */}
                {loading && (
                    <div className="flex min-h-[350px] flex-col items-center justify-center rounded-3xl border border-stone-200/80 bg-white shadow-[0_8px_35px_rgba(35,39,48,0.03)]">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-stone-100">
                            <Loader2
                                size={25}
                                className="animate-spin text-[#555B68]"
                            />
                        </div>

                        <p className="mt-5 text-sm font-medium text-stone-700">
                            Loading your profile
                        </p>

                        <p className="mt-1 text-xs text-stone-400">
                            Retrieving your account information...
                        </p>
                    </div>
                )}

                {/* Error state */}
                {!loading && message && (
                    <div className="rounded-3xl border border-red-200 bg-white p-6 shadow-sm sm:p-8">
                        <div className="flex items-start gap-4">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-red-50">
                                <AlertCircle
                                    size={21}
                                    className="text-red-500"
                                />
                            </div>

                            <div>
                                <h2 className="font-semibold text-stone-900">
                                    We couldn't load your profile
                                </h2>

                                <p className="mt-2 text-sm leading-6 text-stone-500">
                                    {message}
                                </p>

                                <button
                                    onClick={() => window.location.reload()}
                                    className="mt-4 rounded-xl bg-[#2D3142] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#41465B]"
                                >
                                    Try again
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Profile content */}
                {!loading && !message && profile && (
                    <div className="grid gap-6 lg:grid-cols-[1.05fr_1.95fr]">

                        {/* Left identity card */}
                        <section className="relative overflow-hidden rounded-3xl border border-stone-200/80 bg-white shadow-[0_8px_35px_rgba(35,39,48,0.035)]">

                            {/* Decorative header */}
                            <div className="relative h-36 overflow-hidden bg-[#2D3142] sm:h-40">
                                <div className="absolute -right-12 -top-20 h-56 w-56 rounded-full border border-white/10" />
                                <div className="absolute -right-2 -top-10 h-40 w-40 rounded-full border border-white/10" />
                                <div className="absolute -bottom-16 left-16 h-36 w-36 rounded-full bg-white/[0.04]" />

                                <div className="absolute left-6 top-6 flex items-center gap-2 text-white/65">
                                    <Sparkles size={14} />
                                    <span className="text-[10px] font-medium uppercase tracking-[0.22em]">
                                        Your account
                                    </span>
                                </div>

                                <div className="absolute right-6 top-6 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[10px] font-medium tracking-wide text-white/80">
                                    MEMBER
                                </div>
                            </div>

                            {/* Avatar */}
                            <div className="relative px-6 pb-7 sm:px-7">
                                <div className="-mt-12 flex h-24 w-24 items-center justify-center rounded-[1.8rem] border-4 border-white bg-gradient-to-br from-[#E7DCC8] via-[#D8C9AE] to-[#B6A68C] text-3xl font-semibold text-[#2D3142] shadow-lg">
                                    {initial}
                                </div>

                                <div className="mt-5 flex items-center gap-2">
                                    <h2 className="min-w-0 break-words text-2xl font-semibold tracking-tight text-[#25272D]">
                                        {profile.name || "User"}
                                    </h2>

                                    <BadgeCheck
                                        size={19}
                                        className="shrink-0 text-emerald-600"
                                    />
                                </div>

                                <p className="mt-1 break-all text-sm text-stone-500">
                                    {profile.email}
                                </p>

                                <div className="mt-6 border-t border-stone-100 pt-5">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-stone-500">
                                            Account status
                                        </span>

                                        <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
                                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                            Active
                                        </span>
                                    </div>

                                    <div className="mt-4 flex items-center justify-between">
                                        <span className="text-xs text-stone-500">
                                            Member ID
                                        </span>

                                        <span className="rounded-lg bg-stone-100 px-2.5 py-1 font-mono text-xs font-medium text-stone-700">
                                            #{profile.id}
                                        </span>
                                    </div>
                                </div>

                                <div className="mt-6 rounded-2xl border border-[#E8E5DC] bg-[#F9F8F4] p-4">
                                    <div className="flex items-start gap-3">
                                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm">
                                            <LockKeyhole
                                                size={16}
                                                className="text-[#555B68]"
                                            />
                                        </div>

                                        <div>
                                            <p className="text-sm font-medium text-stone-800">
                                                Your privacy matters
                                            </p>

                                            <p className="mt-1 text-xs leading-5 text-stone-500">
                                                Your account details are handled
                                                securely.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Right information panel */}
                        <div className="space-y-6">

                            {/* Account information */}
                            <section className="overflow-hidden rounded-3xl border border-stone-200/80 bg-white shadow-[0_8px_35px_rgba(35,39,48,0.035)]">
                                <div className="flex items-center justify-between border-b border-stone-100 px-6 py-5 sm:px-7">
                                    <div>
                                        <h2 className="text-lg font-semibold tracking-tight text-[#25272D]">
                                            Account information
                                        </h2>

                                        <p className="mt-1 text-xs text-stone-500">
                                            Your registered details
                                        </p>
                                    </div>

                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F2F0EA]">
                                        <Fingerprint
                                            size={19}
                                            className="text-[#555B68]"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-0 px-6 sm:px-7">
                                    {/* ID */}
                                    <div className="flex items-center gap-4 border-b border-stone-100 py-5">
                                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#F7F7F5]">
                                            <Hash
                                                size={19}
                                                className="text-stone-500"
                                            />
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <p className="text-xs text-stone-500">
                                                User ID
                                            </p>

                                            <p className="mt-1 break-all text-sm font-medium text-stone-800">
                                                {profile.id}
                                            </p>
                                        </div>

                                        <BadgeCheck
                                            size={17}
                                            className="shrink-0 text-stone-300"
                                        />
                                    </div>

                                    {/* Name */}
                                    <div className="flex items-center gap-4 border-b border-stone-100 py-5">
                                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#F7F7F5]">
                                            <User
                                                size={19}
                                                className="text-stone-500"
                                            />
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <p className="text-xs text-stone-500">
                                                Full name
                                            </p>

                                            <p className="mt-1 break-words text-sm font-medium text-stone-800">
                                                {profile.name}
                                            </p>
                                        </div>

                                        <BadgeCheck
                                            size={17}
                                            className="shrink-0 text-stone-300"
                                        />
                                    </div>

                                    {/* Email */}
                                    <div className="flex items-center gap-4 py-5">
                                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#F7F7F5]">
                                            <Mail
                                                size={19}
                                                className="text-stone-500"
                                            />
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <p className="text-xs text-stone-500">
                                                Email address
                                            </p>

                                            <p className="mt-1 break-all text-sm font-medium text-stone-800">
                                                {profile.email}
                                            </p>
                                        </div>

                                        <span className="flex shrink-0 items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-semibold text-emerald-700">
                                            <ShieldCheck size={12} />
                                            Verified
                                        </span>
                                    </div>
                                </div>
                            </section>

                            {/* Security card */}
                            <section className="overflow-hidden rounded-3xl border border-stone-200/80 bg-white shadow-[0_8px_35px_rgba(35,39,48,0.035)]">
                                <div className="flex items-start gap-4 p-6 sm:p-7">
                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-50">
                                        <ShieldCheck
                                            size={23}
                                            className="text-emerald-700"
                                        />
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <h2 className="text-base font-semibold text-[#25272D]">
                                                Account protection
                                            </h2>

                                            <span className="rounded-full bg-emerald-50 px-2 py-1 text-[9px] font-semibold uppercase tracking-wider text-emerald-700">
                                                Protected
                                            </span>
                                        </div>

                                        <p className="mt-2 text-sm leading-6 text-stone-500">
                                            Your account uses authenticated
                                            access to help protect your personal
                                            information.
                                        </p>

                                        <div className="mt-5 flex items-center gap-2 border-t border-stone-100 pt-4">
                                            <LockKeyhole
                                                size={14}
                                                className="text-emerald-600"
                                            />

                                            <span className="text-xs text-stone-600">
                                                Secure account access
                                            </span>

                                            <ArrowUpRight
                                                size={14}
                                                className="ml-auto text-stone-400"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Privacy note */}
                            <div className="flex items-start gap-3 px-2 py-1">
                                <ShieldCheck
                                    size={16}
                                    className="mt-0.5 shrink-0 text-stone-400"
                                />

                                <p className="text-xs leading-5 text-stone-500">
                                    Your personal information is displayed
                                    securely. To change your name or email,
                                    an account-editing feature will need to be
                                    connected to your backend.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Footer */}
                <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-stone-200 pt-6 text-center sm:flex-row sm:text-left">
                    <p className="text-xs text-stone-400">
                        Your account, your space.
                    </p>

                    <p className="text-xs font-medium tracking-wide text-stone-500">
                        SHOP WITH CONFIDENCE
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Profile;
