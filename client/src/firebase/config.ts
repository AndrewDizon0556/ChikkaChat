import { initializeApp } from "firebase/app";
import {
  initializeAuth,
  indexedDBLocalPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
  inMemoryPersistence,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { getStorage, type FirebaseStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Build diagnostic — confirms config loaded in the deployed bundle (build v2)
console.log(
  "[ChikkaChat] Firebase config loaded:",
  firebaseConfig.apiKey ? "apiKey OK" : "apiKey MISSING",
  "| authDomain:",
  firebaseConfig.authDomain || "MISSING"
);

const app = initializeApp(firebaseConfig);

// Use a persistence fallback chain. If IndexedDB is blocked/unavailable
// (which surfaces misleadingly as auth/network-request-failed), the SDK
// falls back to localStorage, then sessionStorage, then in-memory.
export const firebaseAuth = initializeAuth(app, {
  persistence: [
    indexedDBLocalPersistence,
    browserLocalPersistence,
    browserSessionPersistence,
    inMemoryPersistence,
  ],
});

let _storage: FirebaseStorage | null = null;
export function getFirebaseStorage(): FirebaseStorage {
  if (!_storage) _storage = getStorage(app);
  return _storage;
}

// TEMPORARY DEBUG HOOK — runs the real SDK login and dumps the full error.
// Call from console: __chikkaDebugLogin("livetest75552@gmail.com","test1234")
(window as unknown as Record<string, unknown>).__chikkaDebugLogin = async (
  email: string,
  pw: string
) => {
  try {
    const cred = await signInWithEmailAndPassword(firebaseAuth, email, pw);
    console.log("✅ SDK LOGIN OK:", cred.user.email);
  } catch (e) {
    const err = e as { code?: string; message?: string; name?: string; customData?: unknown; stack?: string };
    console.log("❌ SDK LOGIN FAILED");
    console.log("code:", err.code);
    console.log("name:", err.name);
    console.log("message:", err.message);
    console.log("customData:", err.customData);
    console.log("stack:", err.stack);
    console.log("full error object:", e);
  }
};

export default app;
