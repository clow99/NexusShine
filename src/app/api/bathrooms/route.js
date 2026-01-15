import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getBathrooms } from "@/lib/bathrooms";

async function resequence(locationId) {
    const bathrooms = await prisma.bathroom.findMany({
        where: { locationId },
        orderBy: { order: "asc" },
    });

    for (let index = 0; index < bathrooms.length; index++) {
        const bathroom = bathrooms[index];
        await prisma.bathroom.update({
            where: { bathroomId: bathroom.bathroomId },
            data: { order: index + 1 },
        });
    }
}

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const locationId = Number(searchParams.get("locationId"));

    if (!locationId) {
        return NextResponse.json(
            { message: "locationId required" },
            { status: 400 }
        );
    }

    const bathrooms = await getBathrooms(locationId);
    return NextResponse.json({ success: true, bathrooms });
}

export async function POST(request) {
    const session = await auth();
    if (!session) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { locationId, name, gender, order, taskIds = [], notificationEmail } = body;

    if (!locationId || !name || !gender) {
        return NextResponse.json(
            { message: "locationId, name and gender are required" },
            { status: 400 }
        );
    }

    const bathroom = await prisma.bathroom.create({
        data: {
            locationId,
            name,
            gender,
            order: order ?? 1,
            active: 1,
            notificationEmail: notificationEmail || null,
        },
    });

    if (Array.isArray(taskIds)) {
        for (const taskId of taskIds) {
            await prisma.bathroomTask.create({
                data: {
                    bathroomId: bathroom.bathroomId,
                    taskId: taskId,
                },
            });
        }
    }

    await resequence(locationId);

    // Re-fetch with all relations
    const createdBathroom = await prisma.bathroom.findUnique({
        where: { bathroomId: bathroom.bathroomId },
        include: {
            bathroomTasks: { include: { task: true } },
            cleanings: { take: 10, orderBy: { createdAt: "desc" } },
            inspections: { include: { inspectedItems: true }, take: 1 },
        },
    });

    return NextResponse.json(
        {
            success: true,
            message: "Bathroom created successfully",
            bathroom: createdBathroom,
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
    const { bathroomId, locationId, name, gender, order, tasks = [] } = body;

    if (!bathroomId || !locationId) {
        return NextResponse.json(
            { message: "bathroomId and locationId are required" },
            { status: 400 }
        );
    }

    const current = await prisma.bathroom.findUnique({
        where: { bathroomId },
    });

    if (!current) {
        return NextResponse.json(
            { message: "Bathroom not found" },
            { status: 404 }
        );
    }

    if (current.order !== order) {
        // adjust surrounding orders
        if (current.order < order) {
            await prisma.bathroom.updateMany({
                where: {
                    locationId,
                    order: { gt: current.order, lte: order },
                },
                data: { order: { decrement: 1 } },
            });
        } else {
            await prisma.bathroom.updateMany({
                where: {
                    locationId,
                    order: { lt: current.order, gte: order },
                },
                data: { order: { increment: 1 } },
            });
        }
    }

    await prisma.bathroom.update({
        where: { bathroomId },
        data: { name, gender, order },
    });

    await prisma.bathroomTask.deleteMany({
        where: { bathroomId },
    });

    if (Array.isArray(tasks)) {
        for (const task of tasks) {
            await prisma.bathroomTask.create({
                data: {
                    bathroomId,
                    taskId: task.taskId,
                },
            });
        }
    }

    const bathrooms = await getBathrooms(locationId);
    return NextResponse.json(
        {
            success: true,
            message: "Bathroom updated successfully",
            bathrooms,
        },
        { status: 200 }
    );
}

export async function DELETE(request) {

    const { searchParams } = new URL(request.url);
    const bathroomId = Number(searchParams.get("bathroomId"));
    const locationId = Number(searchParams.get("locationId"));

    if (!bathroomId || !locationId) {
        return NextResponse.json(
            { message: "bathroomId and locationId are required" },
            { status: 400 }
        );
    }

    await prisma.bathroom.delete({ where: { bathroomId } });
    await resequence(locationId);

    const bathrooms = await getBathrooms(locationId);
    return NextResponse.json(
        {
            success: true,
            message: "Bathroom deleted successfully",
            bathrooms,
        },
        { status: 200 }
    );
}
