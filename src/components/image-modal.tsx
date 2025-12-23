"use client";

import { X } from "lucide-react";
import { useEffect } from "react";

interface ImageModalProps {
    src: string;
    alt: string;
    onClose: () => void;
}

export function ImageModal({ src, alt, onClose }: ImageModalProps) {
    // Tutup modal saat tombol Escape ditekan
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc);
    }, [onClose]);

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 transition-all duration-300 animate-in fade-in"
            onClick={onClose}
        >
            <button
                className="absolute top-4 right-4 z-[110] p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
                onClick={onClose}
            >
                <X className="w-6 h-6" />
            </button>
            <div
                className="relative max-w-5xl w-full max-h-[90vh] flex items-center justify-center"
                onClick={(e) => e.stopPropagation()}
            >
                <img
                    src={src}
                    alt={alt}
                    className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl animate-in zoom-in-95 duration-300"
                />
            </div>
            {alt && (
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/50 text-white text-sm rounded-full backdrop-blur-sm">
                    {alt}
                </div>
            )}
        </div>
    );
}
