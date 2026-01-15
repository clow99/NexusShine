import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AuthSessionProvider from "@/components/session-provider";
import { getAppSettings } from "@/lib/settings";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata = {
    title: "NexusShine",
    description: "Nexus Shine migrated to Next.js",
};

export default async function RootLayout({ children }) {
    const settings = await getAppSettings();
    const theme = settings.theme;

    return (
        <html lang="en" data-theme={theme}>
            <head>
                <link
                    rel="stylesheet"
                    href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css"
                />
            </head>
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground min-h-screen`}
            >
                <AuthSessionProvider>{children}</AuthSessionProvider>
            </body>
        </html>
    );
}
