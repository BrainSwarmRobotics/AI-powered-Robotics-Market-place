import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Linkedin } from 'lucide-react';
import Button from './ui/Button';
import Input from './ui/Input';
import Badge from './ui/Badge';
import logo from '../assets/BSR_Logo.png';

const LINK_COLUMNS = [
  {
    heading: 'Shop',
    links: [
      { label: 'All Products', to: '/products' },
      { label: 'Compare', to: '/compare' },
      { label: 'Wishlist', to: '/wishlist' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { label: 'About Brainswarm', to: '/about' },
      { label: 'Contact', to: '/contact' },
    ],
  },
  {
    heading: 'Support',
    links: [
      { label: 'Shipping & Delivery', to: '/support/shipping' },
      { label: 'Returns', to: '/support/returns' },
      { label: 'Track Order', to: '/support/track-order' },
    ],
  },
  {
    heading: 'Legal',
    links: [
      { label: 'Privacy Policy', to: '/legal/privacy' },
      { label: 'Terms of Service', to: '/legal/terms' },
    ],
  },
];

const PAYMENT_METHODS = ['Visa', 'Mastercard', 'Stripe', 'Cash on Delivery'];

const SOCIALS = [
  { label: 'Facebook', href: 'https://www.facebook.com/BrainSwarmrobotics/', Icon: Facebook },
  { label: 'Instagram', href: 'https://www.instagram.com/brainswarmrobotics/', Icon: Instagram },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/company/brainswarmrobotics/posts/?feedView=all', Icon: Linkedin },
];

export default function Footer() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  function handleNewsletterSubmit(e) {
    e.preventDefault();
    // Newsletter endpoint doesn't exist yet — wire to a real backend route
    // when one is added (not scoped to Track A).
    if (email.trim()) {
      setSubmitted(true);
      setEmail('');
    }
  }

  return (
    <footer className="border-t border-neutral-200 bg-surface-alt">
      <div className="mx-auto max-w-[1280px] px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-6">
          <div className="col-span-2 lg:col-span-2">
            <img src={logo} alt="Brainswarm Robotics" className="mb-3 h-8 w-auto" />
            <p className="max-w-xs text-sm text-neutral-600">
              Robotics hardware, curated for makers, educators, and researchers.
            </p>
            <div className="mt-4 flex gap-2">
              {SOCIALS.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-neutral-200
                    text-neutral-600 transition-colors hover:border-accent hover:text-accent"
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {LINK_COLUMNS.map((col) => (
            <div key={col.heading}>
              <h3 className="mb-3 text-sm font-semibold text-ink">{col.heading}</h3>
              <ul className="flex flex-col gap-2">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link to={l.to} className="text-sm text-neutral-600 hover:text-ink">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="col-span-2 sm:col-span-3 lg:col-span-2">
            <h3 className="mb-3 text-sm font-semibold text-ink">Stay in the loop</h3>
            <p className="mb-3 text-sm text-neutral-600">
              New arrivals and restocks, no spam.
            </p>
            {submitted ? (
              <p className="text-sm font-medium text-success">Subscribed — thanks.</p>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
                <Input
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1"
                  aria-label="Email address"
                />
                <Button type="submit" size="md">
                  Subscribe
                </Button>
              </form>
            )}
          </div>
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-4 border-t border-neutral-200 pt-6 sm:flex-row sm:items-center">
          <p className="text-xs text-neutral-600">
            &copy; {new Date().getFullYear()} Brainswarm Robotics. All rights reserved.
          </p>
          <div className="flex flex-wrap gap-2">
            {PAYMENT_METHODS.map((method) => (
              <Badge key={method} tone="neutral">
                {method}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
