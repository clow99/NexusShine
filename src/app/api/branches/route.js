import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getBranches } from "@/lib/bathrooms";

export async function GET() {
    const branches = await getBranches();
    return NextResponse.json({ success: true, branches });
}

export async function POST(request) {
    const session = await auth();
    if (!session) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, address, toNotificationEmails, ccNotificationEmails } = body;

    if (!name) {
        return NextResponse.json(
            { message: "Name is required" },
            { status: 400 }
        );
    }

    const branch = await prisma.branch.create({
        data: {
            name,
            address,
            toNotificationEmails: toNotificationEmails ?? "",
            ccNotificationEmails: ccNotificationEmails ?? "",
            active: 1,
        },
        include: {
            locations: true,
        },
    });

    return NextResponse.json(
        {
            success: true,
            message: "Branch created successfully",
            branch,
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
    const {
        branchId,
        name,
        address,
        toNotificationEmails,
        ccNotificationEmails,
    } = body;

    if (!branchId) {
        return NextResponse.json(
            { message: "branchId required" },
            { status: 400 }
        );
    }

    await prisma.branch.update({
        where: { branchId },
        data: {
            name,
            address,
            toNotificationEmails,
            ccNotificationEmails,
        },
    });

    const branches = await getBranches();
    return NextResponse.json(
        {
            success: true,
            message: "Branch updated successfully",
            branches,
        },
        { status: 200 }
    );
}

export async function DELETE(request) {

    const { searchParams } = new URL(request.url);
    const branchId = Number(searchParams.get("branchId"));

    if (!branchId) {
        return NextResponse.json(
            { message: "branchId required" },
            { status: 400 }
        );
    }

    await prisma.branch.delete({
        where: { branchId },
    });

    const branches = await getBranches();
    return NextResponse.json(
        {
            success: true,
            message: "Branch deleted successfully",
            branches,
        },
        { status: 200 }
    );
}
