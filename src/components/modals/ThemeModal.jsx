"use client";

import { motion } from "framer-motion";

export default function ThemeModal({
    open,
    onClose,
    themes,
    selectedTheme,
    onSelect,
    saving,
    error,
}) {
    if (!open) return null;

    return (
        <motion.div
            className="fixed inset-0 z-[600] flex items-center justify-center bg-black/40 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
        >
            <motion.div
                className="w-full max-w-2xl rounded-3xl border border-brand/30 bg-background text-foreground shadow-2xl"
                initial={{ scale: 0.96, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.96, opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={(event) => event.stopPropagation()}
            >
                <div className="flex items-center gap-4 border-b border-foreground/10 px-6 py-5">
                    <div className="text-xl font-semibold">Choose a theme</div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="ml-auto text-foreground"
                        aria-label="Close theme selector"
                    >
                        <i className="bi bi-x-lg text-2xl"></i>
                    </button>
                </div>

                <div className="grid gap-4 p-6 md:grid-cols-2">
                    {themes.map((theme) => {
                        const isActive = theme.id === selectedTheme;
                        return (
                            <button
                                key={theme.id}
                                type="button"
                                disabled={saving}
                                onClick={() => onSelect(theme.id)}
                                className={`flex w-full flex-col gap-3 rounded-2xl border p-4 text-left transition ${
                                    isActive
                                        ? "border-brand bg-brand/10"
                                        : "border-foreground/10 bg-foreground/5 hover:bg-foreground/10"
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <span
                                        className="h-5 w-5 rounded-full border"
                                        style={{
                                            backgroundColor: theme.colors.brand,
                                            borderColor: theme.colors.foreground,
                                        }}
                                    ></span>
                                    <span className="text-lg font-semibold">
                                        {theme.name}
                                    </span>
                                </div>
                                <div className="text-sm text-foreground/70">
                                    {theme.description}
                                </div>
                                <div className="flex gap-2">
                                    <span
                                        className="h-4 w-10 rounded-full border"
                                        style={{
                                            backgroundColor:
                                                theme.colors.background,
                                            borderColor: theme.colors.brand,
                                        }}
                                    ></span>
                                    <span
                                        className="h-4 w-10 rounded-full border"
                                        style={{
                                            backgroundColor:
                                                theme.colors.foreground,
                                            borderColor: theme.colors.brand,
                                        }}
                                    ></span>
                                </div>
                            </button>
                        );
                    })}
                </div>

                {error ? (
                    <div className="px-6 pb-6 text-sm text-red-500">
                        {error}
                    </div>
                ) : null}
            </motion.div>
        </motion.div>
    );
}

