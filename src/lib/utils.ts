import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });
}

export function generateId(): string {
    return crypto.randomUUID();
}

export async function copyToClipboard(text: string): Promise<boolean> {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch (error) {
        console.error("Gagal menyalin ke clipboard:", error);
        return false;
    }
}

export function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
    });
}

export function truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + "...";
}

// Kompres gambar untuk menghemat storage Firestore
// Max size ~500KB untuk Firestore (max 1MB per dokumen)
export async function compressImage(file: File, maxSizeKB: number = 400): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target?.result as string;

            img.onload = () => {
                const canvas = document.createElement("canvas");
                const ctx = canvas.getContext("2d");

                if (!ctx) {
                    reject(new Error("Failed to get canvas context"));
                    return;
                }

                // Hitung ukuran baru (max 800px width/height)
                let width = img.width;
                let height = img.height;
                const maxDimension = 800;

                if (width > maxDimension || height > maxDimension) {
                    if (width > height) {
                        height = Math.round((height * maxDimension) / width);
                        width = maxDimension;
                    } else {
                        width = Math.round((width * maxDimension) / height);
                        height = maxDimension;
                    }
                }

                canvas.width = width;
                canvas.height = height;

                // Gambar di canvas
                ctx.drawImage(img, 0, 0, width, height);

                // Kompres dengan kualitas yang diturunkan sampai ukuran cukup kecil
                let quality = 0.8;
                let result = canvas.toDataURL("image/jpeg", quality);

                // Turunkan kualitas jika masih terlalu besar
                while (result.length > maxSizeKB * 1024 && quality > 0.1) {
                    quality -= 0.1;
                    result = canvas.toDataURL("image/jpeg", quality);
                }

                resolve(result);
            };

            img.onerror = () => {
                reject(new Error("Failed to load image"));
            };
        };

        reader.onerror = () => {
            reject(new Error("Failed to read file"));
        };
    });
}
