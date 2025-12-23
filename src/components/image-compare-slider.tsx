"use client";

import { useState, useRef, useEffect } from "react";

interface ImageCompareSliderProps {
    imageBefore: string;
    imageAfter: string;
    className?: string;
}

export function ImageCompareSlider({ imageBefore, imageAfter, className = "" }: ImageCompareSliderProps) {
    const [sliderPosition, setSliderPosition] = useState(50);
    const [isDragging, setIsDragging] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const handleMove = (clientX: number) => {
        if (!containerRef.current) return;

        const rect = containerRef.current.getBoundingClientRect();
        const x = clientX - rect.left;
        const percentage = Math.min(Math.max((x / rect.width) * 100, 0), 100);
        setSliderPosition(percentage);
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true);
        handleMove(e.clientX);
    };

    const handleTouchStart = (e: React.TouchEvent) => {
        setIsDragging(true);
        handleMove(e.touches[0].clientX);
    };

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (isDragging) {
                handleMove(e.clientX);
            }
        };

        const handleTouchMove = (e: TouchEvent) => {
            if (isDragging) {
                handleMove(e.touches[0].clientX);
            }
        };

        const handleEnd = () => {
            setIsDragging(false);
        };

        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleEnd);
        document.addEventListener("touchmove", handleTouchMove);
        document.addEventListener("touchend", handleEnd);

        return () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleEnd);
            document.removeEventListener("touchmove", handleTouchMove);
            document.removeEventListener("touchend", handleEnd);
        };
    }, [isDragging]);

    if (!imageBefore || !imageAfter) {
        return null;
    }

    return (
        <div
            ref={containerRef}
            className={`relative overflow-hidden cursor-ew-resize select-none ${className}`}
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
        >
            {/* After Image (Background) */}
            <img
                src={imageAfter}
                alt="Sesudah"
                className="w-full h-full object-cover"
                draggable={false}
            />

            {/* Before Image (Overlay with clip) */}
            <div
                className="absolute inset-0 overflow-hidden"
                style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
            >
                <img
                    src={imageBefore}
                    alt="Sebelum"
                    className="w-full h-full object-cover"
                    draggable={false}
                />
            </div>

            {/* Slider Line */}
            <div
                className="absolute top-0 bottom-0 w-1 bg-white shadow-lg cursor-ew-resize"
                style={{ left: `${sliderPosition}%`, transform: "translateX(-50%)" }}
            >
                {/* Slider Handle */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center">
                    <div className="flex items-center gap-0.5">
                        <svg className="w-3 h-3 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z" />
                        </svg>
                        <svg className="w-3 h-3 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Labels */}
            <div className="absolute top-2 left-2 px-2 py-1 bg-black/60 text-white text-xs rounded">
                SEBELUM
            </div>
            <div className="absolute top-2 right-2 px-2 py-1 bg-black/60 text-white text-xs rounded">
                SESUDAH
            </div>
        </div>
    );
}
