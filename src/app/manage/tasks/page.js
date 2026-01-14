import { prisma } from "@/lib/prisma";
import TasksClient from "@/components/manage/tasks-client";

export default async function ManageTasksPage() {
    const tasks = await prisma.task.findMany({ orderBy: { taskName: "asc" } });
    return <TasksClient initialTasks={tasks} />;
}
