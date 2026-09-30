// Firebase Configuration and Firestore Client for NVSHOP.LK
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDZ9uye_aPdZhzKWYOsspcZYztrqkyhj0k",
  authDomain: "nvshop-lk.firebaseapp.com",
  projectId: "nvshop-lk",
  storageBucket: "nvshop-lk.firebasestorage.app",
  messagingSenderId: "436568475883",
  appId: "1:436568475883:web:6058a1b67c38ec7ce656ae",
  measurementId: "G-K93E20J6MY"
};

// Initialize Firebase App
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Cloud Firestore and Auth services
export const db = getFirestore(app);
export const auth = getAuth(app);
export default app;
