import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Scale, ShoppingCart, Check } from 'lucide-react';
import ImagePlaceholder from './ImagePlaceholder';
import WishlistButton from './ui/WishlistButton';
import { toggleWishlist } from '../redux/slices/wishlistSlice';
import { toggleCompare } from '../redux/slices/compareSlice';
import { addToCart } from '../redux/slices/cartSlice';

function formatPrice(price) {
  if (price == null) return '—';
  return new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency: 'PKR',
    maximumFractionDigits: 0,
  }).format(price);
}

export default function ProductCard({ product }) {
  const dispatch = useDispatch();
  const wishlistItems = useSelector((state) => state.wishlist.items);
  const compareItems = useSelector((state) => state.compare.items);
  const [justAdded, setJustAdded] = useState(false);

  const isWishlisted = wishlistItems.some((i) => i._id === product._id);
  const isComparing = compareItems.some((i) => i._id === product._id);
  const image = product.images?.[0]?.url;

  function handleAddToCart(e) {
    e.preventDefault(); // card image/name are links — don't navigate on this click
    dispatch(addToCart({ productId: product._id, qty: 1 }));
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  }

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-[var(--radius-panel)] border border-neutral-200 bg-surface transition-shadow hover:shadow-md">
      <div className="absolute right-2 top-2 z-10">
        <WishlistButton
          active={isWishlisted}
          onClick={() => dispatch(toggleWishlist(product))}
        />
      </div>

      <Link to={`/products/${product._id}`} className="block">
        <div className="aspect-square w-full bg-surface-alt">
          {image ? (
            <img
              src={image}
              alt={product.name}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          ) : (
            <ImagePlaceholder className="h-full w-full" />
          )}
        </div>
      </Link>

      <div className="flex flex-1 flex-col gap-1 p-3">
        {product.category && (
          <span className="text-xs font-medium uppercase tracking-wide text-neutral-600">
            {product.category}
          </span>
        )}
        <Link
          to={`/products/${product._id}`}
          className="line-clamp-2 text-sm font-semibold text-ink hover:text-accent"
        >
          {product.name}
        </Link>
        <div className="mt-1 flex items-center justify-between">
          <span className="text-base font-semibold text-accent">
            {formatPrice(product.price)}
          </span>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => dispatch(toggleCompare(product))}
              aria-pressed={isComparing}
              aria-label={isComparing ? 'Remove from compare' : 'Add to compare'}
              className={`inline-flex h-7 w-7 items-center justify-center rounded-full border transition-colors
                ${isComparing ? 'border-accent text-accent' : 'border-neutral-200 text-neutral-600 hover:border-accent hover:text-accent'}`}
            >
              <Scale size={14} />
            </button>
            <button
              type="button"
              onClick={handleAddToCart}
              aria-label="Add to cart"
              className={`inline-flex h-7 w-7 items-center justify-center rounded-full border transition-colors
                ${justAdded ? 'border-success text-success' : 'border-neutral-200 text-neutral-600 hover:border-accent hover:text-accent'}`}
            >
              {justAdded ? <Check size={14} /> : <ShoppingCart size={14} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
