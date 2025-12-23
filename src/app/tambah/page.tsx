"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { NewPromptData } from "@/lib/types";
import { compressImage } from "@/lib/utils";
import { addPrompt } from "@/lib/storage";
import { ImageDropZone } from "@/components/image-drop-zone";

export default function TambahPromptPage() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [promptText, setPromptText] = useState("");
    const [imageBefore, setImageBefore] = useState<string>("");
    const [imageAfter, setImageAfter] = useState<string>("");
    const [isCompressingBefore, setIsCompressingBefore] = useState(false);
    const [isCompressingAfter, setIsCompressingAfter] = useState(false);

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

    const handleImageUpload = async (
        file: File,
        setImage: (value: string) => void,
        setCompressing: (value: boolean) => void
    ) => {
        if (!file.type.startsWith("image/")) {
            showToast("File harus berupa gambar");
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            showToast("Ukuran gambar maksimal 5MB");
            return;
        }

        setCompressing(true);
        try {
            const compressed = await compressImage(file, 400);
            setImage(compressed);
        } catch (error) {
            console.error("Error compressing image:", error);
            showToast("Gagal memproses gambar");
        } finally {
            setCompressing(false);
        }
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

            const result = await addPrompt(newPromptData);

            if (result) {
                showToast("Prompt berhasil ditambahkan!");
                router.push("/");
            } else {
                showToast("Gagal menambahkan prompt");
            }
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
                                <input
                                    ref={beforeInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) handleImageUpload(file, setImageBefore, setIsCompressingBefore);
                                    }}
                                    className="hidden"
                                />
                                <ImageDropZone
                                    image={imageBefore}
                                    setImage={setImageBefore}
                                    onFileSelect={(file) => handleImageUpload(file, setImageBefore, setIsCompressingBefore)}
                                    inputRef={beforeInputRef}
                                    label="Preview sebelum"
                                    height="h-44"
                                    isCompressing={isCompressingBefore}
                                />
                            </div>

                            {/* After Image */}
                            <div className="space-y-2">
                                <span className="text-sm text-[var(--muted)]">Gambar Sesudah</span>
                                <input
                                    ref={afterInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) handleImageUpload(file, setImageAfter, setIsCompressingAfter);
                                    }}
                                    className="hidden"
                                />
                                <ImageDropZone
                                    image={imageAfter}
                                    setImage={setImageAfter}
                                    onFileSelect={(file) => handleImageUpload(file, setImageAfter, setIsCompressingAfter)}
                                    inputRef={afterInputRef}
                                    label="Preview sesudah"
                                    height="h-44"
                                    isCompressing={isCompressingAfter}
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
                            disabled={isSubmitting || isCompressingBefore || isCompressingAfter}
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
