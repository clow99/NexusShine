import { prisma } from "./prisma";

export const DEFAULT_APP_SETTINGS = {
    theme: "classic",
    takePhotoOnReport: true,
};

export async function getAppSettings() {
    const settings = await prisma.appSetting.findFirst();
    if (!settings) {
        return DEFAULT_APP_SETTINGS;
    }

    return {
        theme: settings.theme || DEFAULT_APP_SETTINGS.theme,
        takePhotoOnReport: settings.takePhotoOnReport === 1,
    };
}

