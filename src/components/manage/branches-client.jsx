"use client";

import { useState } from "react";
import Link from "next/link";

export default function BranchesClient({ initialBranches }) {
    const [branches, setBranches] = useState(initialBranches);
    const [form, setForm] = useState({
        name: "",
        address: "",
        toNotificationEmails: "",
        ccNotificationEmails: "",
    });
    const [loading, setLoading] = useState(false);

    async function fetchBranches() {
        const res = await fetch("/api/branches", { cache: "no-store" });
        const data = await res.json();
        setBranches(data.branches ?? []);
    }

    async function createBranch() {
        setLoading(true);
        await fetch("/api/branches", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
        });
        setForm({
            name: "",
            address: "",
            toNotificationEmails: "",
            ccNotificationEmails: "",
        });
        await fetchBranches();
        setLoading(false);
    }

    async function updateBranch(branchId) {
        const name = window.prompt("Branch name", "");
        if (!name) return;
        setLoading(true);
        await fetch("/api/branches", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ branchId, name }),
        });
        await fetchBranches();
        setLoading(false);
    }

    async function deleteBranch(branchId) {
        if (!window.confirm("Delete branch?")) return;
        setLoading(true);
        await fetch(`/api/branches?branchId=${branchId}`, {
            method: "DELETE",
        });
        await fetchBranches();
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
                        Add branch
                    </h2>
                    <div className="mt-3 grid gap-3 md:grid-cols-2">
                        <input
                            className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white"
                            placeholder="Name"
                            value={form.name}
                            onChange={(e) =>
                                setForm({ ...form, name: e.target.value })
                            }
                        />
                        <input
                            className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white"
                            placeholder="Address"
                            value={form.address}
                            onChange={(e) =>
                                setForm({ ...form, address: e.target.value })
                            }
                        />
                        <input
                            className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white"
                            placeholder="To notification emails (comma separated)"
                            value={form.toNotificationEmails}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    toNotificationEmails: e.target.value,
                                })
                            }
                        />
                        <input
                            className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white"
                            placeholder="CC notification emails (comma separated)"
                            value={form.ccNotificationEmails}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    ccNotificationEmails: e.target.value,
                                })
                            }
                        />
                    </div>
                    <button
                        disabled={loading}
                        onClick={createBranch}
                        className="mt-4 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-emerald-400 disabled:opacity-50"
                    >
                        Create branch
                    </button>
                </div>
                <div className="space-y-3">
                    {branches.map((branch) => (
                        <div
                            key={branch.branchId}
                            className="rounded-2xl border border-slate-700 bg-slate-800/60 p-4 text-white"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-lg font-semibold">
                                        {branch.name}
                                    </div>
                                    <div className="text-sm text-slate-300">
                                        {branch.address}
                                    </div>
                                    <div className="text-xs text-slate-400">
                                        To: {branch.toNotificationEmails}
                                    </div>
                                    <div className="text-xs text-slate-400">
                                        CC: {branch.ccNotificationEmails}
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        disabled={loading}
                                        onClick={() =>
                                            updateBranch(branch.branchId)
                                        }
                                        className="rounded-lg bg-slate-700 px-3 py-2 text-sm font-semibold hover:bg-slate-600"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        disabled={loading}
                                        onClick={() =>
                                            deleteBranch(branch.branchId)
                                        }
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
