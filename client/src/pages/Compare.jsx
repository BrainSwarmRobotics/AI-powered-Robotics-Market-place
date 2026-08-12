import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';
import { toggleCompare, clearCompare } from '../redux/slices/compareSlice';
import Card from '../components/ui/Card';
import ImagePlaceholder from '../components/ImagePlaceholder';

const COMPARE_FIELDS = [
  { key: 'price', label: 'Price', format: (v) => `Rs. ${v?.toLocaleString()}` },
  { key: 'manufacturer', label: 'Manufacturer' },
  { key: 'category', label: 'Category' },
  { key: 'processor', label: 'Processor' },
  { key: 'sensors', label: 'Sensors' },
  { key: 'battery', label: 'Battery' },
  { key: 'maxSpeed', label: 'Max Speed' },
  { key: 'warranty', label: 'Warranty' },
  { key: 'stock', label: 'Stock' },
  { key: 'communicationProtocols', label: 'Communication Protocols' },
  { key: 'utility', label: 'Utility' },
];

export default function Compare() {
  const dispatch = useDispatch();
  const items = useSelector((state) => state.compare.items);

  if (items.length === 0) {
    return (
      <div className="py-24 text-center">
        <h1 className="text-xl font-semibold text-ink">Nothing to compare yet</h1>
        <p className="mt-2 text-sm text-neutral-600">
          Add up to 3 products from the catalogue to compare them side by side.
        </p>
        <Link
          to="/products"
          className="mt-4 inline-block text-sm font-medium text-accent-blue hover:underline"
        >
          Browse the catalogue →
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-ink">
          Compare Products{' '}
          <span className="text-base font-medium text-accent-blue">({items.length}/3)</span>
        </h1>
        <button
          onClick={() => dispatch(clearCompare())}
          className="rounded-[var(--radius-control)] border border-accent-blue px-4 py-2 text-sm
            font-medium text-accent-blue transition-colors hover:bg-accent-soft"
        >
          Clear All
        </button>
      </div>

      <Card className="overflow-x-auto p-0">
        <table className="w-full min-w-[640px] border-collapse text-sm">
          <thead>
            <tr className="bg-accent-soft">
              <th className="w-44 p-4 text-left" />
              {items.map((product) => (
                <th key={product._id} className="border-l border-neutral-200 p-4 text-center align-top">
                  <div className="mx-auto h-36 w-36 overflow-hidden rounded-[var(--radius-panel)] border border-neutral-200 bg-surface">
                    {product.images?.[0]?.url ? (
                      <img
                        src={product.images[0].url}
                        alt={product.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <ImagePlaceholder className="h-full w-full" />
                    )}
                  </div>
                  <Link
                    to={`/products/${product._id}`}
                    className="mt-3 block text-sm font-semibold text-ink hover:text-accent-blue"
                  >
                    {product.name}
                  </Link>
                  <button
                    onClick={() => dispatch(toggleCompare(product))}
                    aria-label={`Remove ${product.name} from compare`}
                    className="mt-2 inline-flex items-center gap-1 rounded-[var(--radius-control)] border
                      border-accent-blue px-3 py-1 text-xs font-medium text-accent-blue
                      transition-colors hover:bg-accent-soft"
                  >
                    <X size={12} />
                    Remove
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {COMPARE_FIELDS.map((field, i) => (
              <tr
                key={field.key}
                className={`border-t border-neutral-100 ${i % 2 === 1 ? 'bg-surface-alt' : ''}`}
              >
                <td className="p-4 text-xs font-semibold uppercase tracking-wide text-accent-blue">
                  {field.label}
                </td>
                {items.map((product) => (
                  <td key={product._id} className="border-l border-neutral-100 p-4 text-center text-ink">
                    {product[field.key]
                      ? field.format
                        ? field.format(product[field.key])
                        : product[field.key]
                      : '—'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}