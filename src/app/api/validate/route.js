import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request) {
    const body = await request.json();
    const { code } = body;
    if (!code) {
        return NextResponse.json(
            { isValid: false, message: "Code required." },
            { status: 400 }
        );
    }

    const user = await prisma.user.findFirst({ where: { code } });
    if (!user) {
        return NextResponse.json(
            { valid: false, message: "Invalid code." },
            { status: 200 }
        );
    }

    return NextResponse.json(
        { valid: true, userId: user.id, name: user.name || user.username },
        { status: 200 }
    );
}
