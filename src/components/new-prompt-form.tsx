"use client";

import { useState, useRef } from "react";
import { X, Plus } from "lucide-react";
import { NewPromptData } from "@/lib/types";
import { compressImage } from "@/lib/utils";
import { addPrompt } from "@/lib/storage";
import { ImageDropZone } from "./image-drop-zone";

interface NewPromptFormProps {
    onSuccess?: () => void;
}

export function NewPromptForm({ onSuccess }: NewPromptFormProps) {
    const [isOpen, setIsOpen] = useState(false);
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
                // Reset form
                setPromptText("");
                setImageBefore("");
                setImageAfter("");
                setIsOpen(false);

                showToast("Prompt berhasil ditambahkan!");
                onSuccess?.();
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

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="card p-6 flex flex-col items-center justify-center gap-3 min-h-[200px] border-2 border-dashed border-[var(--border)] hover:border-[var(--primary)] hover:bg-[var(--accent)] transition-colors cursor-pointer"
            >
                <div className="w-12 h-12 rounded-full bg-[var(--primary)] flex items-center justify-center">
                    <Plus className="w-6 h-6 text-white" />
                </div>
                <span className="font-medium text-[var(--foreground)]">Tambah Prompt Baru</span>
                <span className="text-sm text-[var(--muted)]">Klik untuk menambahkan</span>
            </button>
        );
    }

    return (
        <div className="card p-4 col-span-full">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg text-[var(--foreground)]">
                    Tambah Prompt Baru
                </h3>
                <button
                    onClick={() => setIsOpen(false)}
                    className="btn btn-icon btn-ghost"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Prompt Text */}
                <div>
                    <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
                        Teks Prompt <span className="text-[var(--destructive)]">*</span>
                    </label>
                    <textarea
                        value={promptText}
                        onChange={(e) => setPromptText(e.target.value)}
                        placeholder="Masukkan prompt AI Anda di sini..."
                        rows={4}
                        className="form-input resize-none"
                        required
                    />
                </div>

                {/* Image Uploads */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Before Image */}
                    <div>
                        <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
                            Gambar Sebelum (Opsional)
                        </label>
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
                            isCompressing={isCompressingBefore}
                        />
                    </div>

                    {/* After Image */}
                    <div>
                        <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
                            Gambar Sesudah (Opsional)
                        </label>
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
                            isCompressing={isCompressingAfter}
                        />
                    </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end gap-2 pt-2">
                    <button
                        type="button"
                        onClick={() => setIsOpen(false)}
                        className="btn btn-secondary"
                    >
                        Batal
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting || isCompressingBefore || isCompressingAfter}
                        className="btn btn-primary"
                    >
                        {isSubmitting ? "Menyimpan..." : "Simpan Prompt"}
                    </button>
                </div>
            </form>
        </div>
    );
}
