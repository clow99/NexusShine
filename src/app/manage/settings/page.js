import { auth } from "@/lib/auth";
import { getAppSettings } from "@/lib/settings";
import SettingsClient from "@/components/manage/settings-client";

export default async function ManageSettingsPage() {
    const session = await auth();
    if (!session?.user?.isAdmin) {
        return (
            <div className="min-h-screen bg-background p-6 text-foreground">
                <div className="mx-auto max-w-3xl rounded-2xl border border-foreground/10 bg-background p-6 text-center shadow">
                    <h2 className="text-xl font-semibold">Unauthorized</h2>
                    <p className="mt-2 text-sm text-foreground/60">
                        You do not have permission to view admin settings.
                    </p>
                </div>
            </div>
        );
    }

    const settings = await getAppSettings();
    return <SettingsClient initialSettings={settings} />;
}

