export default function AdminPlaceholder({ title }) {
  return (
    <div className="rounded-panel border border-neutral-200 bg-surface p-10 text-center">
      <h2 className="text-lg font-semibold text-ink">{title}</h2>
      <p className="mt-2 text-sm text-neutral-600">
        This section isn't built yet — it lands in a later task.
      </p>
    </div>
  );
}