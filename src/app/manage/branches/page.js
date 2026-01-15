import { getBranches } from "@/lib/bathrooms";
import { prisma } from "@/lib/prisma";
import BranchesClient from "@/components/manage/branches-client";

export default async function ManageBranchesPage() {
    const branches = await getBranches();
    const tasks = await prisma.task.findMany({
        orderBy: { taskName: "asc" },
    });
    
    return <BranchesClient initialBranches={branches} tasks={tasks} />;
}
