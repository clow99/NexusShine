"use client";

import { useState } from "react";
import ThemeModal from "@/components/modals/ThemeModal";

const THEME_OPTIONS = [
    {
        id: "classic",
        name: "Classic",
        description: "Bright, clean, and familiar.",
        colors: {
            background: "#ffffff",
            foreground: "#0b0b0b",
            brand: "#3c98ef",
        },
    },
    {
        id: "ocean",
        name: "Ocean",
        description: "Cool blues with crisp contrast.",
        colors: {
            background: "#e7f4ff",
            foreground: "#0b1b2b",
            brand: "#1d7bd1",
        },
    },
    {
        id: "forest",
        name: "Forest",
        description: "Earthy greens for calm focus.",
        colors: {
            background: "#eef7ef",
            foreground: "#102416",
            brand: "#2f8f4e",
        },
    },
    {
        id: "sunset",
        name: "Sunset",
        description: "Warm tones with vibrant accents.",
        colors: {
            background: "#1f1410",
            foreground: "#f7e7de",
            brand: "#f06543",
        },
    },
    {
        id: "night",
        name: "Night",
        description: "Dark mode with a soft glow.",
        colors: {
            background: "#0e1117",
            foreground: "#f5f7fb",
            brand: "#7c8cff",
        },
    },
    {
        id: "graphite",
        name: "Graphite",
        description: "Deep grey with the original blue accent.",
        colors: {
            background: "#1f1f1f",
            foreground: "#f5f5f5",
            brand: "#3c98ef",
        },
    },
    {
        id: "emerald",
        name: "Emerald",
        description: "Deep navy with emerald highlights.",
        colors: {
            background: "#1b2535",
            foreground: "#f4f7fb",
            brand: "#18c48b",
        },
    },
];

export default function ThemeSelector({ initialTheme = "classic" }) {
    const [open, setOpen] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [selectedTheme, setSelectedTheme] = useState(initialTheme);

    async function handleSelect(themeId) {
        if (saving) return;
        setSaving(true);
        setError("");

        try {
            const res = await fetch("/api/theme", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ theme: themeId }),
            });

            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data.message || "Unable to save theme.");
            }

            setSelectedTheme(themeId);
            if (typeof document !== "undefined") {
                document.documentElement.dataset.theme = themeId;
            }
            setOpen(false);
        } catch (err) {
            setError(err?.message || "Unable to save theme.");
        } finally {
            setSaving(false);
        }
    }

    return (
        <>
            <button
                type="button"
                onClick={() => setOpen(true)}
                className="flex h-14 w-full items-center justify-center rounded-xl bg-foreground/10 text-lg font-semibold text-foreground transition hover:bg-foreground/20"
            >
                Themes
            </button>
            <ThemeModal
                open={open}
                onClose={() => setOpen(false)}
                themes={THEME_OPTIONS}
                selectedTheme={selectedTheme}
                onSelect={handleSelect}
                saving={saving}
                error={error}
            />
        </>
    );
}

