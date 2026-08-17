import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowLeft } from 'lucide-react';
import {
  fetchAdminOrderById,
  updateAdminOrderStatus,
  updateAdminOrderRefund,
  clearSelectedAdminOrder,
} from '../../redux/slices/adminOrdersSlice';

const ORDER_STATUSES = ['Confirmed', 'Processing', 'Packed', 'Shipped', 'Delivered', 'Cancelled'];
const REFUND_STATUSES = ['None', 'Requested', 'Approved', 'Rejected', 'Refunded'];

function formatCurrency(n) {
  return `Rs ${Number(n || 0).toLocaleString('en-PK')}`;
}

export default function AdminOrderDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { selectedOrder: order, detailLoading, detailError, actionLoading, actionError } = useSelector(
    (state) => state.adminOrders
  );

  const [refundReason, setRefundReason] = useState('');

  useEffect(() => {
    dispatch(fetchAdminOrderById(id));
    return () => dispatch(clearSelectedAdminOrder());
  }, [dispatch, id]);

  if (detailLoading && !order) {
    return <div className="py-16 text-center text-neutral-600">Loading order…</div>;
  }

  if (detailError) {
    return <div className="py-16 text-center text-danger">{detailError}</div>;
  }

  if (!order) return null;

  const isTerminal = ['Delivered', 'Cancelled'].includes(order.status);

  return (
    <div className="space-y-6">
      <Link to="/admin/orders" className="inline-flex items-center gap-1 text-sm text-neutral-600 hover:text-ink">
        <ArrowLeft size={16} /> Back to orders
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-ink">
            Order #{order._id.slice(-8).toUpperCase()}
          </h1>
          <p className="mt-1 text-sm text-neutral-600">
            Placed {new Date(order.createdAt).toLocaleString()} by {order.user?.name} ({order.user?.email})
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-semibold text-ink">{formatCurrency(order.total)}</div>
          <div className="text-xs text-neutral-600">{order.paymentMethod} · {order.paymentStatus}</div>
        </div>
      </div>

      {actionError && (
        <div className="rounded-control border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
          {actionError}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-panel border border-neutral-200 bg-surface p-5">
            <h2 className="mb-4 text-sm font-semibold text-ink">Items</h2>
            <div className="divide-y divide-neutral-200">
              {order.items.map((item, i) => (
                <div key={i} className="flex items-center gap-4 py-3">
                  <div className="h-14 w-14 shrink-0 overflow-hidden rounded-control bg-surface-alt">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-[10px] text-neutral-400">
                        No image
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-ink">{item.name}</div>
                    <div className="text-xs text-neutral-600">Qty {item.qty} · {formatCurrency(item.price)} each</div>
                  </div>
                  <div className="text-sm font-medium text-ink">{formatCurrency(item.price * item.qty)}</div>
                </div>
              ))}
            </div>
            <div className="mt-4 space-y-1 border-t border-neutral-200 pt-4 text-sm">
              <div className="flex justify-between text-neutral-600">
                <span>Subtotal</span><span>{formatCurrency(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-neutral-600">
                <span>Shipping</span><span>{formatCurrency(order.shipping)}</span>
              </div>
              <div className="flex justify-between font-semibold text-ink">
                <span>Total</span><span>{formatCurrency(order.total)}</span>
              </div>
            </div>
          </div>

          <div className="rounded-panel border border-neutral-200 bg-surface p-5">
            <h2 className="mb-3 text-sm font-semibold text-ink">Shipping address</h2>
            <p className="text-sm text-neutral-600">
              {order.shippingAddress.street}, {order.shippingAddress.city}
              {order.shippingAddress.state ? `, ${order.shippingAddress.state}` : ''}
              {order.shippingAddress.postalCode ? ` ${order.shippingAddress.postalCode}` : ''}
              {order.shippingAddress.country ? `, ${order.shippingAddress.country}` : ''}
            </p>
            {order.shippingAddress.phone && (
              <p className="mt-1 text-sm text-neutral-600">Phone: {order.shippingAddress.phone}</p>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-panel border border-neutral-200 bg-surface p-5">
            <h2 className="mb-3 text-sm font-semibold text-ink">Order status</h2>
            <select
              value={order.status}
              disabled={isTerminal || actionLoading}
              onChange={(e) => dispatch(updateAdminOrderStatus({ id: order._id, status: e.target.value }))}
              className="w-full rounded-control border border-neutral-200 bg-surface-alt px-3 py-2 text-sm text-ink disabled:opacity-60"
            >
              {ORDER_STATUSES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            {isTerminal && (
              <p className="mt-2 text-xs text-neutral-400">
                This order is {order.status.toLowerCase()} and can't be moved further.
              </p>
            )}
          </div>

          <div className="rounded-panel border border-neutral-200 bg-surface p-5">
            <h2 className="mb-3 text-sm font-semibold text-ink">Refund</h2>
            <p className="mb-2 text-xs text-neutral-600">
              Current: <span className="font-medium text-ink">{order.refundStatus || 'None'}</span>
              {order.refundedAt && ` on ${new Date(order.refundedAt).toLocaleDateString()}`}
            </p>
            {order.refundReason && (
              <p className="mb-3 text-xs text-neutral-600">Note: {order.refundReason}</p>
            )}

            {order.refundStatus !== 'Refunded' ? (
              <div className="space-y-2">
                <textarea
                  value={refundReason}
                  onChange={(e) => setRefundReason(e.target.value)}
                  placeholder="Reason / admin note (optional)"
                  rows={2}
                  className="w-full rounded-control border border-neutral-200 bg-surface-alt px-3 py-2 text-sm text-ink placeholder:text-neutral-400 focus:border-accent focus:outline-none"
                />
                <div className="flex flex-wrap gap-2">
                  {REFUND_STATUSES.filter((s) => s !== 'None').map((s) => (
                    <button
                      key={s}
                      type="button"
                      disabled={actionLoading}
                      onClick={() =>
                        dispatch(updateAdminOrderRefund({ id: order._id, status: s, reason: refundReason }))
                      }
                      className="rounded-control border border-neutral-200 px-3 py-1.5 text-xs font-medium text-neutral-600 hover:border-accent hover:text-accent disabled:opacity-50"
                    >
                      Mark {s}
                    </button>
                  ))}
                </div>
                {order.paymentMethod === 'Card' && (
                  <p className="text-[11px] text-neutral-400">
                    "Mark Refunded" on a card order triggers a real Stripe refund against the original payment intent.
                  </p>
                )}
              </div>
            ) : (
              <p className="text-xs text-success">
                Refund completed{order.refundAmount ? ` — ${formatCurrency(order.refundAmount)}` : ''}.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}