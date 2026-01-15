import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const ALLOWED_THEMES = new Set([
    "classic",
    "ocean",
    "forest",
    "sunset",
    "night",
    "graphite",
    "emerald",
]);

export async function PATCH(request) {
    const session = await auth();
    if (!session?.user?.isAdmin) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    const body = await request.json();
    const theme = body?.theme;
    if (!ALLOWED_THEMES.has(theme)) {
        return NextResponse.json(
            { message: "Invalid theme selection" },
            { status: 400 }
        );
    }

    const existing = await prisma.appSetting.findFirst();
    const settings = existing
        ? await prisma.appSetting.update({
              where: { id: existing.id },
              data: { theme },
          })
        : await prisma.appSetting.create({
              data: { theme },
          });

    return NextResponse.json({ theme: settings.theme });
}

