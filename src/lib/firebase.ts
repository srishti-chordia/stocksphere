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

// Check if the essential Firebase config values are provided.
// The measurementId is optional, so it is not checked here.
export const isFirebaseConfigured =
  !!firebaseConfigValues.apiKey &&
  !!firebaseConfigValues.authDomain &&
  !!firebaseConfigValues.projectId &&
  !!firebaseConfigValues.storageBucket &&
  !!firebaseConfigValues.messagingSenderId &&
  !!firebaseConfigValues.appId;

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;

// Initialize Firebase only if the configuration is complete.
if (isFirebaseConfigured) {
  try {
    app = !getApps().length ? initializeApp(firebaseConfigValues) : getApp();
    auth = getAuth(app);
    db = getFirestore(app);
  } catch (e) {
    // This catch block is a safety net, but the primary error handling
    // is the ConfigErrorBanner shown in AuthProvider.
    console.error(
      "Firebase initialization failed. This can happen if the values in .env.local are valid but point to a project that doesn't exist or has been deleted.",
      e
    );
  }
}

export { app, auth, db };
