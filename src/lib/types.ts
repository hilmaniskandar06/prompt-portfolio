export interface Prompt {
    id: string;
    promptText: string;
    imageBefore: string; // Base64 string dari gambar
    imageAfter: string;  // Base64 string dari gambar
    createdAt: string;   // ISO date string
    isPinned?: boolean;
}

export interface NewPromptData {
    promptText: string;
    imageBefore: string;
    imageAfter: string;
    isPinned?: boolean;
}
