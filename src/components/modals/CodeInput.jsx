"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";

export default function CodeInput({
    codeAccepted,
    setCodeAccepted,
    setCloseParent,
    codeInput,
    setCodeInput,
}) {
    const [digits, setDigits] = useState(["", "", "", ""]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const inputRefs = [useRef(), useRef(), useRef(), useRef()];

    useEffect(() => {
        // Focus first input on mount
        inputRefs[0].current?.focus();
    }, []);

    useEffect(() => {
        // Update the parent's codeInput when digits change
        setCodeInput(digits.join(""));
    }, [digits, setCodeInput]);

    async function validateCode(code) {
        setLoading(true);
        setError("");
        try {
            const res = await fetch("/api/validate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ code }),
            });
            const data = await res.json();
            if (res.ok && data.valid) {
                setCodeAccepted(true);
            } else {
                setError("Invalid code");
                setDigits(["", "", "", ""]);
                inputRefs[0].current?.focus();
            }
        } catch (err) {
            setError("Error validating code");
            setDigits(["", "", "", ""]);
            inputRefs[0].current?.focus();
        }
        setLoading(false);
    }

    function handleChange(index, value) {
        // Only allow digits
        if (value && !/^\d$/.test(value)) return;

        const newDigits = [...digits];
        newDigits[index] = value;
        setDigits(newDigits);

        // Auto-advance to next input
        if (value && index < 3) {
            inputRefs[index + 1].current?.focus();
        }

        // Auto-submit when all digits are entered
        if (value && index === 3) {
            const code = newDigits.join("");
            if (code.length === 4) {
                validateCode(code);
            }
        }
    }

    function handleKeyDown(index, e) {
        if (e.key === "Backspace" && !digits[index] && index > 0) {
            inputRefs[index - 1].current?.focus();
        }
    }

    function handlePaste(e) {
        e.preventDefault();
        const pasteData = e.clipboardData.getData("text").slice(0, 4);
        if (/^\d+$/.test(pasteData)) {
            const newDigits = pasteData.split("").slice(0, 4);
            while (newDigits.length < 4) newDigits.push("");
            setDigits(newDigits);
            if (newDigits.length === 4 && newDigits.every((d) => d)) {
                validateCode(newDigits.join(""));
            }
        }
    }

    return (
        <motion.div
            className="flex flex-col w-full h-screen bg-black/90 rounded-3xl items-center justify-center"
            initial={{ scale: 1, opacity: 1 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1, opacity: 0.9 }}
            transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        >
            <button
                onClick={() => setCloseParent(false)}
                className="absolute top-10 right-10"
            >
                <i className="bi bi-x-lg text-white text-3xl"></i>
            </button>

            <div className="text-white text-3xl font-bold mb-3">
                Enter Your Code
            </div>
            <div className="text-neutral-400 mb-8">
                Enter your 4-digit cleaning code
            </div>

            <div className="flex gap-4 mb-6">
                {digits.map((digit, index) => (
                    <input
                        key={index}
                        ref={inputRefs[index]}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        onPaste={handlePaste}
                        disabled={loading}
                        className="w-16 h-20 text-center text-3xl font-bold bg-white/10 border-2 border-white/20 rounded-xl text-white focus:border-brand focus:outline-none disabled:opacity-50"
                    />
                ))}
            </div>

            {loading && (
                <div className="text-brand animate-pulse">
                    Validating...
                </div>
            )}

            {error && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-400 font-medium"
                >
                    {error}
                </motion.div>
            )}
        </motion.div>
    );
}
