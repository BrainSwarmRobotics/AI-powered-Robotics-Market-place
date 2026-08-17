import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { AlertTriangle, PackageX } from 'lucide-react';
import { fetchInventoryStatus } from '../../redux/slices/adminInventorySlice';

export default function AdminInventory() {
  const dispatch = useDispatch();
  const { outOfStock, lowStock, outOfStockCount, lowStockCount, threshold, loading, error } =
    useSelector((state) => state.adminInventory);

  useEffect(() => {
    dispatch(fetchInventoryStatus());
  }, [dispatch]);

  if (loading) {
    return <p className="text-sm text-neutral-600">Loading inventory…</p>;
  }

  if (error) {
    return <p className="text-sm text-danger">{error}</p>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-semibold text-ink">Inventory</h1>
        <p className="mt-1 text-sm text-neutral-600">Low-stock threshold is {threshold} units.</p>
      </div>

      <section>
        <div className="mb-3 flex items-center gap-2">
          <PackageX size={18} className="text-danger" />
          <h2 className="text-sm font-semibold text-ink">Out of stock ({outOfStockCount})</h2>
        </div>
        <InventoryTable products={outOfStock} emptyText="Nothing is out of stock." />
      </section>

      <section>
        <div className="mb-3 flex items-center gap-2">
          <AlertTriangle size={18} className="text-warning" />
          <h2 className="text-sm font-semibold text-ink">Low stock ({lowStockCount})</h2>
        </div>
        <InventoryTable products={lowStock} emptyText="Nothing is running low." />
      </section>
    </div>
  );
}

function InventoryTable({ products, emptyText }) {
  if (!products.length) {
    return (
      <div className="rounded-panel border border-neutral-200 bg-surface p-6 text-center text-sm text-neutral-600">
        {emptyText}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-panel border border-neutral-200 bg-surface">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-neutral-200 text-neutral-600">
          <tr>
            <th className="px-4 py-3 font-medium">Product</th>
            <th className="px-4 py-3 font-medium">Category</th>
            <th className="px-4 py-3 font-medium">Stock</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p._id} className="border-b border-neutral-200 last:border-0">
              <td className="px-4 py-3">
                <Link to={`/products/${p._id}`} className="font-medium text-ink hover:text-accent">
                  {p.name}
                </Link>
              </td>
              <td className="px-4 py-3 text-neutral-600">{p.category}</td>
              <td className="px-4 py-3 font-medium text-ink">{p.stock}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}