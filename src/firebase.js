// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyC2w0vh_kiAGXTmRDx69iMgPcqObi_-Zw0",
  authDomain: "ch360-d-erp.firebaseapp.com",
  projectId: "ch360-d-erp",
  storageBucket: "ch360-d-erp.firebasestorage.app",
  messagingSenderId: "119584645450",
  appId: "1:119584645450:web:de17d423561eb9524e61b3",
  measurementId: "G-51YTY1SYYK"
};

const app = initializeApp(firebaseConfig);
// Initialize Analytics only in browser environments if needed
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);