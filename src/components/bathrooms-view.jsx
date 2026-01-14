"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function BathroomsView({ initialBathrooms, locationName }) {
    const [bathrooms, setBathrooms] = useState(initialBathrooms);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    async function refresh(locationId) {
        const res = await fetch(`/api/bathrooms?locationId=${locationId}`, {
            cache: "no-store",
        });
        const data = await res.json();
        setBathrooms(data.bathrooms);
    }

    async function handleClean(bathroom) {
        const code = window.prompt("Enter your cleaning code");
        if (!code) return;
        setLoading(true);
        setMessage("");

        const tasks = (bathroom.bathroomTasks ?? []).map((bt) => ({
            taskId: bt.taskId,
        }));

        const res = await fetch("/api/clean", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                bathroomId: bathroom.bathroomId,
                tasks,
                code,
            }),
        });

        const data = await res.json();
        if (res.ok) {
            setBathrooms(data.bathrooms);
            setMessage("Cleaning recorded");
        } else {
            setMessage(data.message || "Unable to clean");
        }
        setLoading(false);
    }

    async function handleInspect(bathroom) {
        const reason = window.prompt(
            "Enter issues (comma separated) for inspection"
        );
        if (!reason) return;
        setLoading(true);
        setMessage("");

        const res = await fetch("/api/inspection", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                bathroomId: bathroom.bathroomId,
                locationId: bathroom.locationId,
                items: reason.split(",").map((r) => r.trim()),
                image: null,
            }),
        });

        const data = await res.json();
        if (res.ok) {
            setBathrooms(data.bathrooms);
            setMessage("Inspection flagged");
        } else {
            setMessage(data.message || "Unable to create inspection");
        }
        setLoading(false);
    }

    async function handleClear(bathroom) {
        setLoading(true);
        setMessage("");
        const res = await fetch("/api/inspection/clear", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                bathroomId: bathroom.bathroomId,
                locationId: bathroom.locationId,
            }),
        });
        const data = await res.json();
        if (res.ok) {
            setBathrooms(data.bathrooms);
            setMessage("Inspection cleared");
        } else {
            setMessage(data.message || "Unable to clear");
        }
        setLoading(false);
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <div className="text-sm text-slate-300">Location</div>
                    <div className="text-3xl font-bold text-white">
                        {locationName}
                    </div>
                </div>
                <div className="text-sm text-emerald-400">{message}</div>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
                {bathrooms
                    .slice()
                    .sort((a, b) => a.order - b.order)
                    .map((bathroom) => (
                        <motion.div
                            key={bathroom.bathroomId}
                            layout
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`rounded-2xl border p-5 shadow ${
                                bathroom.status === "inspected"
                                    ? "border-red-500/60 bg-red-950/30"
                                    : "border-emerald-500/60 bg-slate-800/70"
                            }`}
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-xl font-semibold text-white">
                                        {bathroom.name}
                                    </div>
                                    <div className="text-sm text-slate-300">
                                        {bathroom.gender}
                                    </div>
                                </div>
                                <div className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
                                    {bathroom.status}
                                </div>
                            </div>
                            <div className="mt-3 text-sm text-slate-200">
                                Tasks:
                                <div className="mt-1 flex flex-wrap gap-2">
                                    {bathroom.bathroomTasks.map((bt) => (
                                        <span
                                            key={bt.bathroomTaskId}
                                            className="rounded-lg bg-slate-700 px-2 py-1 text-xs text-white"
                                        >
                                            {bt.task?.taskName}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div className="mt-3 text-sm text-slate-200">
                                Recent cleanings:
                                <div className="mt-1 space-y-1">
                                    <AnimatePresence>
                                        {bathroom.cleanings?.map((cleaning) => (
                                            <motion.div
                                                key={cleaning.cleaningId}
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                className="rounded-lg bg-slate-700/70 px-2 py-1 text-xs text-white"
                                            >
                                                {cleaning.username ?? "User"} —{" "}
                                                {new Date(
                                                    cleaning.createdAt
                                                ).toLocaleString()}
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </div>
                            </div>
                            <div className="mt-4 flex gap-2">
                                <button
                                    disabled={loading}
                                    onClick={() => handleClean(bathroom)}
                                    className="flex-1 rounded-lg bg-emerald-500 px-3 py-2 text-sm font-semibold text-slate-900 transition hover:bg-emerald-400 disabled:opacity-50"
                                >
                                    Mark Clean
                                </button>
                                <button
                                    disabled={loading}
                                    onClick={() => handleInspect(bathroom)}
                                    className="flex-1 rounded-lg bg-amber-500 px-3 py-2 text-sm font-semibold text-slate-900 transition hover:bg-amber-400 disabled:opacity-50"
                                >
                                    Flag Issue
                                </button>
                                {bathroom.status !== "open" && (
                                    <button
                                        disabled={loading}
                                        onClick={() => handleClear(bathroom)}
                                        className="flex-1 rounded-lg bg-slate-700 px-3 py-2 text-sm font-semibold text-white transition hover:bg-slate-600 disabled:opacity-50"
                                    >
                                        Clear
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    ))}
            </div>
        </div>
    );
}
