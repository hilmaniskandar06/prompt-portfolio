"use client";

import { useState, ClipboardEvent, DragEvent } from "react";
import { Upload, X, Clipboard as ClipboardIcon } from "lucide-react";

interface ImageDropZoneProps {
    image: string;
    setImage: (value: string) => void;
    onFileSelect: (file: File) => void;
    inputRef: React.RefObject<HTMLInputElement>;
    label: string;
    height?: string;
    isCompressing?: boolean;
}

export function ImageDropZone({
    image,
    setImage,
    onFileSelect,
    inputRef,
    label,
    height = "h-32",
    isCompressing
}: ImageDropZoneProps) {
    const [isDragging, setIsDragging] = useState(false);

    const handleDragOver = (e: DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e: DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDrop = (e: DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const file = e.dataTransfer.files?.[0];
        if (file && file.type.startsWith("image/")) {
            onFileSelect(file);
        }
    };

    const handlePaste = (e: ClipboardEvent) => {
        const item = e.clipboardData.items[0];
        if (item?.type.startsWith("image/")) {
            const file = item.getAsFile();
            if (file) {
                onFileSelect(file);
            }
        }
    };

    if (isCompressing) {
        return (
            <div className={`w-full ${height} border-2 border-dashed border-[var(--border)] rounded-xl flex flex-col items-center justify-center gap-2 bg-[var(--secondary)]`}>
                <div className="w-6 h-6 border-2 border-[var(--primary)] border-t-transparent rounded-full animate-spin"></div>
                <span className="text-xs text-[var(--muted)]">Mengompres...</span>
            </div>
        );
    }

    if (image) {
        return (
            <div className={`relative rounded-xl overflow-hidden border border-[var(--border)] ${height}`}>
                <img
                    src={image}
                    alt={label}
                    className="w-full h-full object-cover"
                />
                <button
                    type="button"
                    onClick={() => setImage("")}
                    className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/70 transition-colors"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
        );
    }

    return (
        <div
            onClick={() => inputRef.current?.click()}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onPaste={handlePaste}
            tabIndex={0}
            className={`w-full ${height} border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-1 cursor-pointer transition-all outline-none focus:ring-2 focus:ring-[var(--primary)] ${isDragging
                    ? "border-[var(--primary)] bg-[var(--accent)] scale-[0.99]"
                    : "border-[var(--border)] hover:border-[var(--primary)] hover:bg-[var(--accent)]"
                }`}
        >
            <Upload className={`w-6 h-6 mb-1 ${isDragging ? "text-[var(--primary)]" : "text-[var(--muted)]"}`} />
            <span className="text-xs text-[var(--muted)] text-center px-2 font-medium">
                Klik, seret, atau tempel gambar
            </span>
            <div className="flex items-center gap-1 text-[10px] text-[var(--muted)] opacity-70">
                <ClipboardIcon className="w-3 h-3" />
                <span>Maks 5MB</span>
            </div>
        </div>
    );
}
