import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth'; // eslint-disable-line @typescript-eslint/no-unused-vars
import { getStorage, connectStorageEmulator } from 'firebase/storage'; // eslint-disable-line @typescript-eslint/no-unused-vars
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore'; // eslint-disable-line @typescript-eslint/no-unused-vars
import { getAnalytics } from 'firebase/analytics';

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

// Initialize Firebase services
export const auth = getAuth(app);
export const storage = getStorage(app);
export const db = getFirestore(app);

// Initialize Analytics only on client side
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

// Connect to emulators in development (currently disabled - using live Firebase)
// Uncomment the lines below if you want to use Firebase emulators for development
// if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
//   try {
//     connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
//     connectStorageEmulator(storage, 'localhost', 9199);
//     connectFirestoreEmulator(db, 'localhost', 8080);
//   } catch {
//     // Emulators already connected
//   }
// }

export default app; 