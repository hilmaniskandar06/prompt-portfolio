"use client";

import Link from "next/link";
import { Sparkles, Moon, Sun } from "lucide-react";
import { useTheme } from "./theme-provider";

export function Header() {
    const { theme, toggleTheme } = useTheme();

    return (
        <header className="sticky top-0 z-50 bg-[var(--background)] border-b border-[var(--border)] transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Spacer for centering */}
                    <div className="w-10"></div>

                    {/* Logo - Centered */}
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#4285F4] via-[#EA4335] to-[#FBBC05] flex items-center justify-center">
                            <Sparkles className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-semibold text-lg text-[var(--foreground)]">
                            Portofolio Prompt
                        </span>
                    </Link>

                    {/* Theme Toggle */}
                    <button
                        onClick={toggleTheme}
                        className="theme-toggle"
                        title={theme === "light" ? "Aktifkan mode gelap" : "Aktifkan mode terang"}
                    >
                        {theme === "light" ? (
                            <Moon className="w-5 h-5 text-[var(--muted)]" />
                        ) : (
                            <Sun className="w-5 h-5 text-[var(--muted)]" />
                        )}
                    </button>
                </div>
            </div>
        </header>
    );
}
