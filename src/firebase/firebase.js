// import { initializeApp } from "firebase/app";
// import { getAuth, GoogleAuthProvider } from "firebase/auth";
// import { getFirestore } from "firebase/firestore";

// // Your web app's Firebase configuration
// // Replace with your own Firebase config
// const firebaseConfig = {
//   apiKey: "AIzaSyC-dRNlKwSLzHS5LpkUUkhQdcZerImgdpE",
//   authDomain: "cigarette-craving-tracker.firebaseapp.com",
//   projectId: "cigarette-craving-tracker",
//   storageBucket: "cigarette-craving-tracker.firebasestorage.app",
//   messagingSenderId: "114239541322",
//   appId: "1:114239541322:web:dd727b5f602947107456b3"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const auth = getAuth(app);
// const db = getFirestore(app);
// const googleProvider = new GoogleAuthProvider();

// // Uncomment for local development with Firebase emulators
// // if (window.location.hostname === "localhost") {
// //   connectFirestoreEmulator(db, 'localhost', 8080);
// // }

// export { auth, db, googleProvider };

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

export { auth, db, googleProvider };