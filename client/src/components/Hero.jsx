import { Link } from 'react-router-dom';
import ImagePlaceholder from './ImagePlaceholder';

export default function Hero({ heroProduct }) {
  const image = heroProduct?.images?.[0]?.url;

  return (
    <section className="overflow-hidden rounded-[var(--radius-panel)] bg-accent">
      <div className="grid grid-cols-1 items-center gap-8 px-6 py-12 sm:px-10 sm:py-16 lg:grid-cols-2 lg:gap-12 lg:px-14">
        <div>
          <span className="mb-3 inline-block text-xs font-semibold uppercase tracking-wider text-accent-teal">
            Brainswarm Robotics
          </span>
          <h1 className="text-3xl font-semibold leading-tight text-white sm:text-4xl lg:text-5xl">
            Robotics hardware for builders, not just browsers.
          </h1>
          <p className="mt-4 max-w-md text-base text-white/75">
            Curated robots, kits, and components for education, research,
            and hands-on development — with the specs that matter, up front.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/products"
              className="inline-flex h-12 items-center justify-center rounded-[var(--radius-control)]
                bg-white px-6 text-base font-medium text-accent transition-colors hover:bg-neutral-100"
            >
              Browse Catalogue
            </Link>
          </div>
        </div>

        <div className="aspect-[4/3] w-full overflow-hidden rounded-[var(--radius-panel)] lg:aspect-square">
          {image ? (
            <img
              src={image}
              alt={heroProduct.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <ImagePlaceholder className="h-full w-full bg-white/10 text-white [&_span]:text-white [&_svg]:text-white" />
          )}
        </div>
      </div>
    </section>
  );
}
