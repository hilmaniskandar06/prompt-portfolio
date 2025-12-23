import {
    collection,
    doc,
    getDocs,
    getDoc,
    addDoc,
    updateDoc,
    deleteDoc,
    orderBy,
    query,
    Timestamp
} from "firebase/firestore";
import { db } from "./firebase";
import { Prompt, NewPromptData } from "./types";

const COLLECTION_NAME = "prompts";

// Konversi Firestore doc ke Prompt
function docToPrompt(docSnapshot: any): Prompt {
    const data = docSnapshot.data();
    return {
        id: docSnapshot.id,
        promptText: data.promptText || "",
        imageBefore: data.imageBefore || "",
        imageAfter: data.imageAfter || "",
        createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
    };
}

// Ambil semua prompt
export async function getPrompts(): Promise<Prompt[]> {
    try {
        const promptsRef = collection(db, COLLECTION_NAME);
        const q = query(promptsRef, orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(docToPrompt);
    } catch (error) {
        console.error("Error getting prompts:", error);
        return [];
    }
}

// Ambil satu prompt berdasarkan ID
export async function getPromptById(id: string): Promise<Prompt | null> {
    try {
        const docRef = doc(db, COLLECTION_NAME, id);
        const docSnapshot = await getDoc(docRef);

        if (!docSnapshot.exists()) {
            return null;
        }

        return docToPrompt(docSnapshot);
    } catch (error) {
        console.error("Error getting prompt:", error);
        return null;
    }
}

// Tambah prompt baru
export async function addPrompt(data: NewPromptData): Promise<Prompt | null> {
    try {
        const promptsRef = collection(db, COLLECTION_NAME);

        const newPromptDoc = {
            promptText: data.promptText,
            imageBefore: data.imageBefore,
            imageAfter: data.imageAfter,
            createdAt: Timestamp.now(),
        };

        const docRef = await addDoc(promptsRef, newPromptDoc);

        return {
            id: docRef.id,
            ...data,
            createdAt: new Date().toISOString(),
        };
    } catch (error) {
        console.error("Error adding prompt:", error);
        return null;
    }
}

// Update prompt
export async function updatePrompt(id: string, data: Partial<NewPromptData>): Promise<boolean> {
    try {
        const docRef = doc(db, COLLECTION_NAME, id);
        await updateDoc(docRef, data);
        return true;
    } catch (error) {
        console.error("Error updating prompt:", error);
        return false;
    }
}

// Hapus prompt
export async function deletePrompt(id: string): Promise<boolean> {
    try {
        const docRef = doc(db, COLLECTION_NAME, id);
        await deleteDoc(docRef);
        return true;
    } catch (error) {
        console.error("Error deleting prompt:", error);
        return false;
    }
}
