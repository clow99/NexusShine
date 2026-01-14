import Link from "next/link";
import BathroomsView from "@/components/bathrooms-view";
import { getBathrooms } from "@/lib/bathrooms";
import { prisma } from "@/lib/prisma";

export default async function LocationBathroomsPage({ params }) {
    const locationId = Number(params.locationId);
    const bathrooms = await getBathrooms(locationId);
    const location = await prisma.location.findUnique({
        where: { locationId },
    });

    return (
        <div className="min-h-screen bg-slate-900 p-6">
            <div className="mx-auto max-w-6xl space-y-6">
                <div className="flex items-center justify-between">
                    <Link href="/" className="text-2xl font-bold text-white">
                        <span className="text-emerald-500">Lav</span>Tracker
                    </Link>
                    <Link
                        href={`/locations/${params.branchId}`}
                        className="rounded-xl border border-slate-700 px-3 py-2 text-sm text-slate-200 hover:bg-slate-800"
                    >
                        Back to locations
                    </Link>
                </div>
                <BathroomsView
                    initialBathrooms={bathrooms}
                    locationName={location?.locationName}
                />
            </div>
        </div>
    );
}
