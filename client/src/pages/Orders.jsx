import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchMyOrders } from '../redux/slices/orderSlice';

function formatPrice(price) {
  return new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency: 'PKR',
    maximumFractionDigits: 0,
  }).format(price ?? 0);
}

export default function Orders() {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchMyOrders());
  }, [dispatch]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="mb-6 text-2xl font-semibold text-ink">My Orders</h1>

      {loading && <p className="text-sm text-neutral-600">Loading your orders...</p>}
      {error && <p className="text-sm text-danger">{error}</p>}

      {!loading && items.length === 0 && (
        <div className="py-16 text-center">
          <p className="text-sm text-neutral-600">You haven&apos;t placed any orders yet.</p>
          <Link to="/products" className="mt-4 inline-block text-sm font-medium text-accent hover:underline">
            Browse the catalogue →
          </Link>
        </div>
      )}

      <div className="space-y-3">
        {items.map((order) => (
          <Link
            key={order._id}
            to={`/orders/${order._id}`}
            className="block rounded-[var(--radius-panel)] border border-neutral-200 bg-surface-alt p-4 transition hover:border-accent"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-ink">
                  Order #{order._id.slice(-8).toUpperCase()}
                </p>
                <p className="mt-1 text-xs text-neutral-500">
                  {new Date(order.createdAt).toLocaleDateString('en-PK', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                  {' · '}
                  {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-ink">{formatPrice(order.total)}</p>
                <span className="mt-1 inline-block rounded-full bg-white px-2 py-0.5 text-xs font-medium text-accent ring-1 ring-inset ring-accent/30">
                  {order.status}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}