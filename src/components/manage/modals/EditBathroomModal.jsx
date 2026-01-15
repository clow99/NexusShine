"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function EditBathroomModal({
    bathroom,
    locationId,
    openEditBathroom,
    setOpenEditBathroom,
    setDisplayBathrooms,
    tasks = [],
    onDelete,
}) {
    const [form, setForm] = useState({
        name: "",
        gender: "Male",
        notificationEmail: "",
        order: 1,
    });
    const [selectedTasks, setSelectedTasks] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (bathroom) {
            setForm({
                name: bathroom.name || "",
                gender: bathroom.gender || "Male",
                notificationEmail: bathroom.notificationEmail || "",
                order: bathroom.order || 1,
            });
            // Set selected tasks from bathroom's current tasks
            const currentTasks = (bathroom.bathroomTasks || []).map((bt) => bt.task);
            setSelectedTasks(currentTasks);
        }
    }, [bathroom]);

    function handleTaskToggle(task) {
        setSelectedTasks((prev) =>
            prev.some((t) => t.taskId === task.taskId)
                ? prev.filter((t) => t.taskId !== task.taskId)
                : [...prev, task]
        );
    }

    async function handleSubmit() {
        if (!form.name.trim()) return;
        setLoading(true);
        try {
            const res = await fetch("/api/bathrooms", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    bathroomId: bathroom.bathroomId,
                    locationId,
                    ...form,
                    tasks: selectedTasks.map((t) => ({ taskId: t.taskId })),
                }),
            });
            if (res.ok) {
                const data = await res.json();
                if (data.bathrooms) {
                    setDisplayBathrooms(data.bathrooms);
                } else {
                    setDisplayBathrooms((prev) =>
                        prev.map((b) =>
                            b.bathroomId === bathroom.bathroomId
                                ? { ...b, ...form, bathroomTasks: selectedTasks.map((t) => ({ task: t })) }
                                : b
                        )
                    );
                }
                setOpenEditBathroom(null);
            }
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    }

    if (!openEditBathroom || !bathroom) return null;

    return (
        <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpenEditBathroom(null)}
        >
            <motion.div
                className="bg-background text-foreground rounded-2xl p-6 w-full max-w-lg border border-foreground/10 max-h-[90vh] overflow-auto"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-xl font-bold text-foreground mb-4">Edit Bathroom</h2>
                <div className="space-y-3">
                    <input
                        type="text"
                        placeholder="Bathroom Name"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="w-full rounded-lg border border-foreground/20 bg-foreground/5 px-3 py-2 text-foreground placeholder-foreground/50"
                    />
                    <select
                        value={form.gender}
                        onChange={(e) => setForm({ ...form, gender: e.target.value })}
                        className="w-full rounded-lg border border-foreground/20 bg-foreground/5 px-3 py-2 text-foreground"
                    >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Neutral">Neutral</option>
                    </select>
                    <input
                        type="number"
                        placeholder="Display Order"
                        value={form.order}
                        onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) || 1 })}
                        min={1}
                        className="w-full rounded-lg border border-foreground/20 bg-foreground/5 px-3 py-2 text-foreground placeholder-foreground/50"
                    />
                    <input
                        type="email"
                        placeholder="Notification Email (optional)"
                        value={form.notificationEmail}
                        onChange={(e) => setForm({ ...form, notificationEmail: e.target.value })}
                        className="w-full rounded-lg border border-foreground/20 bg-foreground/5 px-3 py-2 text-foreground placeholder-foreground/50"
                    />
                    
                    {tasks.length > 0 && (
                        <div>
                            <label className="text-sm text-foreground/50 block mb-2">
                                Cleaning Tasks
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                                {tasks.map((task) => (
                                    <div
                                        key={task.taskId}
                                        onClick={() => handleTaskToggle(task)}
                                        className="flex items-center gap-2 cursor-pointer p-2 rounded-lg bg-foreground/5 hover:bg-foreground/10"
                                    >
                                        <div
                                            className={`w-5 h-5 rounded border ${
                                                selectedTasks.some((t) => t.taskId === task.taskId)
                                                    ? "bg-brand border-brand"
                                                    : "border-foreground/30"
                                            } flex items-center justify-center`}
                                        >
                                            {selectedTasks.some((t) => t.taskId === task.taskId) && (
                                                <i className="bi bi-check text-foreground text-xs"></i>
                                            )}
                                        </div>
                                        <span className="text-sm text-foreground">{task.taskName}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
                <div className="flex gap-3 mt-6">
                    <button
                        onClick={() => onDelete && onDelete(bathroom.bathroomId)}
                        className="rounded-lg bg-red-500/20 px-4 py-2 text-red-400 font-semibold hover:bg-red-500/30"
                    >
                        <i className="bi bi-trash"></i>
                    </button>
                    <button
                        onClick={() => setOpenEditBathroom(null)}
                        className="flex-1 rounded-lg bg-foreground/5 px-4 py-2 text-foreground font-semibold hover:bg-foreground/10"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={loading || !form.name.trim()}
                        className="flex-1 rounded-lg bg-brand px-4 py-2 text-foreground font-semibold hover:bg-brand/80 disabled:opacity-50"
                    >
                        {loading ? "Saving..." : "Save Changes"}
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
}
