import { create } from 'zustand';
import { onAuthStateChanged, signInWithPopup, signOut as firebaseSignOut, type User } from 'firebase/auth';
import { auth, googleProvider } from '../config/firebase';

type AuthState = {
  user: User | null;
  initializing: boolean;
  authBusy: boolean;
  error?: string;
  initialize: () => void;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
};

let unsubscribe: (() => void) | null = null;
let isInitialized = false;

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  initializing: true,
  authBusy: false,
  error: undefined,
  initialize: () => {
    if (isInitialized) {
      return;
    }

    isInitialized = true;
    unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        set({ user, initializing: false, authBusy: false, error: undefined });
      },
      (error) => {
        set({ error: error.message, initializing: false, authBusy: false });
      }
    );
  },
  signInWithGoogle: async () => {
    set({ authBusy: true, error: undefined });
    try {
      await signInWithPopup(auth, googleProvider);
      // onAuthStateChanged will update state post sign-in.
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to sign in';
      set({ error: message, authBusy: false });
    }
  },
  signOut: async () => {
    set({ authBusy: true, error: undefined });
    try {
      await firebaseSignOut(auth);
      // onAuthStateChanged handles clearing user state.
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to sign out';
      set({ error: message, authBusy: false });
    }
  },
}));

export const disposeAuthListener = () => {
  if (unsubscribe) {
    unsubscribe();
    unsubscribe = null;
    isInitialized = false;
  }
};
