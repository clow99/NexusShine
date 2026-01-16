"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import CleanModal from "./modals/CleanModal";
import InspectModal from "./modals/InspectModal";

export default function BathroomsView({
    initialBathrooms,
    locationName,
    branchId,
    takePhotoOnReport = true,
}) {
    const [bathrooms, setBathrooms] = useState(initialBathrooms);
    const [message, setMessage] = useState("");
    
    // Modal states
    const [openCleanModal, setOpenCleanModal] = useState(null);
    const [openInspectModal, setOpenInspectModal] = useState(null);
    const [openCleaningDetails, setOpenCleaningDetails] = useState(null);

    // Check if any bathroom has inspected status
    const hasInspectedBathroom = bathrooms.some((b) => b.status === "inspected");

    function formatLastCleaned(date) {
        if (!date) return "No cleanings yet";
        const d = new Date(date);
        const options = { weekday: "short", month: "short", day: "numeric", year: "numeric" };
        const datePart = d.toLocaleDateString("en-US", options);
        const timePart = d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
        return `${datePart} ${timePart}`;
    }

    function formatCleaningDate(date) {
        const d = new Date(date);
        const options = { weekday: "short", month: "short", day: "numeric", year: "numeric" };
        return d.toLocaleDateString("en-US", options);
    }

    function formatCleaningTime(date) {
        const d = new Date(date);
        return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
    }

    function getGenderIcon(gender) {
        const g = (gender || "").toLowerCase();
        if (g === "female" || g.includes("women")) {
            return (
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-neutral-500">
                    <i className="bi bi-person-standing-dress text-[32px] text-white"></i>
                </div>
            );
        }
        if (g === "neutral" || g.includes("all") || g.includes("unisex")) {
            return (
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-neutral-500">
                    <i className="bi bi-person-standing text-[24px] text-white"></i>
                    <i className="bi bi-person-standing-dress text-[24px] text-white"></i>
                </div>
            );
        }
        // Default: Male
        return (
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-neutral-500">
                <i className="bi bi-person-standing text-[32px] text-white"></i>
            </div>
        );
    }

    function handleCleaningsUpdate(bathroomId, newCleanings) {
        setBathrooms((prev) =>
            prev.map((b) =>
                b.bathroomId === bathroomId
                    ? { ...b, cleanings: newCleanings }
                    : b
            )
        );
    }

    const selectedBathroom = openCleaningDetails
        ? bathrooms.find(
              (bathroom) => bathroom.bathroomId === openCleaningDetails.bathroomId
          )
        : null;
    const selectedCleaning = openCleaningDetails
        ? selectedBathroom?.cleanings?.find(
              (cleaning) => cleaning.cleaningId === openCleaningDetails.cleaningId
          )
        : null;

    return (
        <div className="min-h-screen bg-background text-foreground">
            {/* Main Container with border */}
            <div
                className={`min-h-screen border-[6px] rounded-3xl ${
                    hasInspectedBathroom ? "border-red-600" : "border-brand"
                } p-6`}
            >
                {/* Header */}
                <header className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-5">
                        <Link
                            href={branchId ? `/locations/${branchId}` : "/branches"}
                            className="flex h-10 w-10 items-center justify-center bg-foreground/10 rounded text-foreground hover:bg-foreground/20 transition"
                        >
                            <i className="bi bi-arrow-left"></i>
                        </Link>
                        <Link href="/" className="flex items-center">
                            <img
                                src="/nexus_shine_logo.png"
                                alt="NexusShine"
                                className="h-10 w-auto"
                            />
                        </Link>
                    </div>
                    <h1 className="text-2xl font-bold text-foreground">{locationName}</h1>
                    
                </header>

                {/* Message */}
                {message && (
                    <div className="mx-auto max-w-4xl mb-4 rounded-lg bg-brand/20 px-4 py-2 text-sm text-brand">
                        {message}
                    </div>
                )}

                {/* Bathroom Cards Grid */}
                <div className="grid gap-8 md:grid-cols-2">
                    {bathrooms
                        .slice()
                        .sort((a, b) => a.order - b.order)
                        .map((bathroom) => {
                            const lastCleaning = bathroom.cleanings?.[0];
                            const recentCleanings = bathroom.cleanings?.slice(0, 4) || [];
                            const isInspected = bathroom.status === "inspected";
                            const activeInspection = bathroom.inspections?.[0];
                            const inspectionItems = activeInspection?.inspectedItems || [];

                            return (
                                <motion.div
                                    key={bathroom.bathroomId}
                                    layout
                                    initial={{ opacity: 0, y: 6 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="rounded-2xl border border-foreground/10 bg-background overflow-hidden flex flex-col shadow-md"
                                >
                                    {/* Card Header */}
                                    <div className="flex items-start gap-3 p-5">
                                        {getGenderIcon(bathroom.gender)}
                                        <div className="flex flex-col">
                                            <h2 className="text-xl font-bold text-foreground">
                                                {bathroom.name}
                                            </h2>
                                            {isInspected && inspectionItems.length > 0 && (
                                                <div className="flex items-center gap-2 text-red-500 text-sm mt-1">
                                                    <i className="bi bi-exclamation-triangle-fill"></i>
                                                    <span>
                                                        {inspectionItems
                                                            .map((item) => item.inspectionReason)
                                                            .join(", ")}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Last Cleaned Section */}
                                    <div
                                        className={`px-5 py-3 bg-gradient-to-r ${
                                            isInspected
                                                ? "from-red-600"
                                                : "from-brand"
                                        } to-transparent`}
                                        onClick={() => {
                                            if (lastCleaning) {
                                                setOpenCleaningDetails({
                                                    bathroomId: bathroom.bathroomId,
                                                    cleaningId: lastCleaning.cleaningId,
                                                });
                                            }
                                        }}
                                        role={lastCleaning ? "button" : undefined}
                                        tabIndex={lastCleaning ? 0 : undefined}
                                        onKeyDown={(event) => {
                                            if (
                                                lastCleaning &&
                                                (event.key === "Enter" || event.key === " ")
                                            ) {
                                                setOpenCleaningDetails({
                                                    bathroomId: bathroom.bathroomId,
                                                    cleaningId: lastCleaning.cleaningId,
                                                });
                                            }
                                        }}
                                    >
                                        <div className="text-xs text-white/80 font-medium">
                                            Last Cleaned
                                        </div>
                                        <div className="text-2xl font-bold text-white">
                                            {lastCleaning
                                                ? formatLastCleaned(lastCleaning.createdAt)
                                                : "No Cleanings"}
                                        </div>
                                    </div>

                                    {/* Recent Cleanings List */}
                                    <div className="flex-1 px-5 py-4 max-h-[200px] overflow-auto">
                                        <AnimatePresence>
                                            {recentCleanings.slice(1).map((cleaning) => (
                                                <motion.div
                                                    key={cleaning.cleaningId}
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    exit={{ opacity: 0 }}
                                                    className="flex items-center justify-between bg-foreground/5 p-4 rounded-lg mb-2 last:mb-0 cursor-pointer"
                                                    onClick={() =>
                                                        setOpenCleaningDetails({
                                                            bathroomId: bathroom.bathroomId,
                                                            cleaningId: cleaning.cleaningId,
                                                        })
                                                    }
                                                    role="button"
                                                    tabIndex={0}
                                                    onKeyDown={(event) => {
                                                        if (
                                                            event.key === "Enter" ||
                                                            event.key === " "
                                                        ) {
                                                            setOpenCleaningDetails({
                                                                bathroomId: bathroom.bathroomId,
                                                                cleaningId: cleaning.cleaningId,
                                                            });
                                                        }
                                                    }}
                                                >
                                                    <span className="text-sm text-foreground/70">
                                                        {formatCleaningDate(cleaning.createdAt)}
                                                    </span>
                                                    <span className="text-sm text-brand font-medium">
                                                        {formatCleaningTime(cleaning.createdAt)}
                                                    </span>
                                                </motion.div>
                                            ))}
                                        </AnimatePresence>
                                        {recentCleanings.length <= 1 && (
                                            <div className="py-3 text-sm text-foreground/40 text-center">
                                                {recentCleanings.length === 0
                                                    ? "No recent cleanings"
                                                    : ""}
                                            </div>
                                        )}
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="grid grid-cols-2 gap-3 p-5 border-t border-foreground/10">
                                        <InspectModal
                                            details={bathroom}
                                            openInspect={openInspectModal === bathroom.bathroomId}
                                            setOpenInspect={(open) =>
                                                setOpenInspectModal(open ? bathroom.bathroomId : null)
                                            }
                                            setDisplayBathrooms={setBathrooms}
                                            takePhotoOnReport={takePhotoOnReport}
                                        />
                                        <button
                                            onClick={() => setOpenCleanModal(bathroom.bathroomId)}
                                            className="flex-1 rounded-lg bg-brand px-4 py-3 text-sm font-semibold text-white transition hover:bg-brand/90"
                                        >
                                            Clean
                                        </button>
                                    </div>
                                </motion.div>
                            );
                        })}
                </div>
            </div>

            {/* Clean Modals (rendered outside cards) */}
            <AnimatePresence>
                {openCleanModal && (
                    <CleanModal
                        openClean={true}
                        setOpenClean={(open) => {
                            if (!open) setOpenCleanModal(null);
                        }}
                        details={bathrooms.find((b) => b.bathroomId === openCleanModal)}
                        setCleanings={(newCleanings) =>
                            handleCleaningsUpdate(openCleanModal, newCleanings)
                        }
                        setDisplayBathrooms={setBathrooms}
                    />
                )}
            </AnimatePresence>

            {/* Cleaning Details Modal */}
            <AnimatePresence>
                {openCleaningDetails && selectedCleaning && (
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
                            <div className="p-8 flex flex-row items-center gap-5">
                                <div className="flex flex-col">
                                    <div className="text-foreground text-2xl font-bold">
                                        {selectedBathroom?.name || "Cleaning Details"}
                                    </div>
                                    <div className="text-foreground/60">
                                        {formatCleaningDate(selectedCleaning.createdAt)}{" "}
                                        {formatCleaningTime(selectedCleaning.createdAt)}
                                    </div>
                                </div>
                                <button
                                    onClick={() => setOpenCleaningDetails(null)}
                                    className="ml-auto"
                                >
                                    <i className="bi bi-x-lg text-foreground text-3xl"></i>
                                </button>
                            </div>

                            <div className="px-8 pb-6">
                                <div className="text-sm text-foreground/60 mb-2">
                                    Cleaned By
                                </div>
                                <div className="text-lg text-foreground font-semibold">
                                    {selectedCleaning.user?.name ||
                                        selectedCleaning.user?.username ||
                                        "Unknown"}
                                </div>
                            </div>

                            <div className="px-8 pb-10">
                                <div className="text-sm text-foreground/60 mb-3">
                                    Tasks Completed
                                </div>
                                {selectedCleaning.tasks?.length ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {selectedCleaning.tasks.map((task) => (
                                            <div
                                                key={task.cleaningTaskId}
                                                className="rounded-lg border border-foreground/10 bg-foreground/5 px-4 py-3 text-foreground"
                                            >
                                                {task.task?.taskName || "Task"}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="rounded-lg border border-foreground/10 bg-foreground/5 px-4 py-3 text-foreground/70">
                                        No tasks recorded for this cleaning.
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Inspect Modal (rendered at InspectModal button level) */}
        </div>
    );
}
