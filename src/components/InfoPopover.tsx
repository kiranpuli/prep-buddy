import { Info } from 'lucide-react';
import { type ReactNode, useEffect, useRef, useState } from 'react';

export type InfoPopoverProps = {
  title: string;
  description: string;
  bullets?: string[];
  side?: 'left' | 'right';
  children?: ReactNode;
};

const InfoPopover = ({ title, description, bullets, side = 'right', children }: InfoPopoverProps) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [open]);

  return (
    <div ref={containerRef} className="relative inline-flex items-center">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-500 transition hover:border-emerald-400 hover:text-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 dark:border-white/10 dark:bg-white/10 dark:text-white/60 dark:hover:border-aurora-soft/40 dark:hover:text-aurora-soft dark:focus:ring-aurora-soft/40"
        aria-label="Show helper information"
        aria-expanded={open}
      >
        <Info className="h-3.5 w-3.5" strokeWidth={2.5} />
      </button>
      {open && (
        <div
          className={`absolute z-50 mt-3 w-72 ${
            side === 'left' ? 'right-0 origin-top-right' : 'left-0 origin-top-left'
          }`}
        >
          <div className="rounded-2xl border border-slate-200 bg-white/95 p-4 text-left shadow-xl ring-1 ring-black/5 backdrop-blur dark:border-white/10 dark:bg-slate-900/95 dark:text-white dark:ring-white/10">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500 dark:text-white/60">{title}</p>
                <p className="mt-2 text-sm text-slate-700 dark:text-white/80">{description}</p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="ml-auto text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 transition hover:text-slate-700 dark:text-white/40 dark:hover:text-white/70"
              >
                Close
              </button>
            </div>
            {bullets && bullets.length > 0 && (
              <ul className="mt-3 space-y-2 text-sm text-slate-600 dark:text-white/70">
                {bullets.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="mt-[6px] h-1.5 w-1.5 flex-shrink-0 rounded-full bg-emerald-400 dark:bg-aurora-soft" />
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            )}
            {children && <div className="mt-3 text-sm text-slate-600 dark:text-white/70">{children}</div>}
          </div>
        </div>
      )}
    </div>
  );
};

export default InfoPopover;
