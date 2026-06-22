import admin from "firebase-admin";
import type { auth as Auth } from "firebase-admin";

const firebaseApp = admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  }),
});

export const auth: Auth.Auth = firebaseApp.auth();
export default firebaseApp;
