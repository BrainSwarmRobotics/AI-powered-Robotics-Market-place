import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearLimitMessage } from '../redux/slices/compareSlice';

export default function CompareLimitToast() {
  const dispatch = useDispatch();
  const message = useSelector((state) => state.compare.limitMessage);

  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => dispatch(clearLimitMessage()), 3000);
    return () => clearTimeout(timer);
  }, [message, dispatch]);

  if (!message) return null;

  return (
    <div
      role="status"
      className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-[var(--radius-panel)]
        bg-ink px-4 py-2.5 text-sm font-medium text-white shadow-lg"
    >
      {message}
    </div>
  );
}