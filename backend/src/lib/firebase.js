import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import dotenv from 'dotenv';

dotenv.config();

// Check if Firebase is already initialized to prevent errors
let firebaseApp; // Store the initialized app

if (!process.env.FIREBASE_API_KEY || !process.env.FIREBASE_AUTH_DOMAIN || !process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_STORAGE_BUCKET || !process.env.FIREBASE_MESSAGING_SENDER_ID || !process.env.FIREBASE_APP_ID || !process.env.FIREBASE_MEASUREMENT_ID) {
    console.error("Firebase configuration is missing in environment variables. Please check your .env file.");
    throw new Error("Firebase configuration error"); // Or handle this differently
}


try {
    firebaseApp = initializeApp({
        apiKey: process.env.FIREBASE_API_KEY,
        authDomain: process.env.FIREBASE_AUTH_DOMAIN,
        projectId: process.env.FIREBASE_PROJECT_ID,
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.FIREBASE_APP_ID,
        measurementId: process.env.FIREBASE_MEASUREMENT_ID
    });

} catch (error) {
    console.error("Error initializing Firebase:", error);
    throw error;
}

const storage = getStorage(firebaseApp); // Pass the app instance to getStorage

export { firebaseApp, storage, ref, uploadBytes, getDownloadURL }; // Export both the app and the storage instance