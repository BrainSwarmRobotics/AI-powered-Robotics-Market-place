import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Download } from 'lucide-react';
import { fetchOrderById, clearCurrentOrder } from '../redux/slices/orderSlice';
import OrderStatusTracker from '../components/OrderStatusTracker';
import API from '../api/axios';

function formatPrice(price) {
  return new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency: 'PKR',
    maximumFractionDigits: 0,
  }).format(price ?? 0);
}

export default function OrderDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { currentOrder: order, detailLoading, detailError } = useSelector((state) => state.orders);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    dispatch(fetchOrderById(id));
    return () => dispatch(clearCurrentOrder());
  }, [dispatch, id]);

  async function handleDownloadInvoice() {
    setDownloading(true);
    try {
      const response = await API.get(`/orders/${id}/invoice`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `invoice-${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      // Non-blocking — invoice download failing shouldn't break the page
    } finally {
      setDownloading(false);
    }
  }

  if (detailLoading) {
    return <p className="py-16 text-center text-sm text-neutral-600">Loading order...</p>;
  }

  if (detailError || !order) {
    return (
      <div className="py-24 text-center">
        <h1 className="text-xl font-semibold text-ink">Order not found</h1>
        <Link to="/orders" className="mt-4 inline-block text-sm font-medium text-accent hover:underline">
          Back to my orders →
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <Link to="/orders" className="text-sm font-medium text-accent hover:underline">
        ← Back to my orders
      </Link>

      <h1 className="mt-4 text-2xl font-semibold text-ink">
        Order #{order._id.slice(-8).toUpperCase()}
      </h1>
      <p className="mt-1 text-sm text-neutral-500">
        Placed {new Date(order.createdAt).toLocaleDateString('en-PK', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}
      </p>

      <div className="mt-8 rounded-[var(--radius-panel)] border border-neutral-200 bg-surface-alt p-6">
        <OrderStatusTracker status={order.status} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="rounded-[var(--radius-panel)] border border-neutral-200 p-4">
          <h2 className="text-sm font-semibold text-ink">Shipping Address</h2>
          <p className="mt-2 text-sm text-neutral-600">{order.shippingAddress.street}</p>
          <p className="text-sm text-neutral-600">
            {[order.shippingAddress.city, order.shippingAddress.state, order.shippingAddress.postalCode]
              .filter(Boolean)
              .join(', ')}
          </p>
          {order.shippingAddress.phone && (
            <p className="text-sm text-neutral-600">Phone: {order.shippingAddress.phone}</p>
          )}
        </div>

        <div className="rounded-[var(--radius-panel)] border border-neutral-200 p-4">
          <h2 className="text-sm font-semibold text-ink">Payment</h2>
          <p className="mt-2 text-sm text-neutral-600">Method: {order.paymentMethod}</p>
          <p className="text-sm text-neutral-600">Status: {order.paymentStatus}</p>
        </div>
      </div>

      <div className="mt-6 rounded-[var(--radius-panel)] border border-neutral-200 bg-surface-alt p-4">
        <h2 className="mb-3 text-sm font-semibold text-ink">Items</h2>
        {order.items.map((item) => (
          <div key={item.product} className="flex justify-between py-1 text-sm text-neutral-600">
            <span>
              {item.name} × {item.qty}
            </span>
            <span>{formatPrice(item.price * item.qty)}</span>
          </div>
        ))}
        <div className="mt-3 space-y-1 border-t border-neutral-200 pt-3 text-sm text-neutral-600">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{formatPrice(order.subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping</span>
            <span>{formatPrice(order.shipping)}</span>
          </div>
        </div>
        <div className="mt-2 flex justify-between border-t border-neutral-200 pt-2 text-sm font-semibold text-ink">
          <span>Total</span>
          <span>{formatPrice(order.total)}</span>
        </div>
      </div>

      <button
        onClick={handleDownloadInvoice}
        disabled={downloading}
        className="mt-6 inline-flex items-center gap-2 rounded-[var(--radius-panel)] border border-neutral-200 px-4 py-2 text-sm font-medium text-ink hover:bg-surface-alt disabled:opacity-50"
      >
        <Download size={16} />
        {downloading ? 'Preparing invoice...' : 'Download Invoice (PDF)'}
      </button>
    </div>
  );
}