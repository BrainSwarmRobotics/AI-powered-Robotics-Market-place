import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Menu, X, Search, ShoppingCart, Heart, User, Scale } from 'lucide-react';
import logo from '../assets/BSR_Logo.png';

export default function Navbar({ categories = [] }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const cartCount = useSelector((state) =>
    state.cart.items.reduce((sum, item) => sum + item.qty, 0)
  );
  const wishlistCount = useSelector((state) => state.wishlist.items.length);
  const compareCount = useSelector((state) => state.compare.items.length);

  function handleSearchSubmit(e) {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/products?search=${encodeURIComponent(query.trim())}`);
      setMobileOpen(false);
    }
  }

  return (
    <header className="sticky top-0 z-30 border-b border-neutral-200 bg-surface/95 backdrop-blur">
      {/* Top row: logo, search, icons */}
      <div className="mx-auto flex h-20 max-w-[1280px] items-center gap-4 px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex shrink-0 items-center" aria-label="Brainswarm Robotics home">
          <img src={logo} alt="Brainswarm Robotics" className="h-12 w-auto sm:h-14" />
        </Link>

        <form onSubmit={handleSearchSubmit} className="hidden flex-1 md:flex">
          <div className="relative w-full max-w-md">
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search robots, kits, components..."
              className="h-10 w-full rounded-[var(--radius-control)] border border-neutral-200 bg-surface-alt
                pl-9 pr-3 text-sm text-ink placeholder:text-neutral-400 outline-none
                transition-colors focus:border-accent"
            />
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-600" />
          </div>
        </form>

        <div className="ml-auto flex items-center gap-1 sm:gap-2">
          <Link
            to="/compare"
            aria-label={`Compare (${compareCount} items)`}
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-[var(--radius-control)] hover:bg-neutral-100"
          >
            <Scale size={20} />
            {compareCount > 0 && (
              <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-semibold text-white">
                {compareCount}
              </span>
            )}
          </Link>
          <Link
            to="/wishlist"
            aria-label={`Wishlist (${wishlistCount} items)`}
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-[var(--radius-control)] hover:bg-neutral-100"
          >
            <Heart size={20} />
            {wishlistCount > 0 && (
              <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-semibold text-white">
                {wishlistCount}
              </span>
            )}
          </Link>
          <Link
            to="/cart"
            aria-label={`Cart (${cartCount} items)`}
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-[var(--radius-control)] hover:bg-neutral-100"
          >
            <ShoppingCart size={20} />
            {cartCount > 0 && (
              <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-semibold text-white">
                {cartCount}
              </span>
            )}
          </Link>
          <Link
            to="/account"
            aria-label="Account"
            className="hidden h-10 w-10 items-center justify-center rounded-[var(--radius-control)] hover:bg-neutral-100 sm:inline-flex"
          >
            <User size={20} />
          </Link>
          <button
            type="button"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMobileOpen((o) => !o)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-[var(--radius-control)] hover:bg-neutral-100 md:hidden"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Category tabs — horizontal row, not a sidebar (§1.7) */}
      <nav className="hidden border-t border-neutral-200 md:block">
        <div className="mx-auto flex max-w-[1280px] items-center gap-6 overflow-x-auto px-4 py-2.5 sm:px-6 lg:px-8">
          <NavLink
            to="/products"
            className={({ isActive }) =>
              `whitespace-nowrap text-sm font-medium transition-colors ${
                isActive ? 'text-accent' : 'text-neutral-600 hover:text-ink'
              }`
            }
          >
            All Products
          </NavLink>
          {categories.map((cat) => (
            <NavLink
              key={cat._id}
              to={`/products?category=${encodeURIComponent(cat.name)}`}
              className="whitespace-nowrap text-sm font-medium text-neutral-600 transition-colors hover:text-ink"
            >
              {cat.name}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-neutral-200 px-4 py-4 md:hidden">
          <form onSubmit={handleSearchSubmit} className="mb-4">
            <div className="relative">
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search robots, kits, components..."
                className="h-10 w-full rounded-[var(--radius-control)] border border-neutral-200 bg-surface-alt
                  pl-9 pr-3 text-sm text-ink placeholder:text-neutral-400 outline-none focus:border-accent"
              />
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-600" />
            </div>
          </form>
          <div className="flex flex-col gap-3">
            <Link to="/products" onClick={() => setMobileOpen(false)} className="text-sm font-medium text-ink">
              All Products
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat._id}
                to={`/products?category=${encodeURIComponent(cat.name)}`}
                onClick={() => setMobileOpen(false)}
                className="text-sm font-medium text-neutral-600"
              >
                {cat.name}
              </Link>
            ))}
            <Link to="/compare" onClick={() => setMobileOpen(false)} className="text-sm font-medium text-neutral-600">
              Compare ({compareCount})
            </Link>
            <Link to="/account" onClick={() => setMobileOpen(false)} className="text-sm font-medium text-neutral-600">
              Account
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}