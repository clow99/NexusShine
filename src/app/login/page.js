"use client";

import { Suspense } from "react";

import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";

function LoginForm() {
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl") || "/";

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-background to-background">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md rounded-3xl border border-brand/40 bg-background p-8 shadow-2xl"
            >
                <div className="mb-6 flex justify-center">
                    <img
                        src="/nexus_shine_logo.png"
                        alt="NexusShine"
                        className="h-16 w-auto"
                    />
                </div>
                <p className="mb-6 text-center text-foreground/70">
                    Sign in with your organization account to continue.
                </p>
                <button
                    onClick={() =>
                        signIn("google", {
                            callbackUrl,
                        })
                    }
                    className="flex w-full items-center justify-center gap-3 rounded-xl bg-brand px-4 py-3 text-lg font-semibold text-white transition hover:bg-brand/90"
                >
                    Continue with Google
                </button>
            </motion.div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <LoginForm />
        </Suspense>
    );
}
