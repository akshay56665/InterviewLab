import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "@firebase/auth";
import { getFirestore } from "@firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBWVpzWlL4QXxhw9TXi7psl1993SgkpOfI",
  authDomain: "ai-mock-interview-a16ed.firebaseapp.com",
  projectId: "ai-mock-interview-a16ed",
  storageBucket: "ai-mock-interview-a16ed.firebasestorage.app",
  messagingSenderId: "269142627243",
  appId: "1:269142627243:web:1d4997265d3628217d78ee",
  measurementId: "G-X8Z46DDL2V",
};

// Initialize Firebase
const app = !getApps.length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);
