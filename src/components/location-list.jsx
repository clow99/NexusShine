"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function LocationList({ locations, branchId }) {
    return (
        <div className="grid gap-5 md:grid-cols-2">
            {locations.map((location, index) => (
                <Link
                    key={location.locationId}
                    href={`/locations/${branchId}/bathrooms/${location.locationId}`}
                    className="h-full"
                >
                    <motion.div
                        initial={{ opacity: 0, y: 0 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{
                            duration: 0.3,
                            ease: [0.4, 0, 0.2, 1],
                        }}
                        className="relative flex flex-col border border-foreground/20 h-[175px] rounded-3xl cursor-pointer hover:border-brand/50 transition-colors"
                    >
                        <div className="flex flex-col p-5 h-full">
                            <div className="text-foreground text-2xl font-bold">
                                {location.locationName}
                            </div>
                            <div className="text-foreground/60 mt-2">
                                {location.locationDescription || ""}
                            </div>
                        </div>
                    </motion.div>
                </Link>
            ))}
            {locations.length === 0 && (
                <div className="col-span-full rounded-3xl border border-dashed border-foreground/20 p-8 text-center text-foreground/50">
                    No locations found.
                </div>
            )}
        </div>
    );
}
