import { create } from 'zustand';
import {
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
  type DocumentData,
  type FirestoreError,
  type Unsubscribe,
} from 'firebase/firestore';
import { db } from '../config/firebase';

export type LeaderboardEntry = {
  userId: string;
  displayName: string;
  photoURL?: string | null;
  trackedCount: number;
  updatedAt?: unknown;
};

type LeaderboardState = {
  entries: LeaderboardEntry[];
  loading: boolean;
  error?: string;
  initialize: () => void;
  dispose: () => void;
};

const leaderboardQuery = query(collection(db, 'leaderboard'), orderBy('trackedCount', 'desc'), limit(15));

let unsubscribe: Unsubscribe | null = null;
let isInitialized = false;

const mapSnapshot = (docData: DocumentData, userId: string): LeaderboardEntry => {
  const displayName = typeof docData.displayName === 'string' ? docData.displayName : 'PrepBuddy contender';
  const photoURL = typeof docData.photoURL === 'string' ? docData.photoURL : undefined;
  const trackedCount = typeof docData.trackedCount === 'number' ? docData.trackedCount : 0;
  return {
    userId,
    displayName,
    photoURL,
    trackedCount,
    updatedAt: docData.updatedAt,
  };
};

export const useLeaderboardStore = create<LeaderboardState>((set) => ({
  entries: [],
  loading: true,
  error: undefined,
  initialize: () => {
    if (isInitialized) {
      return;
    }

    isInitialized = true;
    set({ loading: true, error: undefined });

    unsubscribe = onSnapshot(
      leaderboardQuery,
      (snapshot) => {
        const entries = snapshot.docs.map((docSnapshot) => mapSnapshot(docSnapshot.data(), docSnapshot.id));
        set({ entries, loading: false, error: undefined });
      },
      (error: FirestoreError) => {
        console.error('Failed to subscribe to leaderboard', error);
        set({ error: error.message, loading: false });
      }
    );
  },
  dispose: () => {
    if (unsubscribe) {
      unsubscribe();
      unsubscribe = null;
    }
    isInitialized = false;
    set({ entries: [], loading: true, error: undefined });
  },
}));
