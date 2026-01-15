"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function AddBranchModal({
    openAddBranch,
    setOpenAddBranch,
    setDisplayBranches,
}) {
    const [form, setForm] = useState({
        name: "",
        address: "",
        toNotificationEmails: "",
        ccNotificationEmails: "",
    });
    const [loading, setLoading] = useState(false);

    async function handleSubmit() {
        if (!form.name.trim()) return;
        setLoading(true);
        try {
            const res = await fetch("/api/branches", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            if (res.ok) {
                const data = await res.json();
                setDisplayBranches((prev) => [...prev, data.branch]);
                setForm({
                    name: "",
                    address: "",
                    toNotificationEmails: "",
                    ccNotificationEmails: "",
                });
                setOpenAddBranch(false);
            }
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    }

    if (!openAddBranch) return null;

    return (
        <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpenAddBranch(false)}
        >
            <motion.div
                className="bg-background text-foreground rounded-2xl p-6 w-full max-w-md border border-foreground/10"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-xl font-bold text-foreground mb-4">Add Branch</h2>
                <div className="space-y-3">
                    <input
                        type="text"
                        placeholder="Branch Name"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="w-full rounded-lg border border-foreground/20 bg-foreground/5 px-3 py-2 text-foreground placeholder-foreground/50"
                    />
                    <input
                        type="text"
                        placeholder="Address"
                        value={form.address}
                        onChange={(e) => setForm({ ...form, address: e.target.value })}
                        className="w-full rounded-lg border border-foreground/20 bg-foreground/5 px-3 py-2 text-foreground placeholder-foreground/50"
                    />
                    <input
                        type="text"
                        placeholder="To Notification Emails (comma separated)"
                        value={form.toNotificationEmails}
                        onChange={(e) => setForm({ ...form, toNotificationEmails: e.target.value })}
                        className="w-full rounded-lg border border-foreground/20 bg-foreground/5 px-3 py-2 text-foreground placeholder-foreground/50"
                    />
                    <input
                        type="text"
                        placeholder="CC Notification Emails (comma separated)"
                        value={form.ccNotificationEmails}
                        onChange={(e) => setForm({ ...form, ccNotificationEmails: e.target.value })}
                        className="w-full rounded-lg border border-foreground/20 bg-foreground/5 px-3 py-2 text-foreground placeholder-foreground/50"
                    />
                </div>
                <div className="flex gap-3 mt-6">
                    <button
                        onClick={() => setOpenAddBranch(false)}
                        className="flex-1 rounded-lg bg-foreground/10 px-4 py-2 text-foreground font-semibold hover:bg-foreground/20"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={loading || !form.name.trim()}
                        className="flex-1 rounded-lg bg-brand px-4 py-2 text-foreground font-semibold hover:bg-brand/80 disabled:opacity-50"
                    >
                        {loading ? "Adding..." : "Add Branch"}
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
}
