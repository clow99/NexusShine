import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DEFAULT_APP_SETTINGS } from "@/lib/settings";

function normalizeSettings(settings) {
    if (!settings) {
        return DEFAULT_APP_SETTINGS;
    }
    return {
        theme: settings.theme || DEFAULT_APP_SETTINGS.theme,
        takePhotoOnReport: settings.takePhotoOnReport === 1,
    };
}

export async function GET() {
    const settings = await prisma.appSetting.findFirst();
    return NextResponse.json({ settings: normalizeSettings(settings) });
}

export async function PATCH(request) {
    const session = await auth();
    if (!session?.user?.isAdmin) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    const body = await request.json();
    const takePhotoOnReport = body?.takePhotoOnReport;

    if (typeof takePhotoOnReport !== "boolean") {
        return NextResponse.json(
            { message: "takePhotoOnReport must be a boolean" },
            { status: 400 }
        );
    }

    const existing = await prisma.appSetting.findFirst();
    const updated = existing
        ? await prisma.appSetting.update({
              where: { id: existing.id },
              data: { takePhotoOnReport: takePhotoOnReport ? 1 : 0 },
          })
        : await prisma.appSetting.create({
              data: { takePhotoOnReport: takePhotoOnReport ? 1 : 0 },
          });

    return NextResponse.json({ settings: normalizeSettings(updated) });
}

