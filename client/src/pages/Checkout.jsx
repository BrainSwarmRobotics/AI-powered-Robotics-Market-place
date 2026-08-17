import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { Elements } from '@stripe/react-stripe-js';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import StripePaymentForm from '../components/StripePaymentForm';
import { fetchProfile, updateProfile } from '../redux/slices/authSlice';
import { createOrder } from '../redux/slices/orderSlice';
import { fetchCart } from '../redux/slices/cartSlice';
import { createPaymentIntent, resetPaymentIntent } from '../redux/slices/paymentSlice';
import { getStripe } from '../lib/stripe';

function formatPrice(price) {
  return new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency: 'PKR',
    maximumFractionDigits: 0,
  }).format(price ?? 0);
}

const EMPTY_ADDRESS = { street: '', city: '', state: '', postalCode: '', country: '', phone: '' };

export default function Checkout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { items, loading: cartLoading } = useSelector((state) => state.cart);
  const { loading: orderLoading, error: orderError } = useSelector((state) => state.orders);
  const { clientSecret, loading: intentLoading, error: intentError } = useSelector((state) => state.payment);

  const [address, setAddress] = useState(EMPTY_ADDRESS);
  const [saveAddress, setSaveAddress] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    dispatch(fetchCart());
    dispatch(fetchProfile());
    return () => dispatch(resetPaymentIntent());
  }, [dispatch]);

  useEffect(() => {
    if (user?.address) {
      setAddress((prev) => ({ ...prev, ...user.address }));
    }
  }, [user?.address]);

  const activeItems = items.filter((i) => !i.savedForLater);
  const subtotal = activeItems.reduce((sum, i) => sum + i.price * i.qty, 0);
  const shipping = subtotal > 0 ? 500 : 0;
  const total = subtotal + shipping;

  function handleChange(field, value) {
    setAddress((prev) => ({ ...prev, [field]: value }));
  }

  function handlePaymentMethodChange(method) {
    setPaymentMethod(method);
    dispatch(resetPaymentIntent());
  }

  async function placeOrder(intentId) {
    const result = await dispatch(
      createOrder({
        shippingAddress: address,
        paymentMethod,
        paymentIntentId: intentId || null,
      })
    );
    if (createOrder.fulfilled.match(result)) {
      navigate(`/order-confirmation/${result.payload._id}`, { replace: true });
    }
  }

  async function handleAddressSubmit(e) {
    e.preventDefault();
    if (activeItems.length === 0) return;

    if (saveAddress) {
      dispatch(updateProfile({ address }));
    }

    if (paymentMethod === 'COD') {
      await placeOrder(null);
    } else {
      dispatch(createPaymentIntent());
    }
  }

  if (!cartLoading && activeItems.length === 0) {
    return (
      <div className="py-24 text-center">
        <h1 className="text-xl font-semibold text-ink">Nothing to check out</h1>
        <p className="mt-2 text-sm text-neutral-600">Your cart is empty.</p>
        <Link to="/products" className="mt-4 inline-block text-sm font-medium text-accent hover:underline">
          Browse the catalogue →
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="mb-6 text-2xl font-semibold text-ink">Checkout</h1>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-8">
          <form onSubmit={handleAddressSubmit}>
            <h2 className="mb-4 text-lg font-semibold text-ink">Shipping address</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input
                label="Street address"
                required
                value={address.street}
                onChange={(e) => handleChange('street', e.target.value)}
                className="sm:col-span-2"
              />
              <Input
                label="City"
                required
                value={address.city}
                onChange={(e) => handleChange('city', e.target.value)}
              />
              <Input
                label="State / Province"
                value={address.state}
                onChange={(e) => handleChange('state', e.target.value)}
              />
              <Input
                label="Postal code"
                value={address.postalCode}
                onChange={(e) => handleChange('postalCode', e.target.value)}
              />
              <Input
                label="Country"
                value={address.country}
                onChange={(e) => handleChange('country', e.target.value)}
              />
              <Input
                label="Phone"
                value={address.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                className="sm:col-span-2"
              />
            </div>

            <label className="mt-4 flex items-center gap-2 text-sm text-neutral-600">
              <input
                type="checkbox"
                checked={saveAddress}
                onChange={(e) => setSaveAddress(e.target.checked)}
                className="h-4 w-4 rounded border-neutral-200 text-accent focus:ring-accent"
              />
              Save this address to my account
            </label>

            <div className="mt-8 space-y-3 rounded-[var(--radius-panel)] border border-neutral-200 bg-surface-alt p-4">
              <p className="text-sm font-medium text-ink">Payment method</p>
              <label className="flex items-center gap-2 text-sm text-neutral-700">
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={paymentMethod === 'COD'}
                  onChange={() => handlePaymentMethodChange('COD')}
                  className="h-4 w-4 text-accent focus:ring-accent"
                />
                Cash on Delivery
              </label>
              <label className="flex items-center gap-2 text-sm text-neutral-700">
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={paymentMethod === 'Card'}
                  onChange={() => handlePaymentMethodChange('Card')}
                  className="h-4 w-4 text-accent focus:ring-accent"
                />
                Pay with card
              </label>
            </div>

            {intentError && <p className="mt-3 text-sm text-danger">{intentError}</p>}
            {orderError && paymentMethod === 'COD' && (
              <p className="mt-3 text-sm text-danger">{orderError}</p>
            )}

            {!(paymentMethod === 'Card' && clientSecret) && (
              <Button
                type="submit"
                className="mt-6 w-full"
                disabled={orderLoading || intentLoading || activeItems.length === 0}
              >
                {paymentMethod === 'COD'
                  ? orderLoading
                    ? 'Placing order...'
                    : 'Place Order'
                  : intentLoading
                  ? 'Preparing payment...'
                  : 'Continue to payment'}
              </Button>
            )}
          </form>

          {paymentMethod === 'Card' && clientSecret && (
            <div>
              <h2 className="mb-4 text-lg font-semibold text-ink">Card details</h2>
              <Elements stripe={getStripe()} options={{ clientSecret }}>
                <StripePaymentForm
                  submitting={paying}
                  setSubmitting={setPaying}
                  onSuccess={(intentId) => placeOrder(intentId)}
                  onError={() => setPaying(false)}
                />
              </Elements>
              {orderError && <p className="mt-3 text-sm text-danger">{orderError}</p>}
            </div>
          )}
        </div>

        <div className="h-fit rounded-[var(--radius-panel)] border border-neutral-200 bg-surface-alt p-6">
          <h2 className="mb-4 text-lg font-semibold text-ink">Order Summary</h2>
          <ul className="mb-4 space-y-2">
            {activeItems.map((item) => (
              <li key={item._id} className="flex justify-between text-sm text-neutral-600">
                <span className="line-clamp-1 pr-2">
                  {item.name} × {item.qty}
                </span>
                <span className="shrink-0">{formatPrice(item.price * item.qty)}</span>
              </li>
            ))}
          </ul>
          <div className="space-y-2 border-t border-neutral-200 pt-3 text-sm text-neutral-600">
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
        </div>
      </div>
    </div>
  );
}