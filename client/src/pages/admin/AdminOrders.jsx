import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Search, Eye } from 'lucide-react';
import { fetchAdminOrders, updateAdminOrderStatus } from '../../redux/slices/adminOrdersSlice';

const ORDER_STATUSES = ['Confirmed', 'Processing', 'Packed', 'Shipped', 'Delivered', 'Cancelled'];
const PAYMENT_STATUSES = ['Pending', 'Paid', 'Failed', 'Refunded'];

const STATUS_STYLES = {
  Confirmed: 'bg-accent-soft text-accent',
  Processing: 'bg-warning/10 text-warning',
  Packed: 'bg-warning/10 text-warning',
  Shipped: 'bg-accent-blue/10 text-accent-blue',
  Delivered: 'bg-success/10 text-success',
  Cancelled: 'bg-danger/10 text-danger',
};

const PAYMENT_STYLES = {
  Pending: 'bg-warning/10 text-warning',
  Paid: 'bg-success/10 text-success',
  Failed: 'bg-danger/10 text-danger',
  Refunded: 'bg-neutral-200 text-neutral-600',
};

function formatCurrency(n) {
  return `Rs ${Number(n || 0).toLocaleString('en-PK')}`;
}

export default function AdminOrders() {
  const dispatch = useDispatch();
  const { items, totalOrders, currentPage, totalPages, loading, error } = useSelector(
    (state) => state.adminOrders
  );

  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    const params = { page, limit: 10 };
    if (search.trim()) params.search = search.trim();
    if (status) params.status = status;
    if (paymentStatus) params.paymentStatus = paymentStatus;
    dispatch(fetchAdminOrders(params));
  }, [dispatch, page, search, status, paymentStatus]);

  const handleStatusChange = (id, nextStatus) => {
    dispatch(updateAdminOrderStatus({ id, status: nextStatus }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-ink">Orders</h1>
        <p className="mt-1 text-sm text-neutral-600">
          {totalOrders} order{totalOrders === 1 ? '' : 's'} total
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3 rounded-panel border border-neutral-200 bg-surface p-4">
        <div className="relative min-w-[220px] flex-1">
          <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setPage(1);
              setSearch(e.target.value);
            }}
            placeholder="Search by order ID, customer name or email"
            className="w-full rounded-control border border-neutral-200 bg-surface-alt py-2 pl-9 pr-3 text-sm text-ink placeholder:text-neutral-400 focus:border-accent focus:outline-none"
          />
        </div>

        <select
          value={status}
          onChange={(e) => {
            setPage(1);
            setStatus(e.target.value);
          }}
          className="rounded-control border border-neutral-200 bg-surface-alt px-3 py-2 text-sm text-ink focus:border-accent focus:outline-none"
        >
          <option value="">All statuses</option>
          {ORDER_STATUSES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        <select
          value={paymentStatus}
          onChange={(e) => {
            setPage(1);
            setPaymentStatus(e.target.value);
          }}
          className="rounded-control border border-neutral-200 bg-surface-alt px-3 py-2 text-sm text-ink focus:border-accent focus:outline-none"
        >
          <option value="">All payment statuses</option>
          {PAYMENT_STATUSES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {error && (
        <div className="rounded-control border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
          {error}
        </div>
      )}

      <div className="overflow-x-auto rounded-panel border border-neutral-200 bg-surface">
        <table className="w-full min-w-[860px] text-left text-sm">
          <thead className="border-b border-neutral-200 bg-surface-alt text-xs uppercase tracking-wide text-neutral-600">
            <tr>
              <th className="px-4 py-3 font-medium">Order</th>
              <th className="px-4 py-3 font-medium">Customer</th>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">Total</th>
              <th className="px-4 py-3 font-medium">Payment</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Refund</th>
              <th className="px-4 py-3 text-right font-medium">Details</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-neutral-600">Loading orders…</td>
              </tr>
            )}

            {!loading && items.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-neutral-600">No orders match these filters.</td>
              </tr>
            )}

            {!loading && items.map((order) => (
              <tr key={order._id} className="border-b border-neutral-200 last:border-0">
                <td className="px-4 py-3 font-mono text-xs text-neutral-600">
                  #{order._id.slice(-8).toUpperCase()}
                </td>
                <td className="px-4 py-3">
                  <div className="text-ink">{order.user?.name || 'Deleted user'}</div>
                  <div className="text-xs text-neutral-600">{order.user?.email || '—'}</div>
                </td>
                <td className="px-4 py-3 text-neutral-600">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-3 font-medium text-ink">{formatCurrency(order.total)}</td>
                <td className="px-4 py-3">
                  <span className={`inline-block rounded-control px-2 py-1 text-xs font-medium ${PAYMENT_STYLES[order.paymentStatus] || 'bg-neutral-200 text-neutral-600'}`}>
                    {order.paymentMethod} · {order.paymentStatus}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <select
                    value={order.status}
                    disabled={['Delivered', 'Cancelled'].includes(order.status)}
                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                    className={`rounded-control border-0 px-2 py-1 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-accent disabled:opacity-70 ${STATUS_STYLES[order.status] || 'bg-neutral-200 text-neutral-600'}`}
                  >
                    {ORDER_STATUSES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-3">
                  {order.refundStatus && order.refundStatus !== 'None' ? (
                    <span className="inline-block rounded-control bg-neutral-200 px-2 py-1 text-xs font-medium text-neutral-600">
                      {order.refundStatus}
                    </span>
                  ) : (
                    <span className="text-xs text-neutral-400">—</span>
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    to={`/admin/orders/${order._id}`}
                    className="inline-flex items-center gap-1 text-xs font-medium text-accent hover:underline"
                  >
                    <Eye size={14} /> View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-neutral-600">
          <span>Page {currentPage} of {totalPages}</span>
          <div className="flex gap-2">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="rounded-control border border-neutral-200 px-3 py-1.5 disabled:opacity-40"
            >
              Previous
            </button>
            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="rounded-control border border-neutral-200 px-3 py-1.5 disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}