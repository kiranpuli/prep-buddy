import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import type { User } from 'firebase/auth';
import { db } from '../config/firebase';
import type { TrackingMap } from '../store/useProblemStore';

const PROGRESS_COLLECTION = 'userTracking';
const LEADERBOARD_COLLECTION = 'leaderboard';

type UserProfile = Pick<User, 'uid' | 'displayName' | 'photoURL'>;

const normalizeDisplayName = (name?: string | null) => {
  const trimmed = name?.trim();
  if (trimmed && trimmed.length > 0) {
    return trimmed;
  }
  return 'PrepBuddy contender';
};

export const fetchTrackedProblems = async (userId: string): Promise<TrackingMap> => {
  try {
    const docRef = doc(db, PROGRESS_COLLECTION, userId);
    const snapshot = await getDoc(docRef);
    if (!snapshot.exists()) {
      return {};
    }

    const data = snapshot.data();
    const tracked = Array.isArray(data.trackedProblemIds) ? (data.trackedProblemIds as string[]) : [];
    return tracked.reduce<TrackingMap>((acc, id) => {
      acc[id] = true;
      return acc;
    }, {});
  } catch (error) {
    console.error('Failed to fetch tracked problems', error);
    return {};
  }
};

export const persistTrackedProblems = async (user: UserProfile, tracked: TrackingMap) => {
  try {
    const trackedIds = Object.keys(tracked);
    const progressRef = doc(db, PROGRESS_COLLECTION, user.uid);
    const leaderboardRef = doc(db, LEADERBOARD_COLLECTION, user.uid);

    await Promise.all([
      setDoc(
        progressRef,
        {
          trackedProblemIds: trackedIds,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      ),
      setDoc(
        leaderboardRef,
        {
          displayName: normalizeDisplayName(user.displayName),
          photoURL: user.photoURL ?? null,
          trackedCount: trackedIds.length,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      ),
    ]);
  } catch (error) {
    console.error('Failed to persist tracked problems', error);
  }
};
