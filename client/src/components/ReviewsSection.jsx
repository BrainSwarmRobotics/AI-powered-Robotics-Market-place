import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import StarRating from './StarRating';
import ReviewForm from './ReviewForm';
import ReviewCard from './ReviewCard';
import Button from './ui/Button';
import Card from './ui/Card';
import {
  fetchProductReviews,
  fetchMyReview,
  submitReview,
  editReview,
  removeReview,
} from '../redux/slices/reviewSlice';

export default function ReviewsSection({ productId }) {
  const dispatch = useDispatch();
  const [sort, setSort] = useState('newest');
  const [page, setPage] = useState(1);
  const [showForm, setShowForm] = useState(false);

  const currentUser = useSelector((state) => state.auth.user);
  const { items, totalPages, summary, loading, myReview, actionLoading, actionError } =
    useSelector((state) => state.reviews);

  useEffect(() => {
    dispatch(fetchProductReviews({ productId, page, sort }));
  }, [dispatch, productId, page, sort]);

  useEffect(() => {
    if (currentUser) {
      dispatch(fetchMyReview(productId));
    }
  }, [dispatch, productId, currentUser]);

  function handleSubmit(formData) {
    formData.append('productId', productId);
    const action = myReview ? editReview({ id: myReview._id, formData }) : submitReview(formData);
    dispatch(action).then((res) => {
      if (!res.error) {
        setShowForm(false);
        dispatch(fetchProductReviews({ productId, page, sort }));
      }
    });
  }

  function handleDelete() {
    if (!myReview) return;
    if (!window.confirm('Delete your review?')) return;
    dispatch(removeReview(myReview._id)).then((res) => {
      if (!res.error) {
        dispatch(fetchProductReviews({ productId, page, sort }));
      }
    });
  }

  return (
    <Card className="mt-12">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-accent-blue">Reviews</h2>
          <div className="mt-1 flex items-center gap-2">
            <StarRating value={summary.averageRating} size={16} />
            <span className="text-sm font-medium text-ink">
              {summary.averageRating > 0 ? summary.averageRating.toFixed(1) : 'No ratings yet'}
            </span>
            <span className="text-xs text-neutral-500">
              ({summary.totalReviews} review{summary.totalReviews === 1 ? '' : 's'})
            </span>
          </div>
        </div>

        {items.length > 0 && (
          <select
            value={sort}
            onChange={(e) => {
              setSort(e.target.value);
              setPage(1);
            }}
            className="rounded-[var(--radius-control)] border border-neutral-200 bg-surface px-2 py-1 text-xs text-ink outline-none focus:border-accent-blue"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="highest">Highest rated</option>
            <option value="lowest">Lowest rated</option>
          </select>
        )}
      </div>

      <div className="mt-4">
        {!currentUser && (
          <p className="text-sm text-neutral-500">
            <Link to="/login" className="font-medium text-accent-blue hover:underline">
              Log in
            </Link>{' '}
            to write a review.
          </p>
        )}

        {currentUser && !showForm && (
          <div className="flex items-center gap-3">
            <Button variant="secondary" onClick={() => setShowForm(true)}>
              {myReview ? 'Edit Your Review' : 'Write a Review'}
            </Button>
            {myReview && (
              <button
                type="button"
                onClick={handleDelete}
                className="text-xs font-medium text-danger hover:underline"
              >
                Delete
              </button>
            )}
          </div>
        )}

        {currentUser && myReview && !showForm && (
          <p className="mt-2 text-xs text-neutral-500">
            {myReview.status === 'pending' && 'Your review is awaiting moderation.'}
            {myReview.status === 'rejected' && 'Your review was not approved for publishing.'}
            {myReview.status === 'approved' && 'Your review is live.'}
          </p>
        )}

        {currentUser && showForm && (
          <div className="mt-3">
            {actionError && <p className="mb-2 text-sm text-danger">{actionError}</p>}
            <ReviewForm
              initialReview={myReview}
              submitting={actionLoading}
              onSubmit={handleSubmit}
              onCancel={() => setShowForm(false)}
            />
          </div>
        )}
      </div>

      <div className="mt-6">
        {loading && <p className="text-sm text-neutral-500">Loading reviews…</p>}
        {!loading && items.length === 0 && (
          <p className="text-sm text-neutral-500">No reviews yet — be the first to write one.</p>
        )}
        {!loading && items.map((review) => <ReviewCard key={review._id} review={review} />)}
      </div>

      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-center gap-3">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="text-xs font-medium text-neutral-600 hover:text-accent-blue disabled:opacity-40"
          >
            Previous
          </button>
          <span className="text-xs text-neutral-500">
            Page {page} of {totalPages}
          </span>
          <button
            type="button"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="text-xs font-medium text-neutral-600 hover:text-accent-blue disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </Card>
  );
}