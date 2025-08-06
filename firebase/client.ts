// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
   
const firebaseConfig = {
  apiKey: "AIzaSyCgqAP_MQddu25FOjqTa3YHIW8NawH-nWc",
  authDomain: "interveiwperp.firebaseapp.com",
  projectId: "interveiwperp",
  storageBucket: "interveiwperp.firebasestorage.app",
  messagingSenderId: "381944191558",
  appId: "1:381944191558:web:462d7e77b6b4edca2d0847",
  measurementId: "G-DPWKWG5F6T"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db =  getFirestore(app);