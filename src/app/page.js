import Link from "next/link";
import { auth } from "@/lib/auth";

export default async function Home() {
    const session = await auth();

    return (
        <div className="flex min-h-screen items-center justify-center bg-background p-6 text-foreground">
            <div className="flex w-full max-w-3xl flex-col items-center rounded-3xl border border-brand/70 bg-foreground/5 p-10 shadow-2xl">
                <div className="flex justify-center">
                    <img
                        src="/nexus_shine_logo.png"
                        alt="NexusShine"
                        className="h-20 w-auto"
                    />
                </div>
                <div className="mt-10 grid w-full gap-4">
                    <Link
                        href="/branches"
                        className="flex h-14 items-center justify-center rounded-xl bg-foreground/10 text-lg font-semibold text-foreground transition hover:bg-foreground/20"
                    >
                        Select Branch
                    </Link>
                    {session?.user ? (
                        <>
                            <Link
                                href="/manage/branches"
                                className="flex h-14 items-center justify-center rounded-xl bg-foreground/10 text-lg font-semibold text-foreground transition hover:bg-foreground/20"
                            >
                                Manage Branches
                            </Link>
                            <Link
                                href="/manage/tasks"
                                className="flex h-14 items-center justify-center rounded-xl bg-foreground/10 text-lg font-semibold text-foreground transition hover:bg-foreground/20"
                            >
                                Cleaning Tasks
                            </Link>
                            {session?.user?.isAdmin ? (
                                <Link
                                    href="/manage/settings"
                                    className="flex h-14 items-center justify-center rounded-xl bg-foreground/10 text-lg font-semibold text-foreground transition hover:bg-foreground/20"
                                >
                                    Admin Settings
                                </Link>
                            ) : null}
                        </>
                    ) : (
                        <Link
                            href="/login"
                            className="flex h-14 items-center justify-center rounded-xl bg-foreground/10 text-lg font-semibold text-foreground transition hover:bg-foreground/20"
                        >
                            Log In
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
}
