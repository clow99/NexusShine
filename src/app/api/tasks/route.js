import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
    const tasks = await prisma.task.findMany({ orderBy: { taskName: "asc" } });
    return NextResponse.json({ tasks });
}

export async function POST(request) {
    const session = await auth();
    if (!session) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { taskName, taskDescription } = body;
    if (!taskName) {
        return NextResponse.json(
            { message: "taskName is required" },
            { status: 400 }
        );
    }

    await prisma.task.create({
        data: { taskName, taskDescription },
    });

    const tasks = await prisma.task.findMany({ orderBy: { taskName: "asc" } });
    return NextResponse.json(
        { message: "Task created successfully.", tasks },
        { status: 201 }
    );
}

export async function PATCH(request) {
    const session = await auth();
    if (!session) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { taskId, taskName, taskDescription } = body;
    if (!taskId || !taskName) {
        return NextResponse.json(
            { message: "taskId and taskName are required" },
            { status: 400 }
        );
    }

    await prisma.task.update({
        where: { taskId },
        data: { taskName, taskDescription },
    });

    const tasks = await prisma.task.findMany({ orderBy: { taskName: "asc" } });
    return NextResponse.json(
        { message: "Task updated successfully.", tasks },
        { status: 200 }
    );
}

export async function DELETE(request) {
    const session = await auth();
    if (!session) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const taskId = Number(searchParams.get("taskId"));
    if (!taskId) {
        return NextResponse.json(
            { message: "taskId is required" },
            { status: 400 }
        );
    }

    await prisma.task.delete({ where: { taskId } });
    const tasks = await prisma.task.findMany({ orderBy: { taskName: "asc" } });
    return NextResponse.json(
        { message: "Task deleted successfully.", tasks },
        { status: 200 }
    );
}
