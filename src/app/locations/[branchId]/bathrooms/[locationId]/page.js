import BathroomsView from "@/components/bathrooms-view";
import { getBathrooms } from "@/lib/bathrooms";
import { prisma } from "@/lib/prisma";
import { getAppSettings } from "@/lib/settings";

export default async function LocationBathroomsPage({ params }) {
    const resolvedParams = await params;
    const locationId = Number(resolvedParams.locationId);
    const branchId = Number(resolvedParams.branchId);
    const bathrooms = await getBathrooms(locationId);
    const settings = await getAppSettings();
    const location = await prisma.location.findUnique({
        where: { locationId },
    });

    return (
        <BathroomsView
            initialBathrooms={bathrooms}
            locationName={location?.locationName}
            branchId={branchId}
            takePhotoOnReport={settings.takePhotoOnReport}
        />
    );
}

