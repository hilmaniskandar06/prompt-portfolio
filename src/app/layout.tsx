import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({
    subsets: ["latin"],
    display: "swap",
});

export const metadata: Metadata = {
    title: "Portofolio Prompt - Galeri Prompt AI",
    description: "Simpan, kelola, dan pamerkan koleksi prompt AI Anda beserta gambar yang dihasilkan",
    keywords: ["prompt", "AI", "galeri", "portofolio", "kreator", "desainer"],
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="id" suppressHydrationWarning>
            <body className={inter.className}>
                <ThemeProvider>
                    <div className="min-h-screen bg-[var(--background)] transition-colors duration-300">
                        {children}
                    </div>
                    <div id="toast-container" className="toast-container"></div>
                </ThemeProvider>
            </body>
        </html>
    );
}
