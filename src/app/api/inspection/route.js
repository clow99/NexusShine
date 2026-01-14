import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getBathrooms } from "@/lib/bathrooms";
import { randomUUID } from "crypto";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { sendInspectionFailEmail } from "@/lib/email";

const publicDir = join(process.cwd(), "public", "inspections");

async function saveBase64Image(image) {
    if (!image) return null;

    let base64 = image;
    let extension = "png";
    const match = /^data:image\/(\w+);base64,/.exec(image);
    if (match) {
        extension = match[1];
        base64 = image.split(",")[1];
    }

    const buffer = Buffer.from(base64, "base64");
    await mkdir(publicDir, { recursive: true });
    const fileName = `${randomUUID()}.${extension}`;
    const filePath = join(publicDir, fileName);
    await writeFile(filePath, buffer);
    return `/inspections/${fileName}`;
}

export async function POST(request) {
    const body = await request.json();
    const { bathroomId, locationId, items = [], image } = body;

    if (!bathroomId || !locationId) {
        return NextResponse.json(
            { message: "bathroomId and locationId are required" },
            { status: 400 }
        );
    }

    const imagePath = await saveBase64Image(image);

    const inspection = await prisma.inspection.create({
        data: {
            bathroomId,
            imageUrl: imagePath ?? "",
            inspectionDate: new Date(),
        },
    });

    for (const reason of items) {
        await prisma.inspectionItem.create({
            data: {
                inspectionId: inspection.inspectionId,
                inspectionReason: reason,
            },
        });
    }

    await prisma.bathroom.update({
        where: { bathroomId },
        data: { status: "inspected" },
    });

    const bathroomDetails = await prisma.bathroom.findUnique({
        where: { bathroomId },
        include: { location: { include: { branch: true } } },
    });

    const branch = bathroomDetails?.location?.branch;
    const toEmails =
        branch?.toNotificationEmails?.split(",").map((e) => e.trim()) ?? [];
    const ccEmails =
        branch?.ccNotificationEmails?.split(",").map((e) => e.trim()) ?? [];

    const inspectionItems = await prisma.inspectionItem.findMany({
        where: { inspectionId: inspection.inspectionId },
    });

    if (branch && toEmails.length > 0) {
        const html = `
        <h2>LavTracker Inspection Alert</h2>
        <p>Branch: ${branch.name}</p>
        <p>Location: ${bathroomDetails.location.locationName}</p>
        <p>Bathroom: ${bathroomDetails.name}</p>
        <p>Status: inspected</p>
        <ul>${inspectionItems
            .map((i) => `<li>${i.inspectionReason}</li>`)
            .join("")}</ul>
        ${imagePath ? `<p>Image: ${imagePath}</p>` : ""}
        `;

        await sendInspectionFailEmail({
            to: toEmails,
            cc: ccEmails,
            subject: "LavTracker - Inspection Failed",
            html,
        });
    }

    const bathrooms = await getBathrooms(locationId);

    return NextResponse.json(
        {
            success: true,
            message: "Inspection completed successfully",
            bathrooms,
        },
        { status: 201 }
    );
}
