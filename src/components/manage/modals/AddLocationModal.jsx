"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function AddLocationModal({
    branchId,
    openAddLocation,
    setOpenAddLocation,
    setDisplayLocations,
}) {
    const [form, setForm] = useState({
        locationName: "",
        locationDescription: "",
    });
    const [loading, setLoading] = useState(false);

    async function handleSubmit() {
        if (!form.locationName.trim()) return;
        setLoading(true);
        try {
            const res = await fetch("/api/locations", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...form, branchId }),
            });
            if (res.ok) {
                const data = await res.json();
                setDisplayLocations((prev) => [...prev, data.location]);
                setForm({ locationName: "", locationDescription: "" });
                setOpenAddLocation(false);
            }
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    }

    if (!openAddLocation) return null;

    return (
        <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpenAddLocation(false)}
        >
            <motion.div
                className="bg-background text-foreground rounded-2xl p-6 w-full max-w-md border border-foreground/10"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-xl font-bold text-foreground mb-4">Add Location</h2>
                <div className="space-y-3">
                    <input
                        type="text"
                        placeholder="Location Name"
                        value={form.locationName}
                        onChange={(e) => setForm({ ...form, locationName: e.target.value })}
                        className="w-full rounded-lg border border-foreground/20 bg-foreground/5 px-3 py-2 text-foreground placeholder-foreground/50"
                    />
                    <textarea
                        placeholder="Description (optional)"
                        value={form.locationDescription}
                        onChange={(e) => setForm({ ...form, locationDescription: e.target.value })}
                        rows={3}
                        className="w-full rounded-lg border border-foreground/20 bg-foreground/5 px-3 py-2 text-foreground placeholder-foreground/50"
                    />
                </div>
                <div className="flex gap-3 mt-6">
                    <button
                        onClick={() => setOpenAddLocation(false)}
                        className="flex-1 rounded-lg bg-foreground/10 px-4 py-2 text-foreground font-semibold hover:bg-foreground/20"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={loading || !form.locationName.trim()}
                        className="flex-1 rounded-lg bg-brand px-4 py-2 text-foreground font-semibold hover:bg-brand/80 disabled:opacity-50"
                    >
                        {loading ? "Adding..." : "Add Location"}
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
}
