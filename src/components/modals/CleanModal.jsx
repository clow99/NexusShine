"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import CodeInput from "./CodeInput";

export default function CleanModal({
    openClean,
    setOpenClean,
    details,
    setCleanings,
    setDisplayBathrooms,
    availableTasks = [],
}) {
    const [codeAccepted, setCodeAccepted] = useState(false);
    const [codeInput, setCodeInput] = useState("");
    const [selectedTasks, setSelectedTasks] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!openClean) {
            setCodeInput("");
            setCodeAccepted(false);
            setSelectedTasks([]);
        }
    }, [openClean]);

    function handleTaskClick(task) {
        setSelectedTasks((prev) =>
            prev.some((t) => t.taskId === task.taskId)
                ? prev.filter((t) => t.taskId !== task.taskId)
                : [...prev, task]
        );
    }

    async function submitCleaning() {
        setLoading(true);
        try {
            const res = await fetch("/api/clean", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    bathroomId: details.bathroomId,
                    tasks: selectedTasks.map((t) => ({ taskId: t.taskId })),
                    code: codeInput,
                }),
            });
            const data = await res.json();
            if (res.ok) {
                setSelectedTasks([]);
                setOpenClean(false);
                if (data.cleanings) setCleanings(data.cleanings);
                if (data.bathrooms) setDisplayBathrooms(data.bathrooms);
            }
        } catch (err) {
            console.error("Error submitting cleaning:", err);
        }
        setLoading(false);
    }

    if (!openClean) return null;

    // Get gender icon
    function getGenderIcon() {
        const gender = (details.gender || "").toLowerCase();
        if (gender === "male") {
            return (
                <div className="flex items-center justify-center w-16 h-16 shrink-0 bg-blue-500 rounded-3xl">
                    <i className="text-[40px] text-foreground bi bi-person-standing"></i>
                </div>
            );
        }
        if (gender === "female") {
            return (
                <div className="flex items-center justify-center w-16 h-16 shrink-0 bg-pink-500 rounded-3xl">
                    <i className="text-[40px] text-foreground bi bi-person-standing-dress"></i>
                </div>
            );
        }
        // Neutral
        return (
            <div className="flex items-center justify-center w-16 h-16 shrink-0 bg-neutral-500 rounded-3xl">
                <i className="text-[30px] text-foreground bi bi-person-standing"></i>
                <i className="text-[30px] text-foreground bi bi-person-standing-dress"></i>
            </div>
        );
    }

    // Tasks to display (use bathroomTasks if availableTasks is empty)
    const tasksToShow =
        availableTasks.length > 0
            ? availableTasks
            : (details.bathroomTasks || []).map((bt) => bt.task);

    return (
        <motion.div
            className="flex flex-col fixed top-0 z-[500] left-0 w-screen h-screen overflow-hidden p-1"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        >
            {codeAccepted ? (
                <motion.div
                    className="flex flex-col w-full h-screen bg-background text-foreground rounded-3xl"
                    initial={{ scale: 1, opacity: 1 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 1, opacity: 0.9 }}
                    transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                >
                    <div className="p-6 md:p-8 flex flex-row items-center gap-4">
                        {getGenderIcon()}
                        <div className="flex flex-col">
                            <div className="text-foreground text-2xl font-bold">
                                {details.name}
                            </div>
                            <div className="text-foreground/60">
                                Cleaning Checklist
                            </div>
                        </div>
                        <button
                            onClick={() => setOpenClean(false)}
                            className="ml-auto"
                        >
                            <i className="bi bi-x-lg text-foreground text-3xl"></i>
                        </button>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 px-6 md:px-8 mt-3 overflow-auto flex-1">
                        {tasksToShow.map((task, index) => (
                            <div
                                key={task.taskId || `task-${index}`}
                                className="flex flex-row items-center gap-2 cursor-pointer"
                                onClick={() => handleTaskClick(task)}
                            >
                                {selectedTasks.some(
                                    (t) => t.taskId === task.taskId
                                ) ? (
                                    <div className="flex items-center text-2xl justify-center h-8 w-8 border border-brand rounded bg-brand/20">
                                        <i className="bi bi-check text-foreground"></i>
                                    </div>
                                ) : (
                                    <div className="h-8 w-8 border border-brand rounded"></div>
                                )}
                                <div className="flex flex-col">
                                    <div className="text-lg text-foreground font-semibold">
                                        {task.taskName}
                                    </div>
                                    {task.taskDescription && (
                                        <div className="text-sm text-foreground/60">
                                            {task.taskDescription}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-auto p-6 md:p-8 grid grid-cols-2 gap-4">
                        <button
                            onClick={() => setOpenClean(false)}
                            className="text-foreground font-semibold bg-foreground/5 h-16 rounded flex items-center justify-center"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={submitCleaning}
                            disabled={loading}
                            className="text-foreground font-semibold bg-brand h-16 rounded flex items-center justify-center disabled:opacity-50"
                        >
                            {loading ? "Submitting..." : "Submit Cleaning"}
                        </button>
                    </div>
                </motion.div>
            ) : (
                <CodeInput
                    codeAccepted={codeAccepted}
                    setCodeAccepted={setCodeAccepted}
                    setCloseParent={setOpenClean}
                    codeInput={codeInput}
                    setCodeInput={setCodeInput}
                />
            )}
        </motion.div>
    );
}
