"use client";

import { useState } from "react";
import Link from "next/link";
import ThemeSelector from "@/components/theme-selector";

export default function SettingsClient({ initialSettings }) {
    const [takePhotoOnReport, setTakePhotoOnReport] = useState(
        initialSettings?.takePhotoOnReport ?? true
    );
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    async function handleToggle(event) {
        const nextValue = event.target.checked;
        setTakePhotoOnReport(nextValue);
        setSaving(true);
        setError("");
        setSuccess("");

        try {
            const res = await fetch("/api/settings", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ takePhotoOnReport: nextValue }),
            });

            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data.message || "Unable to save settings.");
            }

            setSuccess("Settings saved.");
        } catch (err) {
            setTakePhotoOnReport(!nextValue);
            setError(err?.message || "Unable to save settings.");
        } finally {
            setSaving(false);
        }
    }

    return (
        <div className="min-h-screen bg-background p-6 text-foreground">
            <div className="mx-auto max-w-5xl space-y-6">
                <div className="flex items-center justify-between">
                    <Link href="/" className="flex items-center">
                        <img
                            src="/nexus_shine_logo.png"
                            alt="NexusShine"
                            className="h-8 w-auto"
                        />
                    </Link>
                    <Link
                        href="/"
                        className="rounded-xl border border-foreground/10 px-3 py-2 text-sm text-foreground/70 hover:bg-foreground/5"
                    >
                        Back home
                    </Link>
                </div>

                <div className="rounded-2xl border border-foreground/10 bg-background p-5 shadow">
                    <h2 className="text-xl font-semibold text-foreground">
                        Report settings
                    </h2>
                    <div className="mt-4 flex items-center justify-between gap-6 rounded-xl border border-foreground/10 bg-foreground/5 px-4 py-4">
                        <div>
                            <div className="text-base font-semibold text-foreground">
                                Take photo on report
                            </div>
                            <div className="text-sm text-foreground/60">
                                Require a camera capture when submitting an
                                inspection report.
                            </div>
                        </div>
                        <label className="inline-flex items-center gap-2 text-sm">
                            <span className="text-foreground/60">
                                {takePhotoOnReport ? "On" : "Off"}
                            </span>
                            <input
                                type="checkbox"
                                checked={takePhotoOnReport}
                                onChange={handleToggle}
                                disabled={saving}
                                className="h-5 w-5"
                            />
                        </label>
                    </div>
                    {error ? (
                        <div className="mt-3 text-sm text-red-400">{error}</div>
                    ) : null}
                    {success ? (
                        <div className="mt-3 text-sm text-brand">{success}</div>
                    ) : null}
                </div>

                <div className="rounded-2xl border border-foreground/10 bg-background p-5 shadow">
                    <h2 className="text-xl font-semibold text-foreground">
                        Theme
                    </h2>
                    <div className="mt-4">
                        <ThemeSelector initialTheme={initialSettings?.theme} />
                    </div>
                </div>

                <div className="rounded-2xl border border-foreground/10 bg-background p-5 shadow">
                    <h2 className="text-xl font-semibold text-foreground">
                        Admin tools
                    </h2>
                    <div className="mt-4 flex flex-wrap gap-3">
                        <Link
                            href="/manage/users"
                            className="rounded-xl border border-foreground/10 px-4 py-2 text-sm font-semibold text-foreground/80 hover:bg-foreground/5"
                        >
                            Manage users
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

