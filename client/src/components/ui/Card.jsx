export default function Card({ children, className = '', hoverable = false }) {
  return (
    <div
      className={`rounded-[var(--radius-panel)] border border-neutral-200 bg-surface p-4
        ${hoverable ? 'transition-shadow hover:shadow-md' : ''} ${className}`}
    >
      {children}
    </div>
  );
}
