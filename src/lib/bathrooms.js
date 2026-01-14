import { prisma } from "./prisma";

export async function getBranches() {
    return prisma.branch.findMany({
        where: { active: 1 },
        include: {
            locations: {
                where: { active: 1 },
                include: {
                    bathrooms: {
                        where: { active: 1 },
                        include: {
                            bathroomTasks: {
                                include: { task: true },
                            },
                        },
                        orderBy: { order: "asc" },
                    },
                },
            },
        },
        orderBy: { name: "asc" },
    });
}

export async function getLocations(branchId) {
    return prisma.location.findMany({
        where: { active: 1, branchId },
        include: {
            bathrooms: {
                where: { active: 1 },
                include: {
                    bathroomTasks: { include: { task: true } },
                    cleanings: {
                        include: {
                            tasks: { include: { task: true } },
                            user: true,
                        },
                        take: 10,
                        orderBy: { createdAt: "desc" },
                    },
                    inspections: {
                        include: { inspectedItems: true },
                        orderBy: { inspectionId: "desc" },
                        take: 1,
                    },
                },
                orderBy: { order: "asc" },
            },
        },
        orderBy: { locationName: "asc" },
    });
}

export async function getBathrooms(locationId) {
    return prisma.bathroom.findMany({
        where: { active: 1, locationId },
        include: {
            bathroomTasks: { include: { task: true } },
            cleanings: {
                include: {
                    tasks: { include: { task: true } },
                    user: true,
                },
                take: 10,
                orderBy: { createdAt: "desc" },
            },
            inspections: {
                include: { inspectedItems: true },
                orderBy: { inspectionId: "desc" },
                take: 1,
            },
        },
        orderBy: { order: "asc" },
    });
}

export async function getBathroom(bathroomId) {
    return prisma.bathroom.findFirst({
        where: { active: 1, bathroomId },
        include: {
            bathroomTasks: { include: { task: true } },
            cleanings: {
                include: {
                    tasks: { include: { task: true } },
                    user: true,
                },
                take: 10,
                orderBy: { createdAt: "desc" },
            },
            inspections: {
                include: { inspectedItems: true },
                orderBy: { inspectionId: "desc" },
                take: 1,
            },
            location: true,
        },
    });
}
