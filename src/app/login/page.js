"use client";

import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";

export default function LoginPage() {
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl") || "/";

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md rounded-3xl border border-emerald-600/40 bg-slate-900/70 p-8 shadow-2xl backdrop-blur"
            >
                <div className="mb-6 text-center text-3xl font-bold text-white">
                    <span className="text-emerald-500">Lav</span>Tracker
                </div>
                <p className="mb-6 text-center text-slate-300">
                    Sign in with your organization account to continue.
                </p>
                <button
                    onClick={() =>
                        signIn("google", {
                            callbackUrl,
                        })
                    }
                    className="flex w-full items-center justify-center gap-3 rounded-xl bg-emerald-500 px-4 py-3 text-lg font-semibold text-slate-900 transition hover:bg-emerald-400"
                >
                    Continue with Google
                </button>
            </motion.div>
        </div>
    );
}
