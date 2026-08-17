import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { CheckCircle2, Download } from 'lucide-react';
import API from '../api/axios';

function formatPrice(price) {
  return new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency: 'PKR',
    maximumFractionDigits: 0,
  }).format(price ?? 0);
}

export default function OrderConfirmation() {
  const { id } = useParams();
  const order = useSelector((state) => state.orders.lastOrder);
  const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState(null);

  async function handleDownloadInvoice() {
    setDownloading(true);
    setDownloadError(null);
    try {
      const response = await API.get(`/orders/${order._id}/invoice`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `invoice-${order._id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setDownloadError('Could not download invoice. Please try again.');
    } finally {
      setDownloading(false);
    }
  }

  // lastOrder only exists right after Checkout.jsx's createOrder succeeds —
  // a direct refresh/typed URL loses it. Real order lookup by ID (GET
  // /api/orders/:id, already built server-side) is wired up when order
  // history gets a page of its own; not duplicated here to keep this pass scoped.
  if (!order || order._id !== id) {
    return (
      <div className="py-24 text-center">
        <h1 className="text-xl font-semibold text-ink">Order details unavailable</h1>
        <p className="mt-2 text-sm text-neutral-600">
          Refreshing this page loses the order summary for now — order history is a later task.
        </p>
        <Link to="/products" className="mt-4 inline-block text-sm font-medium text-accent hover:underline">
          Continue shopping →
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-16 text-center">
      <CheckCircle2 size={48} className="mx-auto text-success" />
      <h1 className="mt-4 text-2xl font-semibold text-ink">Order placed</h1>
      <p className="mt-2 text-sm text-neutral-600">
        Order #{order._id.slice(-8).toUpperCase()} — status: {order.status}
      </p>

      <div className="mt-6 rounded-[var(--radius-panel)] border border-neutral-200 bg-surface-alt p-4 text-left">
        {order.items.map((item) => (
          <div key={item.product} className="flex justify-between py-1 text-sm text-neutral-600">
            <span>
              {item.name} × {item.qty}
            </span>
            <span>{formatPrice(item.price * item.qty)}</span>
          </div>
        ))}
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
      {downloadError && <p className="mt-2 text-sm text-danger">{downloadError}</p>}

      <div>
        <Link to="/products" className="mt-6 inline-block text-sm font-medium text-accent hover:underline">
          Continue shopping →
        </Link>
      </div>
    </div>
  );
}