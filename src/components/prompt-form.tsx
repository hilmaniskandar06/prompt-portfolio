"use client";

import { useState, useRef, useEffect } from "react";
import { X, Plus, Save, Pin } from "lucide-react";
import { NewPromptData, Prompt } from "@/lib/types";
import { compressImage } from "@/lib/utils";
import { addPrompt, updatePrompt } from "@/lib/storage";
import { ImageDropZone } from "./image-drop-zone";

interface PromptFormProps {
    onSuccess?: (updatedPrompt?: Prompt) => void;
    onCancel?: () => void;
    initialData?: Prompt | null;
    mode?: "add" | "edit";
}

export function PromptForm({ onSuccess, onCancel, initialData, mode = "add" }: PromptFormProps) {
    const [isOpen, setIsOpen] = useState(mode === "edit");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [promptText, setPromptText] = useState(initialData?.promptText || "");
    const [imageBefore, setImageBefore] = useState<string>(initialData?.imageBefore || "");
    const [imageAfter, setImageAfter] = useState<string>(initialData?.imageAfter || "");
    const [isPinned, setIsPinned] = useState<boolean>(initialData?.isPinned || false);
    const [isCompressingBefore, setIsCompressingBefore] = useState(false);
    const [isCompressingAfter, setIsCompressingAfter] = useState(false);

    const beforeInputRef = useRef<HTMLInputElement>(null);
    const afterInputRef = useRef<HTMLInputElement>(null);

    // Sync form data if initialData changes (useful for edit mode)
    useEffect(() => {
        if (initialData && mode === "edit") {
            setPromptText(initialData.promptText);
            setImageBefore(initialData.imageBefore);
            setImageAfter(initialData.imageAfter);
            setIsPinned(initialData.isPinned || false);
            setIsOpen(true);
        }
    }, [initialData, mode]);

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
            const formData: NewPromptData = {
                promptText: promptText.trim(),
                imageBefore,
                imageAfter,
                isPinned,
            };

            if (mode === "edit" && initialData) {
                const success = await updatePrompt(initialData.id, formData);
                if (success) {
                    showToast("Prompt berhasil diperbarui!");
                    onSuccess?.({ ...initialData, ...formData });
                } else {
                    showToast("Gagal memperbarui prompt");
                }
            } else {
                const result = await addPrompt(formData);
                if (result) {
                    // Reset form
                    setPromptText("");
                    setImageBefore("");
                    setImageAfter("");
                    setIsPinned(false);
                    if (mode !== "edit") setIsOpen(false);

                    showToast("Prompt berhasil ditambahkan!");
                    onSuccess?.();
                } else {
                    showToast("Gagal menambahkan prompt");
                }
            }
        } catch (error) {
            console.error(`Error ${mode === "edit" ? "updating" : "adding"} prompt:`, error);
            showToast(`Gagal ${mode === "edit" ? "memperbarui" : "menambahkan"} prompt`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        if (mode === "edit") {
            onCancel?.();
        } else {
            setIsOpen(false);
            setPromptText("");
            setImageBefore("");
            setImageAfter("");
        }
    };

    if (!isOpen && mode === "add") {
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
        <div className={`card p-4 ${mode === "add" ? "col-span-full" : "w-full"}`}>
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg text-[var(--foreground)]">
                    {mode === "edit" ? "Edit Prompt" : "Tambah Prompt Baru"}
                </h3>
                <button
                    onClick={handleCancel}
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
                        rows={6}
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

                {/* Pin Strategy */}
                <div className="flex items-center gap-2 pt-2 border-t border-[var(--border)]">
                    <label className="flex items-center gap-2 cursor-pointer group">
                        <div className="relative flex items-center">
                            <input
                                type="checkbox"
                                checked={isPinned}
                                onChange={(e) => setIsPinned(e.target.checked)}
                                className="w-5 h-5 rounded border-[var(--border)] text-[var(--primary)] focus:ring-[var(--primary)] cursor-pointer"
                            />
                        </div>
                        <span className="text-sm font-medium text-[var(--foreground)] group-hover:text-[var(--primary)] transition-colors flex items-center gap-1.5">
                            <Pin className={`w-3.5 h-3.5 ${isPinned ? 'fill-current text-[var(--primary)]' : 'text-[var(--muted)]'}`} />
                            Sematkan di atas
                        </span>
                    </label>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end gap-2 pt-2">
                    <button
                        type="button"
                        onClick={handleCancel}
                        className="btn btn-secondary"
                    >
                        Batal
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting || isCompressingBefore || isCompressingAfter}
                        className="btn btn-primary gap-2"
                    >
                        {isSubmitting ? (
                            "Menyimpan..."
                        ) : (
                            <>
                                {mode === "edit" ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                                {mode === "edit" ? "Simpan Perubahan" : "Simpan Prompt"}
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}

