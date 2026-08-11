import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Trash2, ShoppingCart } from 'lucide-react';
import { removeFromWishlist } from '../redux/slices/wishlistSlice';
import { addToCart } from '../redux/slices/cartSlice';
import Button from '../components/ui/Button';
import ImagePlaceholder from '../components/ImagePlaceholder';

function formatPrice(price) {
  if (price == null) return '—';
  return new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency: 'PKR',
    maximumFractionDigits: 0,
  }).format(price);
}

export default function Wishlist() {
  const dispatch = useDispatch();
  const items = useSelector((state) => state.wishlist.items);

  const handleMoveToCart = (product) => {
    // Uses the current client-only cartSlice reducer. Once B1 lands and
    // cartSlice moves to async thunks, swap this for:
    // dispatch(addToCart({ productId: product._id, qty: 1 }))
    dispatch(addToCart(product));
    dispatch(removeFromWishlist(product._id));
  };

  if (items.length === 0) {
    return (
      <div className="py-24 text-center">
        <h1 className="text-xl font-semibold text-ink">Your wishlist is empty</h1>
        <p className="mt-2 text-sm text-neutral-600">
          Save products you're interested in and find them here later.
        </p>
        <Link to="/products" className="mt-4 inline-block text-sm font-medium text-accent hover:underline">
          Browse the catalogue →
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="mb-6 text-2xl font-semibold text-ink">Your Wishlist</h1>

      <div className="divide-y divide-neutral-200">
        {items.map((product) => (
          <div key={product._id} className="flex items-center gap-4 py-4">
            <Link
              to={`/products/${product._id}`}
              className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-[var(--radius-panel)] bg-surface-alt"
            >
              {product.images?.[0]?.url ? (
                <img
                  src={product.images[0].url}
                  alt={product.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <ImagePlaceholder className="h-full w-full" />
              )}
            </Link>

            <div className="flex-1">
              {product.category && (
                <span className="text-xs font-medium uppercase tracking-wide text-neutral-600">
                  {product.category}
                </span>
              )}
              <Link
                to={`/products/${product._id}`}
                className="block text-sm font-semibold text-ink hover:text-accent"
              >
                {product.name}
              </Link>
              <p className="mt-1 text-sm font-semibold text-accent">
                {formatPrice(product.price)}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button size="sm" onClick={() => handleMoveToCart(product)}>
                <ShoppingCart size={14} />
                Move to Cart
              </Button>
              <button
                onClick={() => dispatch(removeFromWishlist(product._id))}
                aria-label={`Remove ${product.name} from wishlist`}
                className="rounded-full p-2 text-neutral-500 hover:bg-neutral-100 hover:text-danger"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}