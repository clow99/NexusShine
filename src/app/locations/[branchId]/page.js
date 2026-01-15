import Link from "next/link";
import { getLocations } from "@/lib/bathrooms";
import LocationList from "@/components/location-list";

export default async function LocationsPage({ params }) {
    const resolvedParams = await params;
    const branchId = Number(resolvedParams.branchId);
    const locations = await getLocations(branchId);

    return (
        <div className="min-h-screen bg-background overflow-hidden text-foreground">
            <div className="flex flex-col p-5 py-5 border-[6px] rounded-3xl border-brand min-h-screen overflow-hidden w-full">
                <div className="w-full flex flex-row gap-5 px-5 items-center">
                    <Link
                        href="/branches"
                        className="h-10 w-10 flex items-center justify-center bg-foreground/10 rounded text-foreground hover:bg-foreground/20 transition"
                    >
                        <i className="bi bi-arrow-left"></i>
                    </Link>
                    <div className="text-[30px] mr-auto">
                        <span className="text-foreground font-semibold">
                            Locations
                        </span>
                    </div>
                </div>
                <div className="px-5 overflow-auto max-h-full mt-5">
                    <LocationList locations={locations} branchId={branchId} />
                </div>
            </div>
        </div>
    );
}
