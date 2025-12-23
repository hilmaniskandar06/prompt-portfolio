"use client";

import { Prompt } from "@/lib/types";
import { PromptCard } from "./prompt-card";

interface PromptGalleryProps {
    prompts: Prompt[];
}

export function PromptGallery({ prompts }: PromptGalleryProps) {
    if (prompts.length === 0) {
        return (
            <div className="col-span-full text-center py-16">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[var(--secondary)] flex items-center justify-center">
                    <svg
                        className="w-8 h-8 text-[var(--muted)]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                        />
                    </svg>
                </div>
                <h3 className="text-lg font-medium text-[var(--foreground)]">
                    Belum ada prompt
                </h3>
                <p className="text-[var(--muted)] mt-1">
                    Mulai tambahkan prompt pertama Anda!
                </p>
            </div>
        );
    }

    return (
        <>
            {prompts.map((prompt) => (
                <PromptCard key={prompt.id} prompt={prompt} />
            ))}
        </>
    );
}
