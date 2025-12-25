"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PromptForm } from "@/components/prompt-form";

export default function TambahPromptPage() {
    const router = useRouter();

    const handleSuccess = () => {
        router.push("/");
    };

    const handleCancel = () => {
        router.push("/");
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
                <PromptForm
                    onSuccess={handleSuccess}
                    onCancel={handleCancel}
                />
            </main>
        </div>
    );
}

