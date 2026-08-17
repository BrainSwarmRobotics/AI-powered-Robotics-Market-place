import { Check } from 'lucide-react';

const STEPS = ['Confirmed', 'Processing', 'Packed', 'Shipped', 'Delivered'];

export default function OrderStatusTracker({ status }) {
  const currentIndex = STEPS.indexOf(status);

  return (
    <div className="flex items-center">
      {STEPS.map((step, i) => {
        const isComplete = i < currentIndex;
        const isCurrent = i === currentIndex;
        const isDone = isComplete || isCurrent;

        return (
          <div key={step} className="flex flex-1 items-center last:flex-none">
            <div className="flex flex-col items-center">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-medium ${
                  isDone
                    ? 'border-accent bg-accent text-white'
                    : 'border-neutral-200 bg-white text-neutral-400'
                }`}
              >
                {isComplete ? <Check size={14} /> : i + 1}
              </div>
              <span
                className={`mt-2 text-xs ${
                  isDone ? 'font-medium text-ink' : 'text-neutral-400'
                }`}
              >
                {step}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={`mx-2 h-0.5 flex-1 ${i < currentIndex ? 'bg-accent' : 'bg-neutral-200'}`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}