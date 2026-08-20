import { Star } from 'lucide-react';

export default function StarRating({ value = 0, onChange, size = 18, readOnly = true }) {
  const stars = [1, 2, 3, 4, 5];

  return (
    <div className="flex items-center gap-0.5">
      {stars.map((star) => {
        const filled = star <= Math.round(value);
        return (
          <button
            key={star}
            type="button"
            disabled={readOnly}
            onClick={() => onChange && onChange(star)}
            className={readOnly ? 'cursor-default' : 'cursor-pointer'}
            aria-label={`${star} star${star > 1 ? 's' : ''}`}
          >
            <Star
              size={size}
              className={filled ? 'fill-accent-blue text-accent-blue' : 'text-neutral-300'}
            />
          </button>
        );
      })}
    </div>
  );
}