import Link from "next/link";
import { getBranches } from "@/lib/bathrooms";
import { motion } from "framer-motion";

export default async function BranchesPage() {
    const branches = await getBranches();

    return (
        <div className="min-h-screen bg-slate-900 p-8">
            <div className="mx-auto max-w-5xl">
                <div className="mb-8 flex items-center justify-between">
                    <Link href="/" className="text-2xl font-bold text-white">
                        <span className="text-emerald-500">Lav</span>Tracker
                    </Link>
                    <Link
                        href="/"
                        className="rounded-xl border border-slate-700 px-3 py-2 text-sm text-slate-200 hover:bg-slate-800"
                    >
                        Back
                    </Link>
                </div>
                <h1 className="text-3xl font-bold text-white mb-6">
                    Select a Branch
                </h1>
                <div className="grid gap-6 md:grid-cols-2">
                    {branches.map((branch) => (
                        <motion.div
                            key={branch.branchId}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="rounded-2xl border border-slate-700 bg-slate-800/60 p-5 shadow"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-xl font-semibold text-white">
                                        {branch.name}
                                    </div>
                                    <div className="text-sm text-slate-300">
                                        {branch.address}
                                    </div>
                                </div>
                                <Link
                                    href={`/locations/${branch.branchId}`}
                                    className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-emerald-400"
                                >
                                    Open
                                </Link>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
