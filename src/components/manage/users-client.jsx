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
    const [editOpen, setEditOpen] = useState(false);
    const [editUserId, setEditUserId] = useState(null);
    const [editForm, setEditForm] = useState({
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

    function openEditModal(user) {
        setEditUserId(user.id);
        setEditForm({
            username: user.username ?? "",
            email: user.email ?? "",
            code: user.code ?? "",
        });
        setEditOpen(true);
    }

    function closeEditModal() {
        if (loading) return;
        setEditOpen(false);
        setEditUserId(null);
    }

    async function saveEditUser(event) {
        event?.preventDefault();
        if (!editUserId || !editForm.username || !editForm.email) return;
        setLoading(true);
        await fetch("/api/users", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: editUserId, ...editForm }),
        });
        await fetchUsers();
        setLoading(false);
        closeEditModal();
    }

    async function deleteUser(userId) {
        if (!window.confirm("Delete user?")) return;
        setLoading(true);
        await fetch(`/api/users?userId=${userId}`, { method: "DELETE" });
        await fetchUsers();
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
                        Add user
                    </h2>
                    <div className="mt-3 grid gap-3 md:grid-cols-3">
                        <input
                            className="rounded-lg border border-foreground/10 bg-background px-3 py-2 text-foreground"
                            placeholder="Username"
                            value={form.username}
                            onChange={(e) =>
                                setForm({ ...form, username: e.target.value })
                            }
                        />
                        <input
                            className="rounded-lg border border-foreground/10 bg-background px-3 py-2 text-foreground"
                            placeholder="Email"
                            value={form.email}
                            onChange={(e) =>
                                setForm({ ...form, email: e.target.value })
                            }
                        />
                        <input
                            className="rounded-lg border border-foreground/10 bg-background px-3 py-2 text-foreground"
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
                        className="mt-4 rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand/90 disabled:opacity-50"
                    >
                        Create user
                    </button>
                </div>
                <div className="space-y-3">
                    {users.map((user) => (
                        <div
                            key={user.id}
                            className="rounded-2xl border border-foreground/10 bg-background p-4 text-foreground"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-lg font-semibold">
                                        {user.username}
                                    </div>
                                    <div className="text-sm text-foreground/70">
                                        {user.email}
                                    </div>
                                    <div className="text-xs text-foreground/50">
                                        Code: {user.code}
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        disabled={loading}
                                        onClick={() => openEditModal(user)}
                                        className="rounded-lg bg-foreground/10 px-3 py-2 text-sm font-semibold hover:bg-foreground/20"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        disabled={loading}
                                        onClick={() => deleteUser(user.id)}
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
            {editOpen ? (
                <div
                    className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 p-4"
                    role="dialog"
                    aria-modal="true"
                    aria-label="Edit user"
                >
                    <div className="w-full max-w-lg rounded-2xl border border-foreground/10 bg-background p-5 text-foreground shadow-xl">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold">Edit user</h3>
                            <button
                                onClick={closeEditModal}
                                className="rounded-lg border border-foreground/10 px-2 py-1 text-xs text-foreground/70 hover:bg-foreground/5"
                            >
                                Close
                            </button>
                        </div>
                        <form onSubmit={saveEditUser} className="mt-4 space-y-3">
                            <input
                                className="w-full rounded-lg border border-foreground/10 bg-background px-3 py-2 text-foreground"
                                placeholder="Username"
                                value={editForm.username}
                                onChange={(e) =>
                                    setEditForm({
                                        ...editForm,
                                        username: e.target.value,
                                    })
                                }
                            />
                            <input
                                className="w-full rounded-lg border border-foreground/10 bg-background px-3 py-2 text-foreground"
                                placeholder="Email"
                                value={editForm.email}
                                onChange={(e) =>
                                    setEditForm({
                                        ...editForm,
                                        email: e.target.value,
                                    })
                                }
                            />
                            <input
                                className="w-full rounded-lg border border-foreground/10 bg-background px-3 py-2 text-foreground"
                                placeholder="Code"
                                value={editForm.code}
                                onChange={(e) =>
                                    setEditForm({
                                        ...editForm,
                                        code: e.target.value,
                                    })
                                }
                            />
                            <div className="flex items-center justify-end gap-2 pt-2">
                                <button
                                    type="button"
                                    onClick={closeEditModal}
                                    className="rounded-lg border border-foreground/10 px-3 py-2 text-sm font-semibold text-foreground/70 hover:bg-foreground/5"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand/90 disabled:opacity-50"
                                >
                                    Save changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            ) : null}
        </div>
    );
}
