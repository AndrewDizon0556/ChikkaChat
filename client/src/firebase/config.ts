import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
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
export const firebaseAuth = getAuth(app);

let _storage: FirebaseStorage | null = null;
export function getFirebaseStorage(): FirebaseStorage {
  if (!_storage) _storage = getStorage(app);
  return _storage;
}

export default app;
