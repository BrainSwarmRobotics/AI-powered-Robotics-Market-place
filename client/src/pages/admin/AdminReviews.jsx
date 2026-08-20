import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Star, Flag, Check, X, Trash2 } from 'lucide-react';
import {
  fetchAdminReviews,
  moderateAdminReview,
  deleteAdminReview,
} from '../../redux/slices/adminReviewsSlice';
import Badge from '../../components/ui/Badge';

const STATUS_TONE = {
  pending: 'warning',
  approved: 'success',
  rejected: 'danger',
};

export default function AdminReviews() {
  const dispatch = useDispatch();
  const [status, setStatus] = useState('');
  const [reportedOnly, setReportedOnly] = useState(false);
  const [page, setPage] = useState(1);

  const { items, totalPages, loading, actionLoading } = useSelector((state) => state.adminReviews);

  useEffect(() => {
    const params = { page };
    if (status) params.status = status;
    if (reportedOnly) params.reported = 'true';
    dispatch(fetchAdminReviews(params));
  }, [dispatch, page, status, reportedOnly]);

  function handleModerate(id, newStatus) {
    dispatch(moderateAdminReview({ id, status: newStatus }));
  }

  function handleDelete(id) {
    if (!window.confirm('Permanently delete this review?')) return;
    dispatch(deleteAdminReview(id));
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-lg font-semibold text-ink">Review Moderation</h1>
        <div className="flex items-center gap-3">
          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
            className="rounded-[var(--radius-control)] border border-neutral-200 bg-surface px-2 py-1 text-sm text-ink outline-none focus:border-accent-blue"
          >
            <option value="">All statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
          <label className="flex items-center gap-1.5 text-sm text-neutral-600">
            <input
              type="checkbox"
              checked={reportedOnly}
              onChange={(e) => {
                setReportedOnly(e.target.checked);
                setPage(1);
              }}
            />
            Reported only
          </label>
        </div>
      </div>

      <div className="overflow-x-auto rounded-panel border border-neutral-200 bg-surface">
        <table className="w-full min-w-[800px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-neutral-200 bg-surface-alt text-left text-xs uppercase tracking-wide text-neutral-600">
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Rating</th>
              <th className="px-4 py-3">Comment</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Reports</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-neutral-500">
                  Loading reviews…
                </td>
              </tr>
            )}
            {!loading && items.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-neutral-500">
                  No reviews match these filters.
                </td>
              </tr>
            )}
            {!loading &&
              items.map((review) => (
                <tr key={review._id} className="border-b border-neutral-100 last:border-0">
                  <td className="px-4 py-3 text-ink">{review.product?.name || '—'}</td>
                  <td className="px-4 py-3 text-neutral-600">
                    {review.user?.name}
                    <div className="text-xs text-neutral-400">{review.user?.email}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-1 text-ink">
                      <Star size={14} className="fill-accent-blue text-accent-blue" />
                      {review.rating}
                    </span>
                  </td>
                  <td className="max-w-xs truncate px-4 py-3 text-neutral-600">{review.comment}</td>
                  <td className="px-4 py-3">
                    <Badge tone={STATUS_TONE[review.status] || 'accent'}>{review.status}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    {review.reportCount > 0 ? (
                      <span className="flex items-center gap-1 text-danger">
                        <Flag size={14} />
                        {review.reportCount}
                      </span>
                    ) : (
                      <span className="text-neutral-400">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {review.status !== 'approved' && (
                        <button
                          type="button"
                          disabled={actionLoading}
                          onClick={() => handleModerate(review._id, 'approved')}
                          className="rounded-control p-1 text-success hover:bg-success/10"
                          aria-label="Approve"
                        >
                          <Check size={16} />
                        </button>
                      )}
                      {review.status !== 'rejected' && (
                        <button
                          type="button"
                          disabled={actionLoading}
                          onClick={() => handleModerate(review._id, 'rejected')}
                          className="rounded-control p-1 text-warning hover:bg-warning/10"
                          aria-label="Reject"
                        >
                          <X size={16} />
                        </button>
                      )}
                      <button
                        type="button"
                        disabled={actionLoading}
                        onClick={() => handleDelete(review._id)}
                        className="rounded-control p-1 text-danger hover:bg-danger/10"
                        aria-label="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-center gap-3">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="text-sm font-medium text-neutral-600 hover:text-accent-blue disabled:opacity-40"
          >
            Previous
          </button>
          <span className="text-sm text-neutral-500">
            Page {page} of {totalPages}
          </span>
          <button
            type="button"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="text-sm font-medium text-neutral-600 hover:text-accent-blue disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}