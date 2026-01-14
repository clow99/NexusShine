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
        <div className="min-h-screen bg-slate-900 p-6">
            <div className="mx-auto max-w-5xl space-y-6">
                <div className="flex items-center justify-between">
                    <Link href="/" className="text-2xl font-bold text-white">
                        <span className="text-emerald-500">Lav</span>Tracker
                    </Link>
                    <Link
                        href="/"
                        className="rounded-xl border border-slate-700 px-3 py-2 text-sm text-slate-200 hover:bg-slate-800"
                    >
                        Back home
                    </Link>
                </div>
                <div className="rounded-2xl border border-slate-700 bg-slate-800/60 p-5 shadow">
                    <h2 className="text-xl font-semibold text-white">
                        Add task
                    </h2>
                    <div className="mt-3 grid gap-3 md:grid-cols-2">
                        <input
                            className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white"
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
                            className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white"
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
                        className="mt-4 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-emerald-400 disabled:opacity-50"
                    >
                        Create task
                    </button>
                </div>
                <div className="space-y-3">
                    {tasks.map((task) => (
                        <div
                            key={task.taskId}
                            className="rounded-2xl border border-slate-700 bg-slate-800/60 p-4 text-white"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-lg font-semibold">
                                        {task.taskName}
                                    </div>
                                    <div className="text-sm text-slate-300">
                                        {task.taskDescription}
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        disabled={loading}
                                        onClick={() => updateTask(task.taskId)}
                                        className="rounded-lg bg-slate-700 px-3 py-2 text-sm font-semibold hover:bg-slate-600"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        disabled={loading}
                                        onClick={() => deleteTask(task.taskId)}
                                        className="rounded-lg bg-red-500 px-3 py-2 text-sm font-semibold text-white hover:bg-red-400"
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
