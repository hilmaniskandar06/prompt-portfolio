"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Copy, Check, Trash2, ImageIcon, Calendar } from "lucide-react";
import { getPromptById, deletePrompt } from "@/lib/storage";
import { copyToClipboard, formatDate } from "@/lib/utils";
import { Prompt } from "@/lib/types";

export default function PromptDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [prompt, setPrompt] = useState<Prompt | null>(null);
    const [copied, setCopied] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    useEffect(() => {
        if (params.id) {
            const data = getPromptById(params.id as string);
            setPrompt(data || null);
        }
    }, [params.id]);

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

    const handleCopy = async () => {
        if (!prompt) return;

        const success = await copyToClipboard(prompt.promptText);
        if (success) {
            setCopied(true);
            showToast("Prompt berhasil disalin!");
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleDelete = async () => {
        if (!prompt) return;

        setIsDeleting(true);
        const success = deletePrompt(prompt.id);

        if (success) {
            showToast("Prompt berhasil dihapus!");
            router.push("/");
        } else {
            showToast("Gagal menghapus prompt");
            setIsDeleting(false);
        }
    };

    if (!prompt) {
        return (
            <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-[var(--foreground)] mb-2">
                        Prompt Tidak Ditemukan
                    </h1>
                    <p className="text-[var(--muted)] mb-4">
                        Prompt yang Anda cari tidak ada atau telah dihapus.
                    </p>
                    <Link href="/" className="btn btn-primary">
                        Kembali ke Galeri
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[var(--background)]">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-[var(--background)] border-b border-[var(--border)] transition-colors duration-300">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <Link href="/" className="btn btn-ghost gap-2">
                            <ArrowLeft className="w-5 h-5" />
                            <span>Kembali</span>
                        </Link>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={handleCopy}
                                className="btn btn-secondary gap-2"
                            >
                                {copied ? (
                                    <>
                                        <Check className="w-4 h-4 text-green-600" />
                                        <span>Tersalin!</span>
                                    </>
                                ) : (
                                    <>
                                        <Copy className="w-4 h-4" />
                                        <span>Salin</span>
                                    </>
                                )}
                            </button>
                            <button
                                onClick={() => setShowDeleteConfirm(true)}
                                className="btn btn-ghost text-[var(--destructive)]"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Date */}
                <div className="mb-6">
                    <div className="flex items-center gap-2 text-sm text-[var(--muted)]">
                        <Calendar className="w-4 h-4" />
                        {formatDate(prompt.createdAt)}
                    </div>
                </div>

                {/* Image Comparison */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {/* Before Image */}
                    <div className="space-y-2">
                        <h3 className="font-medium text-[var(--foreground)]">Gambar Sebelum</h3>
                        <div className="aspect-video rounded-xl overflow-hidden border border-[var(--border)]">
                            {prompt.imageBefore ? (
                                <img
                                    src={prompt.imageBefore}
                                    alt="Gambar sebelum"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center bg-[var(--secondary)] text-[var(--muted)]">
                                    <ImageIcon className="w-12 h-12 mb-2" />
                                    <span>Tidak ada gambar</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* After Image */}
                    <div className="space-y-2">
                        <h3 className="font-medium text-[var(--foreground)]">Gambar Sesudah</h3>
                        <div className="aspect-video rounded-xl overflow-hidden border border-[var(--border)]">
                            {prompt.imageAfter ? (
                                <img
                                    src={prompt.imageAfter}
                                    alt="Gambar sesudah"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center bg-[var(--secondary)] text-[var(--muted)]">
                                    <ImageIcon className="w-12 h-12 mb-2" />
                                    <span>Tidak ada gambar</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Prompt Text */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <h3 className="font-medium text-[var(--foreground)]">Teks Prompt</h3>
                        <button
                            onClick={handleCopy}
                            className="btn btn-ghost btn-sm gap-1 text-[var(--primary)]"
                        >
                            {copied ? (
                                <>
                                    <Check className="w-4 h-4" />
                                    <span>Tersalin!</span>
                                </>
                            ) : (
                                <>
                                    <Copy className="w-4 h-4" />
                                    <span>Salin</span>
                                </>
                            )}
                        </button>
                    </div>
                    <div className="p-6 bg-[var(--secondary)] rounded-xl">
                        <p className="text-[var(--foreground)] whitespace-pre-wrap leading-relaxed">
                            {prompt.promptText}
                        </p>
                    </div>
                </div>
            </main>

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-xl">
                        <h3 className="text-lg font-semibold text-[var(--foreground)] mb-2">
                            Hapus Prompt?
                        </h3>
                        <p className="text-[var(--muted)] mb-6">
                            Apakah Anda yakin ingin menghapus prompt ini?
                            Tindakan ini tidak dapat dibatalkan.
                        </p>
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setShowDeleteConfirm(false)}
                                className="btn btn-secondary"
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={isDeleting}
                                className="btn bg-[var(--destructive)] text-white hover:opacity-90"
                            >
                                {isDeleting ? "Menghapus..." : "Hapus"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
