import { initializeApp } from "firebase/app";
import {
  initializeAuth,
  indexedDBLocalPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
  inMemoryPersistence,
  browserPopupRedirectResolver,
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

const app = initializeApp(firebaseConfig);

// Use a persistence fallback chain so auth still works if IndexedDB is
// unavailable (falls back to localStorage, then sessionStorage, then memory).
export const firebaseAuth = initializeAuth(app, {
  persistence: [
    indexedDBLocalPersistence,
    browserLocalPersistence,
    browserSessionPersistence,
    inMemoryPersistence,
  ],
  // Required for signInWithPopup / signInWithRedirect (Google sign-in).
  // getAuth() includes this by default, but initializeAuth() does not.
  popupRedirectResolver: browserPopupRedirectResolver,
});

let _storage: FirebaseStorage | null = null;
export function getFirebaseStorage(): FirebaseStorage {
  if (!_storage) _storage = getStorage(app);
  return _storage;
}

export default app;
