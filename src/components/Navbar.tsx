import { useEffect, useRef, useState } from 'react';
import { ChevronDown, LogOut, MessageCircleQuestion, Moon, Sparkles, Sun, UserCircle } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useTheme } from '../contexts/ThemeContext';

const Navbar = () => {
  const { user, signOut, authBusy } = useAuthStore();
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuId = 'profile-menu';

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (err) {
      console.error('Sign out failed:', err);
    }
  };

  const handleSignOutClick = () => {
    setMenuOpen(false);
    void handleSignOut();
  };

  const handleToggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  // Close the dropdown when user clicks outside or presses Escape.
  useEffect(() => {
    if (!menuOpen) {
      return;
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [menuOpen]);

  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-slate-900/80 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex h-16 items-center justify-between">
          {/* Logo/Brand */}
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-aurora-soft" />
            <span className="text-xl font-bold text-white">PrepBuddy</span>
            <span className="ml-2 rounded-full border border-aurora-soft/40 bg-aurora-soft/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-aurora-soft/90">
              Beta
            </span>
          </div>

          {/* Right side - Contact & User */}
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={handleToggleMenu}
              className="flex items-center gap-3 rounded-full border border-white/15 bg-black/30 px-3 py-2 text-left text-white/80 shadow-lg backdrop-blur transition hover:border-aurora-soft/60 hover:bg-aurora-soft/10"
              aria-haspopup="true"
              aria-expanded={menuOpen}
              aria-controls={menuId}
              aria-label="Profile menu"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10">
                <UserCircle className="h-7 w-7" />
              </div>
              <div className="hidden min-w-[140px] md:block">
                <p className="text-sm font-semibold text-white">{user?.displayName ?? 'Google Account'}</p>
                <p className="text-xs text-white/50">{user?.email ?? 'Signed in'}</p>
              </div>
              <ChevronDown
                className={`ml-1 text-white/70 transition-transform duration-200 ${menuOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {menuOpen ? (
              <div
                id={menuId}
                role="menu"
                className="absolute right-0 mt-3 w-72 rounded-2xl border border-white/10 bg-slate-950/90 p-4 shadow-2xl backdrop-blur-xl"
              >
                <div className="mb-3 flex items-center gap-3 rounded-xl border border-white/5 bg-white/5 px-3 py-2">
                  <UserCircle className="h-8 w-8 text-white/70" />
                  <div>
                    <p className="text-sm font-semibold text-white">{user?.displayName ?? 'Google Account'}</p>
                    <p className="text-xs text-white/50">{user?.email ?? 'Signed in with Google'}</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={toggleTheme}
                  className="flex w-full items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/80 transition hover:border-aurora-soft/60 hover:bg-aurora-soft/20 hover:text-aurora-soft"
                  role="menuitem"
                >
                  <span>{theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}</span>
                  {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </button>

                <a
                  href="https://github.com/kiranpuli/prep-buddy/issues"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 flex w-full items-center justify-between rounded-xl border border-blue-400/30 bg-blue-500/10 px-3 py-2 text-sm font-medium text-blue-200/90 transition hover:border-blue-400/60 hover:bg-blue-500/20 hover:text-blue-100"
                  onClick={() => setMenuOpen(false)}
                  role="menuitem"
                >
                  <span>Contact Support</span>
                  <MessageCircleQuestion className="h-4 w-4" />
                </a>

                <button
                  type="button"
                  onClick={handleSignOutClick}
                  disabled={authBusy}
                  className="mt-3 flex w-full items-center justify-between rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm font-semibold uppercase tracking-wider text-white/80 transition hover:border-rose-400/60 hover:bg-rose-500/10 hover:text-rose-100 disabled:cursor-not-allowed disabled:opacity-60"
                  role="menuitem"
                >
                  <span>Sign Out</span>
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
