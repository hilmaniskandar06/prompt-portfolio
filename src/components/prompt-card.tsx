"use client";

import { useState } from "react";
import Link from "next/link";
import { Copy, Check, ImageIcon, Pin } from "lucide-react";
import { Prompt } from "@/lib/types";
import { copyToClipboard, truncateText } from "@/lib/utils";
import { ImageModal } from "./image-modal";

interface PromptCardProps {
    prompt: Prompt;
}

export function PromptCard({ prompt }: PromptCardProps) {
    const [copied, setCopied] = useState(false);
    const [selectedImage, setSelectedImage] = useState<{ src: string, alt: string } | null>(null);

    const handleImageClick = (e: React.MouseEvent, src: string, alt: string) => {
        e.preventDefault();
        e.stopPropagation();
        setSelectedImage({ src, alt });
    };

    const handleCopy = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        const success = await copyToClipboard(prompt.promptText);
        if (success) {
            setCopied(true);
            showToast("Prompt berhasil disalin!");
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const showToast = (message: string) => {
        const container = document.getElementById("toast-container");
        if (!container) return;

        const toast = document.createElement("div");
        toast.className = "toast";
        toast.textContent = message;
        container.appendChild(toast);

        setTimeout(() => {
            toast.classList.add("hiding");
            setTimeout(() => toast.remove(), 200);
        }, 2000);
    };

    return (
        <Link href={`/prompts/${prompt.id}`}>
            <article className={`card transition-card hover-lift cursor-pointer group relative ${prompt.isPinned ? 'border-[var(--primary)] ring-1 ring-[var(--primary)]/20' : ''}`}>
                {/* Pin Indicator */}
                {prompt.isPinned && (
                    <div className="absolute -top-2 -right-2 z-10 bg-[var(--primary)] text-white p-1.5 rounded-full shadow-lg">
                        <Pin className="w-3.5 h-3.5 fill-current" />
                    </div>
                )}

                {/* Image Comparison */}
                <div className="image-comparison p-3 pb-0">
                    <div className="relative rounded-lg overflow-hidden">
                        {prompt.imageBefore ? (
                            <img
                                src={prompt.imageBefore}
                                alt="Gambar sebelum"
                                className="w-full aspect-[4/5] object-cover cursor-zoom-in hover:opacity-90 transition-opacity"
                                onClick={(e) => handleImageClick(e, prompt.imageBefore, "Gambar Sebelum")}
                            />
                        ) : (
                            <div className="placeholder-image aspect-[4/5]">
                                <div className="flex flex-col items-center gap-1">
                                    <ImageIcon className="w-6 h-6" />
                                    <span>Sebelum</span>
                                </div>
                            </div>
                        )}
                        <span className="absolute bottom-1 left-1 text-[10px] bg-black/60 text-white px-1.5 py-0.5 rounded">
                            SEBELUM
                        </span>
                    </div>
                    <div className="relative rounded-lg overflow-hidden">
                        {prompt.imageAfter ? (
                            <img
                                src={prompt.imageAfter}
                                alt="Gambar sesudah"
                                className="w-full aspect-[4/5] object-cover cursor-zoom-in hover:opacity-90 transition-opacity"
                                onClick={(e) => handleImageClick(e, prompt.imageAfter, "Gambar Sesudah")}
                            />
                        ) : (
                            <div className="placeholder-image aspect-[4/5]">
                                <div className="flex flex-col items-center gap-1">
                                    <ImageIcon className="w-6 h-6" />
                                    <span>Sesudah</span>
                                </div>
                            </div>
                        )}
                        <span className="absolute bottom-1 left-1 text-[10px] bg-black/60 text-white px-1.5 py-0.5 rounded">
                            SESUDAH
                        </span>
                    </div>
                </div>

                {/* Content */}
                <div className="card-content">
                    <div className="flex items-start justify-between gap-2">
                        <p className="text-sm text-[var(--foreground)] flex-1 min-w-0 line-clamp-3">
                            {truncateText(prompt.promptText, 120)}
                        </p>
                        <button
                            onClick={handleCopy}
                            className="btn btn-icon btn-ghost shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Salin prompt"
                        >
                            {copied ? (
                                <Check className="w-4 h-4 text-green-600" />
                            ) : (
                                <Copy className="w-4 h-4" />
                            )}
                        </button>
                    </div>
                </div>
            </article>

            {selectedImage && (
                <ImageModal
                    src={selectedImage.src}
                    alt={selectedImage.alt}
                    onClose={() => setSelectedImage(null)}
                />
            )}
        </Link>
    );
}
