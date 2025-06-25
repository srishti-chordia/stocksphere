import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Replace with your own Firebase project configuration.
// You can find this in your Firebase project settings.
// It's recommended to use environment variables to store these values.
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAIOFW2u5ObfPRaJNQKYSCkz1DDyHGQoxg",
  authDomain: "stock-portfolio-948d3.firebaseapp.com",
  projectId: "stock-portfolio-948d3",
  storageBucket: "stock-portfolio-948d3.firebasestorage.app",
  messagingSenderId: "533832207262",
  appId: "1:533832207262:web:05b912ee9a0d11c93ba48f",
  measurementId: "G-V09H7Z6K2B"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
