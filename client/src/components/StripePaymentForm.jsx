import { useState } from 'react';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import Button from './ui/Button';

export default function StripePaymentForm({ onSuccess, onError, submitting, setSubmitting }) {
  const stripe = useStripe();
  const elements = useElements();
  const [localError, setLocalError] = useState(null);

  async function handleConfirm(e) {
    e.preventDefault();
    if (!stripe || !elements) return;

    setSubmitting(true);
    setLocalError(null);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: 'if_required',
    });

    if (error) {
      setLocalError(error.message || 'Payment failed. Please try again.');
      setSubmitting(false);
      onError?.(error.message);
      return;
    }

    if (paymentIntent?.status === 'succeeded') {
      onSuccess(paymentIntent.id);
    } else {
      setLocalError('Payment was not completed.');
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleConfirm} className="space-y-4">
      <PaymentElement />
      {localError && <p className="text-sm text-danger">{localError}</p>}
      <Button type="submit" className="w-full" disabled={!stripe || submitting}>
        {submitting ? 'Processing payment...' : 'Pay now'}
      </Button>
    </form>
  );
}