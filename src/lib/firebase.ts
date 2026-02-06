import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyC4faVdLSFZAwHgLaII6TLDPjTYNgFE1gM",
    authDomain: "monsters-ff5ad.firebaseapp.com",
    projectId: "monsters-ff5ad",
    storageBucket: "monsters-ff5ad.firebasestorage.app",
    messagingSenderId: "229341156957",
    appId: "1:229341156957:web:0f3ccdf6f74cc59b731fb4",
    measurementId: "G-2ST9Z75TNE"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

export default app;
