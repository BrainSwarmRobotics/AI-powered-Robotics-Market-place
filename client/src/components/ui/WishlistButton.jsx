import { Heart } from 'lucide-react';

export default function WishlistButton({ active, onClick, className = '' }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      aria-label={active ? 'Remove from wishlist' : 'Add to wishlist'}
      className={`inline-flex h-8 w-8 items-center justify-center rounded-full border border-neutral-200
        bg-surface transition-colors hover:border-accent ${className}`}
    >
      <Heart
        size={16}
        className={active ? 'fill-accent text-accent' : 'text-neutral-600'}
      />
    </button>
  );
}
