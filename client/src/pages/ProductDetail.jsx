import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Scale, ChevronLeft, ShoppingCart, Check, Minus, Plus } from 'lucide-react';
import { fetchProductById, clearSelectedProduct } from '../redux/slices/productSlice';
import { toggleWishlist } from '../redux/slices/wishlistSlice';
import { toggleCompare } from '../redux/slices/compareSlice';
import { addToCart } from '../redux/slices/cartSlice';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Card from '../components/ui/Card';
import WishlistButton from '../components/ui/WishlistButton';
import ImagePlaceholder from '../components/ImagePlaceholder';
import ReviewsSection from '../components/ReviewsSection';

function formatPrice(price) {
  if (price == null) return '—';
  return new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency: 'PKR',
    maximumFractionDigits: 0,
  }).format(price);
}

function specRows(product) {
  return [
    ['Manufacturer', product.manufacturer],
    ['Category', product.category],
    ['Processor', product.processor],
    ['Sensors', product.sensors],
    ['Battery', product.battery],
    ['Max Speed', product.maxSpeed],
    ['Warranty', product.warranty],
    ['Communication Protocols', product.communicationProtocols],
    ['Utility', product.utility],
    ['Documentation', product.documentation],
  ].filter(([, value]) => value && value !== '-');
}

function StockBadge({ stock }) {
  if (stock == null) return null;
  if (stock <= 0) return <Badge tone="danger">Out of stock</Badge>;
  if (stock <= 3) return <Badge tone="warning">Low stock — {stock} left</Badge>;
  return <Badge tone="success">In stock</Badge>;
}

export default function ProductDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [activeImage, setActiveImage] = useState(0);
  const [qty, setQty] = useState(1);
  const [justAdded, setJustAdded] = useState(false);

  const { selectedProduct: product, detailLoading, detailError } = useSelector(
    (state) => state.products
  );
  const wishlistItems = useSelector((state) => state.wishlist.items);
  const compareItems = useSelector((state) => state.compare.items);

  const isWishlisted = product ? wishlistItems.some((p) => p._id === product._id) : false;
  const isComparing = product ? compareItems.some((p) => p._id === product._id) : false;
  const outOfStock = product ? (product.stock ?? 0) <= 0 : false;

  useEffect(() => {
    dispatch(fetchProductById(id));
    return () => dispatch(clearSelectedProduct());
  }, [dispatch, id]);

  useEffect(() => {
    setActiveImage(0);
    setQty(1);
  }, [id]);

  function handleAddToCart() {
    if (!product || outOfStock) return;
    dispatch(addToCart({ productId: product._id, qty }));
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  }

  if (detailLoading) {
    return <div className="py-24 text-center text-sm text-neutral-600">Loading product…</div>;
  }
  if (detailError) {
    return <div className="py-24 text-center text-sm text-danger">{detailError}</div>;
  }
  if (!product) return null;

  const images = product.images || [];
  const hasImages = images.length > 0;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <Link
        to="/products"
        className="inline-flex items-center gap-1 text-sm font-medium text-neutral-600 hover:text-accent-blue"
      >
        <ChevronLeft size={16} />
        Back to Catalogue
      </Link>

      <div className="mt-6 grid grid-cols-1 gap-10 lg:grid-cols-2">
        <div>
          <div className="aspect-square w-full overflow-hidden rounded-[var(--radius-panel)] border border-neutral-200 bg-surface-alt">
            {hasImages ? (
              <img
                src={images[activeImage].url}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <ImagePlaceholder className="h-full w-full" />
            )}
          </div>

          {images.length > 1 && (
            <div className="mt-3 flex gap-2">
              {images.map((img, i) => (
                <button
                  key={img.public_id || i}
                  onClick={() => setActiveImage(i)}
                  className={`h-16 w-16 overflow-hidden rounded-[var(--radius-control)] border-2 transition-colors
                    ${i === activeImage ? 'border-accent-blue' : 'border-transparent'}`}
                >
                  <img src={img.url} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          {product.category && (
            <Badge tone="accent" className="uppercase tracking-wide">
              {product.category}
            </Badge>
          )}
          <h1 className="mt-2 text-2xl font-semibold text-ink">{product.name}</h1>

          <div className="mt-3 flex items-center gap-3">
            <span className="text-2xl font-semibold text-accent">
              {formatPrice(product.price)}
            </span>
            <StockBadge stock={product.stock} />
          </div>

          {/* Primary action: quantity + Add to Cart */}
          <div className="mt-5 flex items-center gap-3">
            <div className="flex items-center rounded-[var(--radius-control)] border border-neutral-200">
              <button
                type="button"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                disabled={qty <= 1 || outOfStock}
                aria-label="Decrease quantity"
                className="flex h-10 w-10 items-center justify-center text-neutral-600 hover:text-accent disabled:opacity-40"
              >
                <Minus size={14} />
              </button>
              <span className="w-8 text-center text-sm font-medium text-ink">{qty}</span>
              <button
                type="button"
                onClick={() => setQty((q) => q + 1)}
                disabled={outOfStock}
                aria-label="Increase quantity"
                className="flex h-10 w-10 items-center justify-center text-neutral-600 hover:text-accent disabled:opacity-40"
              >
                <Plus size={14} />
              </button>
            </div>

            <Button
              variant="primary"
              size="lg"
              onClick={handleAddToCart}
              disabled={outOfStock}
              className="flex-1"
            >
              {justAdded ? <Check size={16} /> : <ShoppingCart size={16} />}
              {outOfStock ? 'Out of Stock' : justAdded ? 'Added to Cart' : 'Add to Cart'}
            </Button>
          </div>

          {/* Secondary actions: wishlist + compare */}
          <div className="mt-3 flex items-center gap-2">
            <WishlistButton
              active={isWishlisted}
              onClick={() => dispatch(toggleWishlist(product))}
              size="lg"
            />
            <Button
              variant={isComparing ? 'primary' : 'secondary'}
              onClick={() => dispatch(toggleCompare(product))}
            >
              <Scale size={16} />
              {isComparing ? 'Added to Compare' : 'Add to Compare'}
            </Button>
          </div>

          {product.description && (
            <p className="mt-5 text-sm leading-relaxed text-neutral-600">{product.description}</p>
          )}

          <Card className="mt-6 border-t-4 border-t-accent-blue">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-accent-blue">
              Specifications
            </h2>
            <table className="w-full border-collapse text-sm">
              <tbody>
                {specRows(product).map(([label, value]) => (
                  <tr key={label} className="border-b border-neutral-100 last:border-0">
                    <td className="w-2/5 py-2 pr-4 text-neutral-600">{label}</td>
                    <td className="py-2 font-medium text-ink">{value}</td>
                  </tr>
                ))}
                {specRows(product).length === 0 && (
                  <tr>
                    <td className="py-2 text-neutral-500">No additional specifications listed.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </Card>

          {product.educationalApplications && (
            <Card className="mt-4 border-l-4 border-l-accent-teal">
              <h3 className="mb-1 text-sm font-semibold text-ink">Educational Applications</h3>
              <p className="text-sm text-neutral-600">{product.educationalApplications}</p>
            </Card>
          )}

          {product.researchApplications && (
            <Card className="mt-4 border-l-4 border-l-accent-teal">
              <h3 className="mb-1 text-sm font-semibold text-ink">Research Applications</h3>
              <p className="text-sm text-neutral-600">{product.researchApplications}</p>
            </Card>
          )}
        </div>
      </div>

      <ReviewsSection productId={product._id} />

      <Card className="mt-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-accent-blue">
          Similar Products
        </h2>
        <p className="mt-2 text-sm text-neutral-500">
          Recommendations aren't live yet — check back soon.
        </p>
      </Card>
    </div>
  );
}