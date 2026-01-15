import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getLocations } from "@/lib/bathrooms";

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const branchId = Number(searchParams.get("branchId"));

    if (!branchId) {
        return NextResponse.json(
            { message: "branchId is required" },
            { status: 400 }
        );
    }

    const locations = await getLocations(branchId);
    return NextResponse.json({
        success: true,
        locations,
    });
}

export async function POST(request) {
    const session = await auth();
    if (!session) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { branchId, locationName, locationDescription } = body;

    if (!branchId || !locationName) {
        return NextResponse.json(
            { message: "branchId and locationName are required" },
            { status: 400 }
        );
    }

    const location = await prisma.location.create({
        data: {
            branchId,
            locationName,
            locationDescription,
            active: 1,
        },
        include: {
            bathrooms: true,
        },
    });

    return NextResponse.json(
        {
            success: true,
            message: "Location created successfully",
            location,
        },
        { status: 201 }
    );
}

export async function PATCH(request) {
    const session = await auth();
    if (!session) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { locationId, branchId, locationName, locationDescription } = body;

    if (!locationId || !branchId) {
        return NextResponse.json(
            { message: "locationId and branchId are required" },
            { status: 400 }
        );
    }

    await prisma.location.update({
        where: { locationId },
        data: { locationName, locationDescription },
    });

    const locations = await getLocations(branchId);
    return NextResponse.json(
        {
            success: true,
            message: "Location updated successfully",
            locations,
        },
        { status: 200 }
    );
}

export async function DELETE(request) {

    const { searchParams } = new URL(request.url);
    const locationId = Number(searchParams.get("locationId"));
    const branchId = Number(searchParams.get("branchId"));

    if (!locationId || !branchId) {
        return NextResponse.json(
            { message: "locationId and branchId are required" },
            { status: 400 }
        );
    }

    await prisma.location.update({
        where: { locationId },
        data: { active: 0 },
    });

    const locations = await getLocations(branchId);
    return NextResponse.json(
        {
            success: true,
            message: "Location deleted successfully",
            locations,
        },
        { status: 200 }
    );
}
