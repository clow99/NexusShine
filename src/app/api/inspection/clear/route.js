import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getBathrooms } from "@/lib/bathrooms";

export async function POST(request) {
    const body = await request.json();
    const { bathroomId, locationId } = body;

    if (!bathroomId || !locationId) {
        return NextResponse.json(
            { message: "bathroomId and locationId are required" },
            { status: 400 }
        );
    }

    await prisma.bathroom.update({
        where: { bathroomId },
        data: { status: "open" },
    });

    const bathrooms = await getBathrooms(locationId);
    return NextResponse.json(
        {
            success: true,
            message: "Inspection cleared successfully",
            bathrooms,
        },
        { status: 201 }
    );
}
