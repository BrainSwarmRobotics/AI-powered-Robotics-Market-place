import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, BookmarkPlus, RotateCcw } from 'lucide-react';
import {
  fetchCart,
  updateQty,
  removeFromCart,
  toggleSaveForLater,
} from '../redux/slices/cartSlice';
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

export default function Cart() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, loading } = useSelector((state) => state.cart);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const activeItems = items.filter((i) => !i.savedForLater);
  const savedItems = items.filter((i) => i.savedForLater);

  const subtotal = activeItems.reduce((sum, i) => sum + i.price * i.qty, 0);
  const shipping = subtotal > 0 ? 500 : 0; // placeholder flat rate, matches Checkout.jsx and the server's totals
  const total = subtotal + shipping;

  if (loading && items.length === 0) {
    return (
      <div className="py-24 text-center text-sm text-neutral-600">
        Loading cart…
      </div>
    );
  }

  if (activeItems.length === 0 && savedItems.length === 0) {
    return (
      <div className="py-24 text-center">
        <h1 className="text-xl font-semibold text-ink">Your cart is empty</h1>
        <p className="mt-2 text-sm text-neutral-600">
          Browse the catalogue and add something to get started.
        </p>
        <Link to="/products" className="mt-4 inline-block text-sm font-medium text-accent hover:underline">
          Browse the catalogue →
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="mb-6 text-2xl font-semibold text-ink">Your Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="divide-y divide-neutral-200">
            {activeItems.map((item) => (
              <div key={item._id} className="flex items-center gap-4 py-4">
                <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-[var(--radius-panel)] bg-surface-alt">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <ImagePlaceholder className="h-full w-full" />
                  )}
                </div>

                <div className="flex-1">
                  <p className="text-sm font-semibold text-ink">{item.name}</p>
                  <p className="mt-1 text-sm font-semibold text-accent">
                    {formatPrice(item.price)}
                  </p>
                  <div className="mt-2 flex items-center gap-4">
                    <div className="flex items-center rounded-[var(--radius-panel)] border border-neutral-200">
                      <button
                        className="px-2 py-1 text-neutral-500 hover:text-accent disabled:opacity-40"
                        onClick={() =>
                          dispatch(updateQty({ itemId: item._id, qty: item.qty - 1 }))
                        }
                        disabled={item.qty <= 1}
                      >
                        −
                      </button>
                      <span className="px-3 text-sm">{item.qty}</span>
                      <button
                        className="px-2 py-1 text-neutral-500 hover:text-accent"
                        onClick={() =>
                          dispatch(updateQty({ itemId: item._id, qty: item.qty + 1 }))
                        }
                      >
                        +
                      </button>
                    </div>
                    <button
                      className="flex items-center gap-1 text-xs font-medium text-neutral-600 hover:text-accent"
                      onClick={() => dispatch(toggleSaveForLater(item._id))}
                    >
                      <BookmarkPlus size={14} /> Save for later
                    </button>
                    <button
                      className="flex items-center gap-1 text-xs font-medium text-neutral-600 hover:text-danger"
                      onClick={() => dispatch(removeFromCart(item._id))}
                    >
                      <Trash2 size={14} /> Remove
                    </button>
                  </div>
                </div>

                <p className="text-sm font-semibold text-ink">
                  {formatPrice(item.price * item.qty)}
                </p>
              </div>
            ))}
          </div>

          {savedItems.length > 0 && (
            <div className="mt-10">
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-neutral-600">
                Saved for Later
              </h2>
              <div className="divide-y divide-neutral-200">
                {savedItems.map((item) => (
                  <div key={item._id} className="flex items-center gap-4 py-4 opacity-80">
                    <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-[var(--radius-panel)] bg-surface-alt">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <ImagePlaceholder className="h-full w-full" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-ink">{item.name}</p>
                      <p className="mt-1 text-sm font-semibold text-accent">
                        {formatPrice(item.price)}
                      </p>
                    </div>
                    <button
                      className="flex items-center gap-1 text-xs font-medium text-accent hover:underline"
                      onClick={() => dispatch(toggleSaveForLater(item._id))}
                    >
                      <RotateCcw size={14} /> Move to cart
                    </button>
                    <button
                      className="rounded-full p-2 text-neutral-500 hover:bg-neutral-100 hover:text-danger"
                      onClick={() => dispatch(removeFromCart(item._id))}
                      aria-label={`Remove ${item.name}`}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="h-fit rounded-[var(--radius-panel)] border border-neutral-200 bg-surface-alt p-6">
          <h2 className="mb-4 text-lg font-semibold text-ink">Order Summary</h2>
          <div className="space-y-2 text-sm text-neutral-600">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>{formatPrice(shipping)}</span>
            </div>
          </div>
          <div className="mt-4 flex justify-between border-t border-neutral-200 pt-4 text-sm font-semibold text-ink">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>
          <Button
            className="mt-6 w-full"
            disabled={activeItems.length === 0}
            onClick={() => navigate('/checkout')}
          >
            Proceed to Checkout
          </Button>
        </div>
      </div>
    </div>
  );
}
