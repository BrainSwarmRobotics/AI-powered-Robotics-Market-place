import { Link } from 'react-router-dom';
import heroCover from '../assets/hero-cover.jpg';

export default function Hero() {
  return (
    <section
      className="relative overflow-hidden rounded-[var(--radius-panel)] bg-accent bg-cover bg-center"
      style={{ backgroundImage: `url(${heroCover})` }}
    >
      {/* Dark gradient overlay — keeps white text legible over the photo regardless
          of where the robots/starfield land, without flattening the image. */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#001446]/90 via-[#001446]/60 to-[#001446]/20" />

      <div className="relative px-6 py-16 sm:px-10 sm:py-24 lg:px-14 lg:py-28">
        <div className="max-w-xl">
          <span className="mb-3 inline-block text-xs font-semibold uppercase tracking-wider text-accent-teal">
            Brainswarm Robotics
          </span>
          <h1 className="text-3xl font-semibold leading-tight text-white sm:text-4xl lg:text-5xl">
            Robotics hardware for builders, not just browsers.
          </h1>
          <p className="mt-4 max-w-md text-base text-white/80">
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
      </div>
    </section>
  );
}
