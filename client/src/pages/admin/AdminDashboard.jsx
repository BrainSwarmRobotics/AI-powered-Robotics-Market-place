import { Link } from 'react-router-dom';
import {
  Package,
  FolderTree,
  Boxes,
  Users,
  ShoppingCart,
  Tag,
  Star,
  BarChart3,
} from 'lucide-react';

const SECTIONS = [
  { to: '/admin/products', label: 'Products', desc: 'Add, edit, and manage catalogue items.', icon: Package },
  { to: '/admin/categories', label: 'Categories', desc: 'Organize the product taxonomy.', icon: FolderTree },
  { to: '/admin/inventory', label: 'Inventory', desc: 'Stock levels and low-stock alerts.', icon: Boxes },
  { to: '/admin/customers', label: 'Customers', desc: 'Profiles, orders, and subscriptions.', icon: Users },
  { to: '/admin/orders', label: 'Orders', desc: 'Status, refunds, and invoices.', icon: ShoppingCart },
  { to: '/admin/coupons', label: 'Coupons', desc: 'Percentage, fixed, and time-limited codes.', icon: Tag },
  { to: '/admin/reviews', label: 'Reviews', desc: 'Moderate customer feedback.', icon: Star },
  { to: '/admin/analytics', label: 'Analytics', desc: 'Sales and product performance.', icon: BarChart3 },
];

export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-xl font-semibold text-ink">Dashboard</h1>
      <p className="mt-1 text-sm text-neutral-600">
        Section pages below are stubs — each is built out in its own task (C2–C4).
      </p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {SECTIONS.map(({ to, label, desc, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            className="group rounded-panel border border-neutral-200 bg-surface p-5 transition-colors hover:border-accent"
          >
            <Icon size={20} className="text-accent-teal" />
            <h2 className="mt-3 text-sm font-semibold text-ink">{label}</h2>
            <p className="mt-1 text-sm text-neutral-600">{desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}