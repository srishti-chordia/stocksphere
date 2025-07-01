import { getApp, getApps, initializeApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";

const firebaseConfigValues = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Check if all required environment variables are present and have values.
export const isFirebaseConfigured =
  !!firebaseConfigValues.apiKey &&
  !!firebaseConfigValues.authDomain &&
  !!firebaseConfigValues.projectId;

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;

if (isFirebaseConfigured) {
  try {
    app = !getApps().length ? initializeApp(firebaseConfigValues) : getApp();
    auth = getAuth(app);
    db = getFirestore(app);
  } catch (e) {
    console.error("Error initializing Firebase. Please check your credentials in .env.local", e);
  }
} else {
  console.warn(`
================================================================================
FIREBASE CONFIGURATION ERROR
--------------------------------------------------------------------------------
Firebase environment variables are missing. The app will not be able to
connect to Firebase. Please provide your credentials in a '.env.local' file
to enable Firebase functionality. See the browser for more instructions.
================================================================================
  `);
}

export { app, auth, db };
