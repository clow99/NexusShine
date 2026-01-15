"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import CameraCapture from "./CameraCapture";

const INSPECTION_OPTIONS = [
    "Toilet Paper",
    "Hand Soap",
    "Paper Towels",
    "Trash",
    "Sanitizer",
    "Cleaning Supplies",
    "Air Freshener",
    "Urinal Cakes",
    "Sanitary Napkin Disposal",
    "Menstrual Products",
    "Smell",
    "Cleanliness",
    "Floors",
    "Mirrors",
    "Disinfectant Wipes",
    "Other: Please Report",
];

export default function InspectModal({
    details,
    openInspect,
    setOpenInspect,
    setDisplayBathrooms,
    takePhotoOnReport = true,
}) {
    const [selectedItems, setSelectedItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const cameraRef = useRef(null);

    function handleItemClick(item) {
        setSelectedItems((prev) =>
            prev.includes(item)
                ? prev.filter((t) => t !== item)
                : [...prev, item]
        );
    }

    async function requestInspection() {
        setLoading(true);
        try {
            let capturedImage = null;
            if (takePhotoOnReport && cameraRef.current) {
                capturedImage = await cameraRef.current.captureImage();
            }

            const res = await fetch("/api/inspection", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    bathroomId: details.bathroomId,
                    locationId: details.locationId,
                    items: selectedItems,
                    image: capturedImage,
                }),
            });

            const data = await res.json();
            if (res.ok) {
                if (data.bathrooms) setDisplayBathrooms(data.bathrooms);
                setSelectedItems([]);
                setOpenInspect(false);
            }
        } catch (err) {
            console.error("Error creating inspection:", err);
        }
        setLoading(false);
    }

    async function clearReport() {
        setLoading(true);
        try {
            const res = await fetch("/api/inspection/clear", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    bathroomId: details.bathroomId,
                    locationId: details.locationId,
                }),
            });

            const data = await res.json();
            if (res.ok) {
                if (data.bathrooms) setDisplayBathrooms(data.bathrooms);
                setSelectedItems([]);
                setOpenInspect(false);
            }
        } catch (err) {
            console.error("Error clearing inspection:", err);
        }
        setLoading(false);
    }

    // Render button based on status
    if (!openInspect) {
        if (details.status === "inspected") {
            return (
                <button
                    onClick={clearReport}
                    disabled={loading}
                    className="flex-1 rounded-lg border border-white/20 bg-white/10/50 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/10 disabled:opacity-50"
                >
                    {loading ? "Clearing..." : "Clear Report"}
                </button>
            );
        }
        return (
            <button
                onClick={() => setOpenInspect(true)}
                className="flex-1 rounded-lg border border-white/20 bg-white/10/50 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
                Report
            </button>
        );
    }

    return (
        <motion.div
            className="fixed inset-0 z-[500] flex flex-col overflow-hidden bg-black/20 p-1 backdrop-blur-sm"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        >
            <motion.div
                className="flex flex-col h-full w-full overflow-auto rounded-3xl border border-foreground/10 bg-background text-foreground shadow-2xl"
                initial={{ scale: 1, opacity: 1 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 1, opacity: 0.9 }}
                transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
            >
                <div className="p-10 flex flex-row items-center gap-5">
                    <div className="flex flex-col">
                        <div className="text-foreground text-2xl font-bold">
                            {details.name}
                        </div>
                        <div className="text-foreground/60">
                            Request Inspection
                        </div>
                    </div>
                    <button
                        onClick={() => setOpenInspect(false)}
                        className="ml-auto"
                    >
                        <i className="bi bi-x-lg text-foreground text-3xl"></i>
                    </button>
                </div>

                {takePhotoOnReport ? (
                    <CameraCapture open={openInspect} ref={cameraRef} />
                ) : (
                    <div className="mx-10 rounded-2xl border border-dashed border-foreground/20 bg-foreground/5 px-6 py-6 text-center text-sm text-foreground/60">
                        Photo capture is disabled by admin settings.
                    </div>
                )}

                <div className="grid grid-cols-2 md:grid-cols-3 gap-6 px-10 mt-8 flex-1">
                    {INSPECTION_OPTIONS.map((option) => (
                        <div
                            key={option}
                            className="flex flex-row items-center gap-3 cursor-pointer"
                            onClick={() => handleItemClick(option)}
                        >
                            {selectedItems.includes(option) ? (
                                <div className="flex items-center text-2xl justify-center h-8 w-8 border border-brand rounded bg-brand/20">
                                    <i className="bi bi-check text-foreground"></i>
                                </div>
                            ) : (
                                <div className="h-8 w-8 border border-brand rounded"></div>
                            )}
                            <div className="text-lg text-foreground font-semibold">
                                {option}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-auto p-10 grid grid-cols-2 gap-5">
                    <button
                        onClick={() => setOpenInspect(false)}
                        className="text-foreground font-semibold bg-foreground/5 h-16 rounded flex items-center justify-center"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={requestInspection}
                        disabled={loading || selectedItems.length === 0}
                        className="text-foreground font-semibold bg-brand h-16 rounded flex items-center justify-center disabled:opacity-50"
                    >
                        {loading ? "Submitting..." : "Report"}
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
}
