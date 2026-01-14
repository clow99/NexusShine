import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function GET() {
    const users = await prisma.user.findMany({
        orderBy: { username: "asc" },
        select: {
            id: true,
            username: true,
            email: true,
            code: true,
            isAdmin: true,
            active: true,
        },
    });
    return NextResponse.json({ users });
}

export async function POST(request) {
    const session = await auth();
    if (!session) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { username, email, code, password } = body;
    if (!username || !email) {
        return NextResponse.json(
            { message: "username and email are required" },
            { status: 400 }
        );
    }

    await prisma.user.create({
        data: {
            username,
            email,
            code,
            password: password ? await bcrypt.hash(password, 10) : "",
        },
    });

    const users = await prisma.user.findMany();
    return NextResponse.json(
        { message: "User created successfully.", users },
        { status: 201 }
    );
}

export async function PATCH(request) {
    const session = await auth();
    if (!session) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { userId, username, email, code, isAdmin, active } = body;
    if (!userId || !username || !email) {
        return NextResponse.json(
            { message: "userId, username and email are required" },
            { status: 400 }
        );
    }

    await prisma.user.update({
        where: { id: userId },
        data: {
            username,
            email,
            code,
            isAdmin: isAdmin ?? 0,
            active: active ?? 1,
        },
    });

    const users = await prisma.user.findMany();
    return NextResponse.json(
        { message: "User updated successfully.", users },
        { status: 200 }
    );
}

export async function DELETE(request) {
    const session = await auth();
    if (!session) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const userId = Number(searchParams.get("userId"));
    if (!userId) {
        return NextResponse.json(
            { message: "userId is required" },
            { status: 400 }
        );
    }

    await prisma.user.delete({ where: { id: userId } });
    const users = await prisma.user.findMany();
    return NextResponse.json(
        { message: "User deleted successfully.", users },
        { status: 200 }
    );
}
