import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getBathroom, getBathrooms } from "@/lib/bathrooms";

export async function POST(request) {
    const body = await request.json();
    const { bathroomId, tasks = [], code } = body;

    if (!bathroomId || !Array.isArray(tasks)) {
        return NextResponse.json(
            { message: "bathroomId and tasks are required" },
            { status: 400 }
        );
    }

    const user = await prisma.user.findFirst({ where: { code } });
    if (!user) {
        return NextResponse.json(
            { message: "Invalid code" },
            { status: 400 }
        );
    }

    const cleaning = await prisma.cleaning.create({
        data: {
            bathroomId,
            userId: user.id,
        },
    });

    for (const task of tasks) {
        await prisma.cleaningTask.create({
            data: {
                cleaningId: cleaning.cleaningId,
                taskId: task.taskId,
            },
        });
    }

    await prisma.bathroom.update({
        where: { bathroomId },
        data: { status: "open" },
    });

    const bathroom = await getBathroom(bathroomId);
    const bathrooms = await getBathrooms(bathroom.locationId);

    return NextResponse.json(
        {
            success: true,
            message: "Cleaning completed successfully",
            cleanings: bathroom.cleanings,
            bathrooms,
        },
        { status: 201 }
    );
}
