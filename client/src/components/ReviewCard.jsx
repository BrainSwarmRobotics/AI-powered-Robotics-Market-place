import { ThumbsUp, Flag } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import StarRating from './StarRating';
import { toggleLikeReview, reportReview } from '../redux/slices/reviewSlice';

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export default function ReviewCard({ review }) {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.auth.user);
  // authSlice's persistSession spreads the raw login payload, whose id key
  // wasn't confirmed as either _id or id — this covers both defensively.
  const currentUserId = currentUser?._id || currentUser?.id;

  const alreadyLiked = Array.isArray(review.likes)
    ? review.likes.some((id) => id === currentUserId || id?._id === currentUserId)
    : false;

  function handleLike() {
    if (!currentUserId) return;
    dispatch(toggleLikeReview(review._id));
  }

  function handleReport() {
    if (!currentUserId) return;
    const reason = window.prompt('Why are you reporting this review? (optional)') || '';
    dispatch(reportReview({ id: review._id, reason }));
  }

  return (
    <div className="border-b border-neutral-100 py-4 last:border-0">
      <div>
        <p className="text-sm font-medium text-ink">{review.user?.name || 'Anonymous'}</p>
        <div className="mt-1 flex items-center gap-2">
          <StarRating value={review.rating} size={14} />
          <span className="text-xs text-neutral-500">{formatDate(review.createdAt)}</span>
        </div>
      </div>

      {review.title && <h4 className="mt-2 text-sm font-semibold text-ink">{review.title}</h4>}
      <p className="mt-1 text-sm leading-relaxed text-neutral-600">{review.comment}</p>

      {review.images?.length > 0 && (
        <div className="mt-2 flex gap-2">
          {review.images.map((img) => (
            <img
              key={img.public_id || img.url}
              src={img.url}
              alt=""
              className="h-16 w-16 rounded-[var(--radius-control)] object-cover"
            />
          ))}
        </div>
      )}

      <div className="mt-3 flex items-center gap-4 text-xs text-neutral-500">
        <button
          type="button"
          onClick={handleLike}
          className={`flex items-center gap-1 hover:text-accent-blue ${
            alreadyLiked ? 'text-accent-blue' : ''
          }`}
        >
          <ThumbsUp size={14} />
          Helpful{review.likeCount ? ` (${review.likeCount})` : ''}
        </button>
        <button type="button" onClick={handleReport} className="flex items-center gap-1 hover:text-danger">
          <Flag size={14} />
          Report
        </button>
      </div>
    </div>
  );
}