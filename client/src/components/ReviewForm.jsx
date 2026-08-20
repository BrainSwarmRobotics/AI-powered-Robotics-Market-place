import { useState, useEffect } from 'react';
import { ImagePlus, X } from 'lucide-react';
import StarRating from './StarRating';
import Button from './ui/Button';

export default function ReviewForm({ initialReview, onSubmit, onCancel, submitting }) {
  const [rating, setRating] = useState(initialReview?.rating || 0);
  const [title, setTitle] = useState(initialReview?.title || '');
  const [comment, setComment] = useState(initialReview?.comment || '');
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    const urls = files.map((f) => URL.createObjectURL(f));
    setPreviews(urls);
    return () => urls.forEach((u) => URL.revokeObjectURL(u));
  }, [files]);

  function handleFileChange(e) {
    const selected = Array.from(e.target.files || []).slice(0, 3);
    setFiles(selected);
  }

  function removeFile(index) {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  }

  function handleSubmitClick() {
    setTouched(true);
    if (rating < 1 || !comment.trim()) return;

    const formData = new FormData();
    formData.append('rating', rating);
    formData.append('title', title);
    formData.append('comment', comment.trim());
    files.forEach((file) => formData.append('images', file));

    onSubmit(formData);
  }

  return (
    <div className="space-y-4 rounded-[var(--radius-control)] border border-neutral-200 bg-surface-alt p-4">
      <div>
        <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-neutral-600">
          Your rating
        </label>
        <StarRating value={rating} onChange={setRating} readOnly={false} size={22} />
        {touched && rating < 1 && (
          <p className="mt-1 text-xs text-danger">Please select a rating.</p>
        )}
      </div>

      <div>
        <label
          htmlFor="review-title"
          className="mb-1 block text-xs font-medium uppercase tracking-wide text-neutral-600"
        >
          Title (optional)
        </label>
        <input
          id="review-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={100}
          className="w-full rounded-[var(--radius-control)] border border-neutral-200 bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-accent-blue"
          placeholder="Sum up your experience"
        />
      </div>

      <div>
        <label
          htmlFor="review-comment"
          className="mb-1 block text-xs font-medium uppercase tracking-wide text-neutral-600"
        >
          Review
        </label>
        <textarea
          id="review-comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
          className="w-full rounded-[var(--radius-control)] border border-neutral-200 bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-accent-blue"
          placeholder="What did you think of this robot?"
        />
        {touched && !comment.trim() && (
          <p className="mt-1 text-xs text-danger">Please write a comment.</p>
        )}
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-neutral-600">
          Photos (optional, up to 3)
        </label>
        <div className="flex flex-wrap items-center gap-2">
          {previews.map((src, i) => (
            <div
              key={src}
              className="relative h-16 w-16 overflow-hidden rounded-[var(--radius-control)] border border-neutral-200"
            >
              <img src={src} alt="" className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => removeFile(i)}
                className="absolute right-0 top-0 rounded-bl bg-ink/70 p-0.5 text-white"
                aria-label="Remove photo"
              >
                <X size={12} />
              </button>
            </div>
          ))}
          {files.length < 3 && (
            <label className="flex h-16 w-16 cursor-pointer flex-col items-center justify-center gap-1 rounded-[var(--radius-control)] border border-dashed border-neutral-300 text-neutral-500 hover:border-accent-blue hover:text-accent-blue">
              <ImagePlus size={18} />
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button type="button" variant="primary" onClick={handleSubmitClick} disabled={submitting}>
          {submitting ? 'Submitting…' : initialReview ? 'Update Review' : 'Submit Review'}
        </Button>
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </div>
  );
}