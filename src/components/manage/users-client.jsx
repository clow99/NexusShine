"use client";

import { useState } from "react";
import Link from "next/link";

export default function UsersClient({ initialUsers }) {
    const [users, setUsers] = useState(initialUsers);
    const [form, setForm] = useState({
        username: "",
        email: "",
        code: "",
    });
    const [loading, setLoading] = useState(false);

    async function fetchUsers() {
        const res = await fetch("/api/users", { cache: "no-store" });
        const data = await res.json();
        setUsers(data.users ?? []);
    }

    async function createUser() {
        if (!form.username || !form.email) return;
        setLoading(true);
        await fetch("/api/users", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
        });
        setForm({ username: "", email: "", code: "" });
        await fetchUsers();
        setLoading(false);
    }

    async function updateUser(userId) {
        const username = window.prompt("Username");
        const email = window.prompt("Email");
        const code = window.prompt("Code");
        if (!username || !email) return;
        setLoading(true);
        await fetch("/api/users", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId, username, email, code }),
        });
        await fetchUsers();
        setLoading(false);
    }

    async function deleteUser(userId) {
        if (!window.confirm("Delete user?")) return;
        setLoading(true);
        await fetch(`/api/users?userId=${userId}`, { method: "DELETE" });
        await fetchUsers();
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
                        Add user
                    </h2>
                    <div className="mt-3 grid gap-3 md:grid-cols-3">
                        <input
                            className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white"
                            placeholder="Username"
                            value={form.username}
                            onChange={(e) =>
                                setForm({ ...form, username: e.target.value })
                            }
                        />
                        <input
                            className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white"
                            placeholder="Email"
                            value={form.email}
                            onChange={(e) =>
                                setForm({ ...form, email: e.target.value })
                            }
                        />
                        <input
                            className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white"
                            placeholder="Code"
                            value={form.code}
                            onChange={(e) =>
                                setForm({ ...form, code: e.target.value })
                            }
                        />
                    </div>
                    <button
                        disabled={loading}
                        onClick={createUser}
                        className="mt-4 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-emerald-400 disabled:opacity-50"
                    >
                        Create user
                    </button>
                </div>
                <div className="space-y-3">
                    {users.map((user) => (
                        <div
                            key={user.id}
                            className="rounded-2xl border border-slate-700 bg-slate-800/60 p-4 text-white"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-lg font-semibold">
                                        {user.username}
                                    </div>
                                    <div className="text-sm text-slate-300">
                                        {user.email}
                                    </div>
                                    <div className="text-xs text-slate-400">
                                        Code: {user.code}
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        disabled={loading}
                                        onClick={() => updateUser(user.id)}
                                        className="rounded-lg bg-slate-700 px-3 py-2 text-sm font-semibold hover:bg-slate-600"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        disabled={loading}
                                        onClick={() => deleteUser(user.id)}
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
