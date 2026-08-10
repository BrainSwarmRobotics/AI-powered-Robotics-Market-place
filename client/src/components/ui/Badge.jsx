const TONES = {
  neutral: 'bg-neutral-100 text-neutral-600',
  accent: 'bg-accent-soft text-accent',
  success: 'bg-[#e6f4ec] text-success',
  danger: 'bg-[#fbe9e8] text-danger',
  warning: 'bg-[#fbf1e0] text-warning',
};

export default function Badge({ tone = 'neutral', children, className = '' }) {
  return (
    <span
      className={`inline-flex items-center rounded-[var(--radius-control)] px-2 py-0.5
        text-xs font-medium ${TONES[tone]} ${className}`}
    >
      {children}
    </span>
  );
}
