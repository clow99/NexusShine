"use client";

import { useState, useRef, useEffect, forwardRef, useImperativeHandle } from "react";

const CameraCapture = forwardRef(function CameraCapture({ open }, ref) {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [stream, setStream] = useState(null);
    const [capturedImage, setCapturedImage] = useState(null);
    const [error, setError] = useState("");

    useImperativeHandle(ref, () => ({
        captureImage: () => {
            if (!videoRef.current || !canvasRef.current) return null;
            
            const video = videoRef.current;
            const canvas = canvasRef.current;
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            
            const ctx = canvas.getContext("2d");
            ctx.drawImage(video, 0, 0);
            
            const imageData = canvas.toDataURL("image/jpeg", 0.8);
            setCapturedImage(imageData);
            return imageData;
        },
        getCapturedImage: () => capturedImage,
    }));

    useEffect(() => {
        if (open) {
            startCamera();
        }
        return () => {
            stopCamera();
        };
    }, [open]);

    async function startCamera() {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: "environment" },
            });
            setStream(mediaStream);
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
            }
            setError("");
        } catch (err) {
            console.error("Camera error:", err);
            setError("Unable to access camera. Please grant permission.");
        }
    }

    function stopCamera() {
        if (stream) {
            stream.getTracks().forEach((track) => track.stop());
            setStream(null);
        }
    }

    function retake() {
        setCapturedImage(null);
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-48 bg-white/10 rounded-xl mx-10">
                <div className="text-center">
                    <i className="bi bi-camera-video-off text-4xl text-white/50 mb-2"></i>
                    <div className="text-white/50 text-sm">{error}</div>
                </div>
            </div>
        );
    }

    return (
        <div className="relative mx-10 rounded-xl overflow-hidden bg-white/10">
            {capturedImage ? (
                <div className="relative">
                    <img
                        src={capturedImage}
                        alt="Captured"
                        className="w-full h-48 object-cover"
                    />
                    <button
                        onClick={retake}
                        className="absolute bottom-3 right-3 bg-black/90 text-white px-3 py-1 rounded-lg text-sm"
                    >
                        Retake
                    </button>
                </div>
            ) : (
                <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-48 object-cover"
                />
            )}
            <canvas ref={canvasRef} className="hidden" />
        </div>
    );
});

export default CameraCapture;
