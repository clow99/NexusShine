"use client";

import { useState } from "react";
import Link from "next/link";

export default function TasksClient({ initialTasks }) {
    const [tasks, setTasks] = useState(initialTasks);
    const [form, setForm] = useState({ taskName: "", taskDescription: "" });
    const [loading, setLoading] = useState(false);

    async function fetchTasks() {
        const res = await fetch("/api/tasks", { cache: "no-store" });
        const data = await res.json();
        setTasks(data.tasks ?? []);
    }

    async function createTask() {
        if (!form.taskName) return;
        setLoading(true);
        await fetch("/api/tasks", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
        });
        setForm({ taskName: "", taskDescription: "" });
        await fetchTasks();
        setLoading(false);
    }

    async function updateTask(taskId) {
        const name = window.prompt("Task name", "");
        if (!name) return;
        setLoading(true);
        await fetch("/api/tasks", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ taskId, taskName: name }),
        });
        await fetchTasks();
        setLoading(false);
    }

    async function deleteTask(taskId) {
        if (!window.confirm("Delete task?")) return;
        setLoading(true);
        await fetch(`/api/tasks?taskId=${taskId}`, { method: "DELETE" });
        await fetchTasks();
        setLoading(false);
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
                        Add task
                    </h2>
                    <div className="mt-3 grid gap-3 md:grid-cols-2">
                        <input
                            className="rounded-lg border border-foreground/10 bg-background px-3 py-2 text-foreground"
                            placeholder="Task name"
                            value={form.taskName}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    taskName: e.target.value,
                                })
                            }
                        />
                        <input
                            className="rounded-lg border border-foreground/10 bg-background px-3 py-2 text-foreground"
                            placeholder="Description"
                            value={form.taskDescription}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    taskDescription: e.target.value,
                                })
                            }
                        />
                    </div>
                    <button
                        disabled={loading}
                        onClick={createTask}
                        className="mt-4 rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand/90 disabled:opacity-50"
                    >
                        Create task
                    </button>
                </div>
                <div className="space-y-3">
                    {tasks.map((task) => (
                        <div
                            key={task.taskId}
                            className="rounded-2xl border border-foreground/10 bg-background p-4 text-foreground"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-lg font-semibold">
                                        {task.taskName}
                                    </div>
                                    <div className="text-sm text-foreground/70">
                                        {task.taskDescription}
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        disabled={loading}
                                        onClick={() => updateTask(task.taskId)}
                                        className="rounded-lg bg-foreground/10 px-3 py-2 text-sm font-semibold hover:bg-foreground/20"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        disabled={loading}
                                        onClick={() => deleteTask(task.taskId)}
                                        className="rounded-lg bg-red-500 px-3 py-2 text-sm font-semibold text-foreground hover:bg-red-400"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
