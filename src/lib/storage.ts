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
        isPinned: data.isPinned || false,
        createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
    };
}

// Ambil semua prompt
export async function getPrompts(): Promise<Prompt[]> {
    try {
        const promptsRef = collection(db, COLLECTION_NAME);
        // Note: Multiple orderBy might require a composite index in Firestore
        const q = query(
            promptsRef,
            orderBy("isPinned", "desc"),
            orderBy("createdAt", "desc")
        );
        const snapshot = await getDocs(q);
        return snapshot.docs.map(docToPrompt);
    } catch (error) {
        console.error("Error getting prompts (falling back to local sort):", error);
        // Fallback: get all and sort locally if index is missing
        try {
            const promptsRef = collection(db, COLLECTION_NAME);
            const snapshot = await getDocs(promptsRef);
            const prompts = snapshot.docs.map(docToPrompt);
            return prompts.sort((a, b) => {
                if (a.isPinned && !b.isPinned) return -1;
                if (!a.isPinned && b.isPinned) return 1;
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            });
        } catch (innerError) {
            console.error("Error getting prompts fallback:", innerError);
            return [];
        }
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
            isPinned: data.isPinned || false,
            createdAt: Timestamp.now(),
        };

        const docRef = await addDoc(promptsRef, newPromptDoc);

        return {
            id: docRef.id,
            ...data,
            isPinned: newPromptDoc.isPinned,
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

// Toggle pin status
export async function togglePinPrompt(id: string, currentStatus: boolean): Promise<boolean> {
    try {
        const docRef = doc(db, COLLECTION_NAME, id);
        await updateDoc(docRef, {
            isPinned: !currentStatus
        });
        return true;
    } catch (error) {
        console.error("Error toggling pin status:", error);
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
