import Link from "next/link";
import { getLocations } from "@/lib/bathrooms";
import { motion } from "framer-motion";

export default async function LocationsPage({ params }) {
    const branchId = Number(params.branchId);
    const locations = await getLocations(branchId);

    return (
        <div className="min-h-screen bg-slate-900 p-8">
            <div className="mx-auto max-w-6xl">
                <div className="mb-6 flex items-center justify-between">
                    <Link href="/" className="text-2xl font-bold text-white">
                        <span className="text-emerald-500">Lav</span>Tracker
                    </Link>
                    <div className="flex items-center gap-3">
                        <Link
                            href="/branches"
                            className="rounded-xl border border-slate-700 px-3 py-2 text-sm text-slate-200 hover:bg-slate-800"
                        >
                            Back to branches
                        </Link>
                    </div>
                </div>
                <h1 className="text-3xl font-bold text-white mb-4">
                    Locations
                </h1>
                <div className="grid gap-5 md:grid-cols-2">
                    {locations.map((location) => (
                        <motion.div
                            key={location.locationId}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="rounded-2xl border border-slate-700 bg-slate-800/60 p-5 shadow"
                        >
                            <div className="flex items-start justify-between">
                                <div>
                                    <div className="text-xl font-semibold text-white">
                                        {location.locationName}
                                    </div>
                                    <div className="text-sm text-slate-300">
                                        {location.locationDescription}
                                    </div>
                                </div>
                                <Link
                                    href={`/locations/${branchId}/bathrooms/${location.locationId}`}
                                    className="rounded-lg bg-emerald-500 px-3 py-2 text-sm font-semibold text-slate-900 hover:bg-emerald-400"
                                >
                                    View
                                </Link>
                            </div>
                            <div className="mt-3 text-sm text-slate-300">
                                {location.bathrooms.length} bathrooms
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
