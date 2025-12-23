"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Upload, X, Clipboard } from "lucide-react";
import { NewPromptData } from "@/lib/types";
import { fileToBase64 } from "@/lib/utils";
import { addPrompt } from "@/lib/storage";

interface ImageDropZoneProps {
    image: string;
    setImage: (value: string) => void;
    inputRef: React.RefObject<HTMLInputElement>;
    label: string;
    height?: string;
}

function ImageDropZone({ image, setImage, inputRef, label, height = "h-40" }: ImageDropZoneProps) {
    const [isDragging, setIsDragging] = useState(false);

    const handleFile = async (file: File) => {
        if (!file.type.startsWith("image/")) {
            return;
        }
        try {
            const base64 = await fileToBase64(file);
            setImage(base64);
        } catch (error) {
            console.error("Error processing image:", error);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDrop = async (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const files = e.dataTransfer.files;
        if (files.length > 0) {
            await handleFile(files[0]);
        }
    };

    const handlePaste = async (e: React.ClipboardEvent) => {
        const items = e.clipboardData.items;
        for (let i = 0; i < items.length; i++) {
            if (items[i].type.startsWith("image/")) {
                const file = items[i].getAsFile();
                if (file) {
                    await handleFile(file);
                    break;
                }
            }
        }
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            await handleFile(file);
        }
    };

    if (image) {
        return (
            <div className="relative rounded-xl overflow-hidden border border-[var(--border)]">
                <img
                    src={image}
                    alt={label}
                    className={`w-full ${height} object-cover`}
                />
                <button
                    type="button"
                    onClick={() => setImage("")}
                    className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/70 transition-colors"
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
            className={`w-full ${height} border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--primary)] ${isDragging
                ? "border-[var(--primary)] bg-[var(--accent)]"
                : "border-[var(--border)] hover:border-[var(--primary)] hover:bg-[var(--accent)]"
                }`}
        >
            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
            />
            <Upload className={`w-8 h-8 ${isDragging ? "text-[var(--primary)]" : "text-[var(--muted)]"}`} />
            <span className="text-sm text-[var(--muted)] text-center px-4">
                Klik, seret gambar ke sini, atau paste
            </span>
            <div className="flex items-center gap-1 text-xs text-[var(--muted)]">
                <Clipboard className="w-3 h-3" />
                <span>Ctrl+V untuk paste dari clipboard</span>
            </div>
        </div>
    );
}

export default function TambahPromptPage() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [promptText, setPromptText] = useState("");
    const [imageBefore, setImageBefore] = useState<string>("");
    const [imageAfter, setImageAfter] = useState<string>("");

    const beforeInputRef = useRef<HTMLInputElement>(null);
    const afterInputRef = useRef<HTMLInputElement>(null);

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!promptText.trim()) {
            showToast("Prompt harus diisi!");
            return;
        }

        setIsSubmitting(true);

        try {
            const newPromptData: NewPromptData = {
                promptText: promptText.trim(),
                imageBefore,
                imageAfter,
            };

            addPrompt(newPromptData);
            showToast("Prompt berhasil ditambahkan!");
            router.push("/");
        } catch (error) {
            console.error("Error adding prompt:", error);
            showToast("Gagal menambahkan prompt");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-[var(--background)]">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-[var(--background)] border-b border-[var(--border)] transition-colors duration-300">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <Link href="/" className="btn btn-ghost gap-2">
                            <ArrowLeft className="w-5 h-5" />
                            <span>Kembali</span>
                        </Link>
                        <h1 className="font-semibold text-[var(--foreground)]">
                            Tambah Prompt Baru
                        </h1>
                        <div className="w-24"></div>
                    </div>
                </div>
            </header>

            <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Prompt Text */}
                    <div>
                        <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                            Teks Prompt <span className="text-[var(--destructive)]">*</span>
                        </label>
                        <textarea
                            value={promptText}
                            onChange={(e) => setPromptText(e.target.value)}
                            placeholder="Masukkan prompt AI Anda di sini. Contoh: A majestic fantasy mountain landscape at sunset, with floating islands, waterfalls cascading into clouds..."
                            rows={6}
                            className="form-input resize-none"
                            required
                        />
                        <p className="mt-1 text-sm text-[var(--muted)]">
                            Tulis prompt yang detail untuk hasil terbaik.
                        </p>
                    </div>

                    {/* Image Uploads */}
                    <div>
                        <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                            Gambar Perbandingan
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Before Image */}
                            <div className="space-y-2">
                                <span className="text-sm text-[var(--muted)]">Gambar Sebelum</span>
                                <ImageDropZone
                                    image={imageBefore}
                                    setImage={setImageBefore}
                                    inputRef={beforeInputRef as React.RefObject<HTMLInputElement>}
                                    label="Preview sebelum"
                                />
                            </div>

                            {/* After Image */}
                            <div className="space-y-2">
                                <span className="text-sm text-[var(--muted)]">Gambar Sesudah</span>
                                <ImageDropZone
                                    image={imageAfter}
                                    setImage={setImageAfter}
                                    inputRef={afterInputRef as React.RefObject<HTMLInputElement>}
                                    label="Preview sesudah"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Submit Buttons */}
                    <div className="flex justify-end gap-3 pt-4 border-t border-[var(--border)]">
                        <Link href="/" className="btn btn-secondary">
                            Batal
                        </Link>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="btn btn-primary"
                        >
                            {isSubmitting ? "Menyimpan..." : "Simpan Prompt"}
                        </button>
                    </div>
                </form>
            </main>
        </div>
    );
}
