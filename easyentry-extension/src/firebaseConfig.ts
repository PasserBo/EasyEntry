import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyABH4AZHDQrBW-bqV76T8eKA-O0SPkqoF4",
  authDomain: "easyentry-14dd7.firebaseapp.com",
  projectId: "easyentry-14dd7",
  storageBucket: "easyentry-14dd7.firebasestorage.app",
  messagingSenderId: "793084424239",
  appId: "1:793084424239:web:9b8d04cc4d74b036a056da",
  measurementId: "G-3WPZMCQL87"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app); 