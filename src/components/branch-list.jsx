"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function BranchList({ branches }) {
    return (
        <div className="grid gap-5 md:grid-cols-2">
            {branches.map((branch, index) => (
                <Link key={branch.branchId} href={`/locations/${branch.branchId}`}>
                    <motion.div
                        initial={{ opacity: 0, y: 0 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{
                            duration: 0.3,
                            ease: [0.4, 0, 0.2, 1],
                        }}
                        className="relative flex flex-col border border-foreground/20 rounded-3xl cursor-pointer hover:border-brand/50 transition-colors"
                    >
                        <div className="flex flex-col p-5">
                            <div className="text-foreground text-3xl font-bold">
                                {branch.name}
                            </div>
                            <div>
                                <span className="text-foreground/50 text-sm">
                                    {branch.address}
                                </span>
                            </div>
                        </div>
                    </motion.div>
                </Link>
            ))}
        </div>
    );
}
