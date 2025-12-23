import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCAYwI9rNFus0WUhMZob4CwUvYXBvw1NKE",
    authDomain: "prompt-portfolio.firebaseapp.com",
    projectId: "prompt-portfolio",
    storageBucket: "prompt-portfolio.firebasestorage.app",
    messagingSenderId: "251781077786",
    appId: "1:251781077786:web:8641f91838d166fa18eaa3"
};

// Initialize Firebase (hanya sekali)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize Firestore
export const db = getFirestore(app);

export default app;
