import { useEffect, useState } from "react";
import {
    User,
    Mail,
    Hash,
    ShieldCheck,
    Loader2,
    AlertCircle,
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
        const loadProfile = async () => {
            try {
                setLoading(true);
                setMessage("");
                const data = await getProfile();
                console.log("Profile data:", data);
                setProfile(data);
            } catch (error) {
                if (error instanceof Error) {
                    setMessage(error.message);
                } else {
                    setMessage("Failed to load profile");
                }
            } finally {
                setLoading(false);
            }
        };
        loadProfile();
    }, []);

    return (
        <div className="min-h-[calc(100vh-76px)] bg-[#F7F7F5] px-4 py-10 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl">
                {/* ================= PAGE HEADER ================= */}
                <div className="mb-8 flex items-end justify-between">
                    <div>
                        <h1 className="text-3xl font-semibold tracking-tight text-stone-900 sm:text-[2.25rem]">
                            My profile
                        </h1>
                        <p className="mt-1.5 text-[15px] text-stone-500">
                            Your account information and personal details.
                        </p>
                    </div>
                </div>

                {/* ================= LOADING ================= */}
                {loading && (
                    <div className="flex min-h-[320px] flex-col items-center justify-center gap-3 rounded-2xl border border-stone-200 bg-white">
                        <Loader2 size={22} className="animate-spin text-stone-400" />
                        <p className="text-sm text-stone-500">Loading your profile…</p>
                    </div>
                )}

                {/* ================= ERROR ================= */}
                {!loading && message && (
                    <div className="flex items-start gap-3.5 rounded-2xl border border-red-200 bg-red-50/60 p-5">
                        <AlertCircle size={19} className="mt-0.5 shrink-0 text-red-500" />
                        <div>
                            <h3 className="text-[15px] font-semibold text-red-900">
                                Unable to load profile
                            </h3>
                            <p className="mt-0.5 text-sm text-red-600/90">{message}</p>
                        </div>
                    </div>
                )}

                {/* ================= PROFILE ================= */}
                {!loading && !message && profile && (
                    <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white">
                        {/* ================= IDENTITY ================= */}
                        <div className="flex items-center gap-5 border-b border-stone-100 px-6 py-7 sm:px-8">
                            <div
                                className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full text-xl font-semibold text-white sm:h-[4.5rem] sm:w-[4.5rem] sm:text-2xl"
                                style={{ backgroundColor: "#2D3142" }}
                            >
                                {profile.name ? profile.name.charAt(0).toUpperCase() : "U"}
                            </div>

                            <div className="min-w-0">
                                <div className="flex flex-wrap items-center gap-2.5">
                                    <h2 className="truncate text-xl font-semibold text-stone-900 sm:text-2xl">
                                        {profile.name}
                                    </h2>
                                    <span
                                        className="flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium"
                                        style={{ backgroundColor: "#ECFDF5", color: "#059669" }}
                                    >
                    <ShieldCheck size={12} strokeWidth={2.5} />
                    Verified
                  </span>
                                </div>
                                <p className="mt-1 truncate text-sm text-stone-500">
                                    {profile.email}
                                </p>
                            </div>
                        </div>

                        {/* ================= ACCOUNT DETAILS ================= */}
                        <div className="px-6 py-6 sm:px-8">
                            <h3 className="mb-4 text-[13px] font-medium text-stone-400">
                                Account information
                            </h3>

                            <dl className="divide-y divide-stone-100 border-t border-stone-100">
                                <div className="flex items-center gap-4 py-4">
                                    <dt className="flex w-32 shrink-0 items-center gap-2.5 text-[13px] text-stone-500 sm:w-36">
                                        <Hash size={15} className="text-stone-400" />
                                        User ID
                                    </dt>
                                    <dd className="truncate text-[15px] font-medium text-stone-800">
                                        {profile.id}
                                    </dd>
                                </div>

                                <div className="flex items-center gap-4 py-4">
                                    <dt className="flex w-32 shrink-0 items-center gap-2.5 text-[13px] text-stone-500 sm:w-36">
                                        <User size={15} className="text-stone-400" />
                                        Full name
                                    </dt>
                                    <dd className="truncate text-[15px] font-medium text-stone-800">
                                        {profile.name}
                                    </dd>
                                </div>

                                <div className="flex items-center gap-4 py-4">
                                    <dt className="flex w-32 shrink-0 items-center gap-2.5 text-[13px] text-stone-500 sm:w-36">
                                        <Mail size={15} className="text-stone-400" />
                                        Email
                                    </dt>
                                    <dd className="truncate text-[15px] font-medium text-stone-800">
                                        {profile.email}
                                    </dd>
                                </div>
                            </dl>
                        </div>

                        {/* ================= SECURITY FOOTER ================= */}
                        <div className="flex items-center gap-3 border-t border-stone-100 bg-stone-50/60 px-6 py-4 sm:px-8">
                            <ShieldCheck size={17} className="shrink-0 text-emerald-600" />
                            <p className="text-[13px] text-stone-500">
                                Your account is secure and your information is protected.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Profile;
