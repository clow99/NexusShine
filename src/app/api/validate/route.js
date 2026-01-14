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
            { isValid: false, message: "Invalid code." },
            { status: 200 }
        );
    }

    return NextResponse.json(
        { isValid: true, message: "Valid credentials." },
        { status: 200 }
    );
}
