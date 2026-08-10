import { useEffect, useRef, useState } from 'react';

/**
 * Generic trigger + popover panel. Consumers render their own trigger
 * content (e.g. a "Filters" Button) via `trigger`, and their own panel
 * content via `children`. Closes on outside click and Escape.
 */
export default function Dropdown({ trigger, children, align = 'left', className = '' }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    function handleKey(e) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleKey);
    };
  }, []);

  return (
    <div className="relative inline-block" ref={containerRef}>
      <div onClick={() => setOpen((o) => !o)}>{trigger({ open })}</div>
      {open && (
        <div
          className={`absolute z-20 mt-2 min-w-[16rem] rounded-[var(--radius-panel)] border border-neutral-200
            bg-surface p-4 shadow-lg
            ${align === 'right' ? 'right-0' : 'left-0'} ${className}`}
        >
          {children({ close: () => setOpen(false) })}
        </div>
      )}
    </div>
  );
}
