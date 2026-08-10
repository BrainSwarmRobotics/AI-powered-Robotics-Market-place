import ProductCard from './ProductCard';

export default function FeaturedProducts({ products = [], loading }) {
  return (
    <section>
      <h2 className="mb-4 text-xl font-semibold text-ink">Featured Products</h2>
      <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="aspect-[3/4] animate-pulse rounded-[var(--radius-panel)] bg-neutral-100"
              />
            ))
          : products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
        {!loading && products.length === 0 && (
          <p className="col-span-full text-sm text-neutral-600">
            No products available yet.
          </p>
        )}
      </div>
    </section>
  );
}
