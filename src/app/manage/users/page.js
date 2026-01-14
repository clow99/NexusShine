import { prisma } from "@/lib/prisma";
import UsersClient from "@/components/manage/users-client";

export default async function ManageUsersPage() {
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
    return <UsersClient initialUsers={users} />;
}
