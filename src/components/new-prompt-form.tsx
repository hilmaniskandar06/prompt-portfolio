"use client";

import { useState, useRef } from "react";
import { Upload, X, Plus, Clipboard } from "lucide-react";
import { NewPromptData } from "@/lib/types";
import { fileToBase64 } from "@/lib/utils";
import { addPrompt } from "@/lib/storage";

interface NewPromptFormProps {
    onSuccess?: () => void;
}

interface ImageDropZoneProps {
    image: string;
    setImage: (value: string) => void;
    inputRef: React.RefObject<HTMLInputElement>;
    label: string;
}

function ImageDropZone({ image, setImage, inputRef, label }: ImageDropZoneProps) {
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
            <div className="relative rounded-lg overflow-hidden">
                <img
                    src={image}
                    alt={label}
                    className="w-full h-32 object-cover"
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
            className={`w-full h-32 border-2 border-dashed rounded-lg flex flex-col items-center justify-center gap-1 cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--primary)] ${isDragging
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
            <Upload className={`w-5 h-5 ${isDragging ? "text-[var(--primary)]" : "text-[var(--muted)]"}`} />
            <span className="text-xs text-[var(--muted)] text-center px-2">
                Klik, seret, atau paste gambar
            </span>
            <div className="flex items-center gap-1 text-[10px] text-[var(--muted)]">
                <Clipboard className="w-3 h-3" />
                <span>Ctrl+V untuk paste</span>
            </div>
        </div>
    );
}

export function NewPromptForm({ onSuccess }: NewPromptFormProps) {
    const [isOpen, setIsOpen] = useState(false);
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

            // Reset form
            setPromptText("");
            setImageBefore("");
            setImageAfter("");
            setIsOpen(false);

            showToast("Prompt berhasil ditambahkan!");
            onSuccess?.();
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
                        <ImageDropZone
                            image={imageBefore}
                            setImage={setImageBefore}
                            inputRef={beforeInputRef as React.RefObject<HTMLInputElement>}
                            label="Preview sebelum"
                        />
                    </div>

                    {/* After Image */}
                    <div>
                        <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
                            Gambar Sesudah (Opsional)
                        </label>
                        <ImageDropZone
                            image={imageAfter}
                            setImage={setImageAfter}
                            inputRef={afterInputRef as React.RefObject<HTMLInputElement>}
                            label="Preview sesudah"
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
                        disabled={isSubmitting}
                        className="btn btn-primary"
                    >
                        {isSubmitting ? "Menyimpan..." : "Simpan Prompt"}
                    </button>
                </div>
            </form>
        </div>
    );
}
