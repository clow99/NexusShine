import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendInspectionFailEmail } from "@/lib/email";
import { subHours } from "date-fns";

export async function POST() {
    const staleInspections = await prisma.inspection.findMany({
        where: {
            inspectionDate: { lte: subHours(new Date(), 1) },
        },
        include: {
            bathroom: {
                include: {
                    location: { include: { branch: true } },
                },
            },
            inspectedItems: true,
        },
    });

    if (staleInspections.length === 0) {
        return NextResponse.json(
            { success: false, message: "No reminder needed at this time" },
            { status: 200 }
        );
    }

    for (const inspection of staleInspections) {
        const branch = inspection.bathroom.location.branch;
        const toEmails =
            branch?.toNotificationEmails?.split(",").map((e) => e.trim()) ?? [];
        const ccEmails =
            branch?.ccNotificationEmails?.split(",").map((e) => e.trim()) ?? [];

        if (toEmails.length === 0) continue;

        const html = `
        <h2>LavTracker Inspection Reminder</h2>
        <p>Branch: ${branch.name}</p>
        <p>Location: ${inspection.bathroom.location.locationName}</p>
        <p>Bathroom: ${inspection.bathroom.name}</p>
        <p>Status: inspected</p>
        <ul>${inspection.inspectedItems
            .map((i) => `<li>${i.inspectionReason}</li>`)
            .join("")}</ul>
        `;

        await sendInspectionFailEmail({
            to: toEmails,
            cc: ccEmails,
            subject: "LavTracker - Inspection Reminder",
            html,
        });

        await prisma.inspection.update({
            where: { inspectionId: inspection.inspectionId },
            data: { updatedAt: new Date() },
        });
    }

    return NextResponse.json(
        { success: true, message: "Reminder emails sent successfully" },
        { status: 201 }
    );
}
