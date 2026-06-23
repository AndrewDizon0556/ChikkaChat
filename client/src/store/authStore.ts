import { create } from "zustand";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from "firebase/auth";
import { firebaseAuth } from "@/firebase/config";
import api from "@/api/axios";
import type { User } from "@/types";

interface AuthState {
  firebaseUser: FirebaseUser | null;
  user: User | null;
  loading: boolean;
  error: string | null;

  initialize: () => () => void;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  registerWithEmail: (
    email: string,
    password: string,
    displayName: string
  ) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  firebaseUser: null,
  user: null,
  loading: true,
  error: null,

  initialize: () => {
    // Safety net: if Firebase auth never reports a state (e.g. init hangs),
    // stop showing the loading screen so the app still renders.
    const safetyTimer = setTimeout(() => {
      set((s) => (s.loading ? { ...s, loading: false } : s));
    }, 5000);

    const unsubscribe = onAuthStateChanged(firebaseAuth, async (fbUser) => {
      clearTimeout(safetyTimer);
      if (fbUser) {
        try {
          const { data } = await api.post("/api/users/profile", {
            display_name: fbUser.displayName || "User",
            photo_url: fbUser.photoURL || "",
          });
          set({ firebaseUser: fbUser, user: data, loading: false });
        } catch {
          set({ firebaseUser: fbUser, user: null, loading: false });
        }
      } else {
        set({ firebaseUser: null, user: null, loading: false });
      }
    });
    return () => {
      clearTimeout(safetyTimer);
      unsubscribe();
    };
  },

  loginWithEmail: async (email, password) => {
    set({ loading: true, error: null });
    try {
      await signInWithEmailAndPassword(firebaseAuth, email, password);
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Login failed",
        loading: false,
      });
    }
  },

  registerWithEmail: async (email, password, displayName) => {
    set({ loading: true, error: null });
    try {
      const { user: fbUser } = await createUserWithEmailAndPassword(
        firebaseAuth,
        email,
        password
      );
      await api.post("/api/users/profile", {
        display_name: displayName,
        photo_url: fbUser.photoURL || "",
      });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Registration failed",
        loading: false,
      });
    }
  },

  loginWithGoogle: async () => {
    set({ loading: true, error: null });
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });
    try {
      await signInWithPopup(firebaseAuth, provider);
    } catch (err) {
      const code = (err as { code?: string }).code ?? "";
      // Popups are frequently blocked; fall back to a full-page redirect.
      if (
        code === "auth/popup-blocked" ||
        code === "auth/cancelled-popup-request" ||
        code === "auth/popup-closed-by-user" ||
        code === "auth/operation-not-supported-in-this-environment"
      ) {
        try {
          await signInWithRedirect(firebaseAuth, provider);
          return;
        } catch (e2) {
          set({
            error: e2 instanceof Error ? e2.message : "Google login failed",
            loading: false,
          });
          return;
        }
      }
      set({
        error: err instanceof Error ? err.message : "Google login failed",
        loading: false,
      });
    }
  },

  logout: async () => {
    await signOut(firebaseAuth);
    set({ firebaseUser: null, user: null });
  },
}));
