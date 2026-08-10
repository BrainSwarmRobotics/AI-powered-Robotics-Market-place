import { Bot } from 'lucide-react';

export default function ImagePlaceholder({ className = '' }) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-1.5 bg-accent-soft text-accent ${className}`}
    >
      <Bot size={28} strokeWidth={1.5} />
      <span className="text-xs font-medium">Image coming soon</span>
    </div>
  );
}
