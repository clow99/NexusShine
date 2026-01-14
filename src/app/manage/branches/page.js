import { getBranches } from "@/lib/bathrooms";
import BranchesClient from "@/components/manage/branches-client";

export default async function ManageBranchesPage() {
    const branches = await getBranches();
    return <BranchesClient initialBranches={branches} />;
}
