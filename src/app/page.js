import Link from "next/link";
import { auth } from "@/lib/auth";

export default async function Home() {
    const session = await auth();

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-900 p-6">
            <div className="flex w-full max-w-3xl flex-col items-center rounded-3xl border border-emerald-500/70 bg-slate-800/60 p-10 shadow-2xl">
                <div className="text-5xl font-extrabold">
                    <span className="text-emerald-500">Lav</span>
                    <span className="text-white">Tracker</span>
                </div>
                <div className="mt-10 grid w-full gap-4">
                    <Link
                        href="/branches"
                        className="flex h-14 items-center justify-center rounded-xl bg-slate-700 text-lg font-semibold text-white transition hover:bg-slate-600"
                    >
                        Select Branch
                    </Link>
                    {session?.user ? (
                        <>
                            <Link
                                href="/manage/branches"
                                className="flex h-14 items-center justify-center rounded-xl bg-slate-700 text-lg font-semibold text-white transition hover:bg-slate-600"
                            >
                                Manage Branches
                            </Link>
                            <Link
                                href="/manage/tasks"
                                className="flex h-14 items-center justify-center rounded-xl bg-slate-700 text-lg font-semibold text-white transition hover:bg-slate-600"
                            >
                                Cleaning Tasks
                            </Link>
                            <Link
                                href="/manage/users"
                                className="flex h-14 items-center justify-center rounded-xl bg-slate-700 text-lg font-semibold text-white transition hover:bg-slate-600"
                            >
                                Manage Users
                            </Link>
                        </>
                    ) : (
                        <Link
                            href="/login"
                            className="flex h-14 items-center justify-center rounded-xl bg-slate-700 text-lg font-semibold text-white transition hover:bg-slate-600"
                        >
                            Log In
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
}
