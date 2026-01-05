import { useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import Dashboard from './pages/Dashboard';
import About from './pages/About';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import SignInScreen from './components/SignInScreen';
import {
  loadTrackedFromStorage,
  persistTrackedToStorage,
  useProblemStore,
} from './store/useProblemStore';
import { useAuthStore } from './store/useAuthStore';
import { fetchTrackedProblems, persistTrackedProblems } from './services/trackingSync';

const App = () => {
  const initializeProblems = useProblemStore((state) => state.initialize);
  const setTrackingPersistence = useProblemStore((state) => state.setTrackingPersistence);
  const replaceTrackedProblems = useProblemStore((state) => state.replaceTrackedProblems);

  const initializeAuth = useAuthStore((state) => state.initialize);
  const user = useAuthStore((state) => state.user);
  const initializingAuth = useAuthStore((state) => state.initializing);
  const authBusy = useAuthStore((state) => state.authBusy);
  const signInWithGoogle = useAuthStore((state) => state.signInWithGoogle);
  const authError = useAuthStore((state) => state.error);

  useEffect(() => {
    initializeProblems();
  }, [initializeProblems]);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  useEffect(() => {
    if (!user) {
      setTrackingPersistence('local', persistTrackedToStorage);
      replaceTrackedProblems(loadTrackedFromStorage(), false);
      return;
    }

    let cancelled = false;

    const syncTracked = async () => {
      const localTracked = loadTrackedFromStorage();
      try {
        const remoteTracked = await fetchTrackedProblems(user.uid);
        if (cancelled) {
          return;
        }
        const hasRemote = Object.keys(remoteTracked).length > 0;
        const nextTracked = hasRemote ? remoteTracked : localTracked;
        replaceTrackedProblems(nextTracked, false);
        persistTrackedToStorage(nextTracked);
        setTrackingPersistence('remote', async (tracked) => {
          persistTrackedToStorage(tracked);
          await persistTrackedProblems(
            {
              uid: user.uid,
              displayName: user.displayName,
              photoURL: user.photoURL,
            },
            tracked
          );
        });
        if (!hasRemote) {
          await persistTrackedProblems(
            {
              uid: user.uid,
              displayName: user.displayName,
              photoURL: user.photoURL,
            },
            nextTracked
          );
        }
      } catch (error) {
        console.error('Failed to sync tracked problems', error);
        if (cancelled) {
          return;
        }
        replaceTrackedProblems(localTracked, false);
        setTrackingPersistence('local', persistTrackedToStorage);
      }
    };

    void syncTracked();

    return () => {
      cancelled = true;
    };
  }, [user, replaceTrackedProblems, setTrackingPersistence]);

  if (initializingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-midnight via-slate-950 to-black text-white">
        <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm text-white/70 backdrop-blur">
          <Loader2 className="h-4 w-4 animate-spin text-aurora-soft" /> Preparing dashboard…
        </div>
      </div>
    );
  }

  if (!user) {
    return <SignInScreen onSignIn={signInWithGoogle} loading={authBusy} error={authError} />;
  }

  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/about" element={<About />} />
      <Route path="/privacy" element={<PrivacyPolicy />} />
      <Route path="/terms" element={<TermsOfService />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
