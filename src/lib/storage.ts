import { Prompt, NewPromptData } from "./types";
import { generateId } from "./utils";

const STORAGE_KEY = "prompt-portfolio-data";

// Data contoh awal
const initialData: Prompt[] = [
    {
        id: "1",
        promptText: "A majestic fantasy mountain landscape at sunset, with floating islands, waterfalls cascading into clouds, ethereal lighting, vibrant colors, highly detailed, 8k resolution, digital art style",
        imageBefore: "",
        imageAfter: "",
        createdAt: new Date().toISOString(),
    },
    {
        id: "2",
        promptText: "Cyberpunk portrait of a young woman with neon lights reflecting on her face, futuristic city background, rain, holographic elements, cinematic lighting, ultra realistic, 4k",
        imageBefore: "",
        imageAfter: "",
        createdAt: new Date().toISOString(),
    },
];

// Inisialisasi storage dengan data contoh jika kosong
function initializeStorage(): void {
    if (typeof window === "undefined") return;

    const existing = localStorage.getItem(STORAGE_KEY);
    if (!existing) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
    }
}

// Ambil semua prompt
export function getPrompts(): Prompt[] {
    if (typeof window === "undefined") return [];

    initializeStorage();
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
}

// Ambil satu prompt berdasarkan ID
export function getPromptById(id: string): Prompt | undefined {
    const prompts = getPrompts();
    return prompts.find((p) => p.id === id);
}

// Tambah prompt baru
export function addPrompt(data: NewPromptData): Prompt {
    const prompts = getPrompts();

    const newPrompt: Prompt = {
        ...data,
        id: generateId(),
        createdAt: new Date().toISOString(),
    };

    prompts.unshift(newPrompt); // Tambah di awal array
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prompts));

    return newPrompt;
}

// Update prompt
export function updatePrompt(id: string, data: Partial<NewPromptData>): Prompt | undefined {
    const prompts = getPrompts();
    const index = prompts.findIndex((p) => p.id === id);

    if (index === -1) return undefined;

    prompts[index] = {
        ...prompts[index],
        ...data,
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(prompts));
    return prompts[index];
}

// Hapus prompt
export function deletePrompt(id: string): boolean {
    const prompts = getPrompts();
    const filtered = prompts.filter((p) => p.id !== id);

    if (filtered.length === prompts.length) return false;

    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
}
