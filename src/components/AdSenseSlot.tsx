import clsx from 'clsx';
import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

type AdSenseSlotProps = {
  slotId?: string;
  label?: string;
  className?: string;
};

const AdSenseSlot = ({ slotId, label = 'Sponsored', className }: AdSenseSlotProps) => {
  const slotRef = useRef<HTMLModElement | null>(null);

  useEffect(() => {
    if (!slotId || typeof window === 'undefined' || !slotRef.current) {
      return;
    }

    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (error) {
      console.error('AdSense failed to render:', error);
    }
  }, [slotId]);

  return (
    <section
      className={clsx(
        'rounded-2xl border border-slate-200/70 bg-white/80 p-4 text-slate-500 shadow-sm backdrop-blur-sm dark:border-white/10 dark:bg-slate-900/40 dark:text-white/40',
        className
      )}
      aria-label="Sponsored content"
    >
      <span className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.35em]">{label}</span>
      {slotId ? (
        <ins
          ref={slotRef}
          className="adsbygoogle block w-full"
          style={{ display: 'block' }}
          data-ad-client="ca-pub-5797243239394127"
          data-ad-slot={slotId}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      ) : (
        <div className="flex h-24 items-center justify-center rounded-xl border border-dashed border-slate-300/70 bg-slate-50/80 text-[11px] font-semibold uppercase tracking-[0.35em] text-slate-400 dark:border-white/10 dark:bg-white/5 dark:text-white/30">
          Ad placeholder
        </div>
      )}
    </section>
  );
};

export default AdSenseSlot;
