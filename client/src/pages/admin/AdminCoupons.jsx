import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import {
  fetchCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  clearCouponFormError,
} from '../../redux/slices/adminCouponsSlice';

const EMPTY_FORM = {
  code: '',
  type: 'percentage',
  value: '',
  minOrderValue: '',
  maxDiscount: '',
  expiresAt: '',
  usageLimit: '',
  isActive: true,
};

function formatCurrency(n) {
  return `Rs ${Number(n || 0).toLocaleString('en-PK')}`;
}

export default function AdminCoupons() {
  const dispatch = useDispatch();
  const { items, totalCoupons, loading, error, formLoading, formError } = useSelector(
    (state) => state.adminCoupons
  );

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);

  useEffect(() => {
    dispatch(fetchCoupons({ page: 1, limit: 50 }));
  }, [dispatch]);

  const openCreate = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    dispatch(clearCouponFormError());
    setModalOpen(true);
  };

  const openEdit = (coupon) => {
    setEditingId(coupon._id);
    setForm({
      code: coupon.code,
      type: coupon.type,
      value: coupon.value,
      minOrderValue: coupon.minOrderValue || '',
      maxDiscount: coupon.maxDiscount || '',
      expiresAt: coupon.expiresAt ? coupon.expiresAt.slice(0, 10) : '',
      usageLimit: coupon.usageLimit || '',
      isActive: coupon.isActive,
    });
    dispatch(clearCouponFormError());
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      code: form.code,
      type: form.type,
      value: Number(form.value),
      minOrderValue: form.minOrderValue ? Number(form.minOrderValue) : 0,
      maxDiscount: form.maxDiscount ? Number(form.maxDiscount) : null,
      expiresAt: form.expiresAt,
      usageLimit: form.usageLimit ? Number(form.usageLimit) : null,
      isActive: form.isActive,
    };

    const action = editingId
      ? await dispatch(updateCoupon({ id: editingId, ...payload }))
      : await dispatch(createCoupon(payload));

    if (!action.error) {
      setModalOpen(false);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this coupon? This cannot be undone.')) {
      dispatch(deleteCoupon(id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-ink">Coupons</h1>
          <p className="mt-1 text-sm text-neutral-600">{totalCoupons} coupon{totalCoupons === 1 ? '' : 's'}</p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="inline-flex items-center gap-2 rounded-control bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-blue"
        >
          <Plus size={16} /> New coupon
        </button>
      </div>

      {error && (
        <div className="rounded-control border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">{error}</div>
      )}

      <div className="overflow-x-auto rounded-panel border border-neutral-200 bg-surface">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="border-b border-neutral-200 bg-surface-alt text-xs uppercase tracking-wide text-neutral-600">
            <tr>
              <th className="px-4 py-3 font-medium">Code</th>
              <th className="px-4 py-3 font-medium">Discount</th>
              <th className="px-4 py-3 font-medium">Min order</th>
              <th className="px-4 py-3 font-medium">Usage</th>
              <th className="px-4 py-3 font-medium">Expires</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-neutral-600">Loading coupons…</td></tr>
            )}
            {!loading && items.length === 0 && (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-neutral-600">No coupons yet.</td></tr>
            )}
            {!loading && items.map((coupon) => {
              const expired = new Date(coupon.expiresAt) < new Date();
              return (
                <tr key={coupon._id} className="border-b border-neutral-200 last:border-0">
                  <td className="px-4 py-3 font-mono text-xs font-medium text-ink">{coupon.code}</td>
                  <td className="px-4 py-3 text-neutral-600">
                    {coupon.type === 'percentage' ? `${coupon.value}%` : formatCurrency(coupon.value)}
                    {coupon.type === 'percentage' && coupon.maxDiscount ? ` (cap ${formatCurrency(coupon.maxDiscount)})` : ''}
                  </td>
                  <td className="px-4 py-3 text-neutral-600">{coupon.minOrderValue ? formatCurrency(coupon.minOrderValue) : '—'}</td>
                  <td className="px-4 py-3 text-neutral-600">
                    {coupon.usedCount || 0}{coupon.usageLimit ? ` / ${coupon.usageLimit}` : ''}
                  </td>
                  <td className="px-4 py-3 text-neutral-600">{new Date(coupon.expiresAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block rounded-control px-2 py-1 text-xs font-medium ${
                        !coupon.isActive
                          ? 'bg-neutral-200 text-neutral-600'
                          : expired
                          ? 'bg-danger/10 text-danger'
                          : 'bg-success/10 text-success'
                      }`}
                    >
                      {!coupon.isActive ? 'Disabled' : expired ? 'Expired' : 'Active'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => openEdit(coupon)}
                        className="rounded-control p-1.5 text-neutral-600 hover:bg-neutral-100 hover:text-ink"
                        aria-label={`Edit ${coupon.code}`}
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(coupon._id)}
                        className="rounded-control p-1.5 text-neutral-600 hover:bg-danger/10 hover:text-danger"
                        aria-label={`Delete ${coupon.code}`}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4">
          <div className="w-full max-w-md rounded-panel border border-neutral-200 bg-surface p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-ink">{editingId ? 'Edit coupon' : 'New coupon'}</h2>
              <button type="button" onClick={() => setModalOpen(false)} className="text-neutral-600 hover:text-ink">
                <X size={18} />
              </button>
            </div>

            {formError && (
              <div className="mb-3 rounded-control border border-danger/30 bg-danger/10 px-3 py-2 text-xs text-danger">
                {formError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-neutral-600">Code</label>
                <input
                  type="text"
                  required
                  value={form.code}
                  onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                  className="w-full rounded-control border border-neutral-200 bg-surface-alt px-3 py-2 text-sm uppercase text-ink focus:border-accent focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-medium text-neutral-600">Type</label>
                  <select
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                    className="w-full rounded-control border border-neutral-200 bg-surface-alt px-3 py-2 text-sm text-ink focus:border-accent focus:outline-none"
                  >
                    <option value="percentage">Percentage</option>
                    <option value="fixed">Fixed amount</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-neutral-600">
                    Value {form.type === 'percentage' ? '(%)' : '(Rs)'}
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={form.value}
                    onChange={(e) => setForm({ ...form, value: e.target.value })}
                    className="w-full rounded-control border border-neutral-200 bg-surface-alt px-3 py-2 text-sm text-ink focus:border-accent focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-medium text-neutral-600">Min order value</label>
                  <input
                    type="number"
                    min="0"
                    value={form.minOrderValue}
                    onChange={(e) => setForm({ ...form, minOrderValue: e.target.value })}
                    className="w-full rounded-control border border-neutral-200 bg-surface-alt px-3 py-2 text-sm text-ink focus:border-accent focus:outline-none"
                  />
                </div>
                {form.type === 'percentage' && (
                  <div>
                    <label className="mb-1 block text-xs font-medium text-neutral-600">Max discount cap</label>
                    <input
                      type="number"
                      min="0"
                      value={form.maxDiscount}
                      onChange={(e) => setForm({ ...form, maxDiscount: e.target.value })}
                      className="w-full rounded-control border border-neutral-200 bg-surface-alt px-3 py-2 text-sm text-ink focus:border-accent focus:outline-none"
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-medium text-neutral-600">Expires on</label>
                  <input
                    type="date"
                    required
                    value={form.expiresAt}
                    onChange={(e) => setForm({ ...form, expiresAt: e.target.value })}
                    className="w-full rounded-control border border-neutral-200 bg-surface-alt px-3 py-2 text-sm text-ink focus:border-accent focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-neutral-600">Usage limit</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="Unlimited"
                    value={form.usageLimit}
                    onChange={(e) => setForm({ ...form, usageLimit: e.target.value })}
                    className="w-full rounded-control border border-neutral-200 bg-surface-alt px-3 py-2 text-sm text-ink placeholder:text-neutral-400 focus:border-accent focus:outline-none"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 text-sm text-neutral-600">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                  className="rounded border-neutral-200"
                />
                Active
              </label>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-control border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-600 hover:bg-neutral-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="rounded-control bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-blue disabled:opacity-60"
                >
                  {formLoading ? 'Saving…' : editingId ? 'Save changes' : 'Create coupon'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}