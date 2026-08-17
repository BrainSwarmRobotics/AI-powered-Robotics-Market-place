import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowLeft } from 'lucide-react';
import { fetchCustomerById, clearSelectedCustomer } from '../../redux/slices/adminCustomersSlice';

export default function AdminCustomerDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const {
    selectedCustomer: customer,
    selectedOrders: orders,
    selectedOrderCount: orderCount,
    selectedTotalSpent: totalSpent,
    detailLoading,
    detailError,
  } = useSelector((state) => state.adminCustomers);

  useEffect(() => {
    dispatch(fetchCustomerById(id));
    return () => dispatch(clearSelectedCustomer());
  }, [dispatch, id]);

  if (detailLoading) {
    return <p className="text-sm text-neutral-600">Loading customer…</p>;
  }

  if (detailError) {
    return <p className="text-sm text-danger">{detailError}</p>;
  }

  if (!customer) {
    return null;
  }

  return (
    <div>
      <Link to="/admin/customers" className="inline-flex items-center gap-1.5 text-sm text-neutral-600 hover:text-ink">
        <ArrowLeft size={16} />
        Back to customers
      </Link>

      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-ink">{customer.name}</h1>
          <p className="mt-1 text-sm text-neutral-600">{customer.email}</p>
        </div>
        <span className="rounded-control bg-accent-soft px-2.5 py-1 text-xs font-medium capitalize text-accent">
          {customer.role}
        </span>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Orders placed" value={orderCount} />
        <StatCard label="Lifetime order value" value={`Rs ${totalSpent.toLocaleString()}`} />
        <StatCard
          label="Address on file"
          value={customer.address?.city ? `${customer.address.city}, ${customer.address.country || '—'}` : 'Not provided'}
        />
      </div>

      <section className="mt-8">
        <h2 className="text-sm font-semibold text-ink">Order history</h2>
        {orders.length === 0 ? (
          <p className="mt-3 text-sm text-neutral-600">No orders yet.</p>
        ) : (
          <div className="mt-3 overflow-x-auto rounded-panel border border-neutral-200 bg-surface">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-neutral-200 text-neutral-600">
                <tr>
                  <th className="px-4 py-3 font-medium">Order</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Payment</th>
                  <th className="px-4 py-3 font-medium">Total</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o._id} className="border-b border-neutral-200 last:border-0">
                    <td className="px-4 py-3 font-mono text-xs text-neutral-600">{o._id}</td>
                    <td className="px-4 py-3 text-ink">{o.status}</td>
                    <td className="px-4 py-3 text-neutral-600">
                      {o.paymentMethod} · {o.paymentStatus}
                    </td>
                    <td className="px-4 py-3 font-medium text-ink">Rs {o.total.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="mt-8">
        <h2 className="text-sm font-semibold text-ink">Subscription</h2>
        <div className="mt-3 rounded-panel border border-neutral-200 bg-surface p-6 text-center text-sm text-neutral-600">
          Subscription plans aren't built yet — this lands in D3.
        </div>
      </section>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="rounded-panel border border-neutral-200 bg-surface p-4">
      <p className="text-xs text-neutral-600">{label}</p>
      <p className="mt-1 text-lg font-semibold text-ink">{value}</p>
    </div>
  );
}