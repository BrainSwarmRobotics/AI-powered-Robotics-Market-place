import { Mail, Phone, MapPin, Linkedin, Facebook, Instagram } from 'lucide-react';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';

const SOCIALS = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/company/brainswarmrobotics/', Icon: Linkedin },
  { label: 'Facebook', href: 'https://www.facebook.com/BrainSwarmrobotics/', Icon: Facebook },
  { label: 'Instagram', href: 'https://www.instagram.com/brainswarmrobotics/', Icon: Instagram },
];

export default function Contact() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:py-16">
      <Badge tone="accent" className="uppercase tracking-wide">
        Contact
      </Badge>
      <h1 className="mt-3 text-3xl font-semibold leading-tight text-ink sm:text-4xl">
        Get in touch
      </h1>
      <p className="mt-4 text-base leading-relaxed text-neutral-600">
        Questions about an order, a product, or Brainswarm's robotics work more broadly — reach us
        directly below.
      </p>

      <div className="mt-10 flex flex-col gap-4">
        <Card className="flex items-start gap-4">
          <MapPin size={20} className="mt-0.5 shrink-0 text-accent" />
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-neutral-600">
              Head office
            </p>
            <p className="mt-0.5 text-sm font-medium text-ink">Islamabad, Pakistan</p>
          </div>
        </Card>

        <Card className="flex items-start gap-4">
          <Mail size={20} className="mt-0.5 shrink-0 text-accent" />
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-neutral-600">Email</p>
            <a
              href="mailto:contact@brainswarmrobotics.com"
              className="mt-0.5 block text-sm font-medium text-ink hover:text-accent"
            >
              contact@brainswarmrobotics.com
            </a>
          </div>
        </Card>

        <Card className="flex items-start gap-4">
          <Phone size={20} className="mt-0.5 shrink-0 text-accent" />
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-neutral-600">Phone</p>
            <a href="tel:+923005572537" className="mt-0.5 block text-sm font-medium text-ink hover:text-accent">
              +92 300 5572537
            </a>
            <a href="tel:+923215081080" className="mt-1 block text-sm font-medium text-ink hover:text-accent">
              +92 321 5081080
            </a>
          </div>
        </Card>

        <Card className="flex items-start gap-4">
          <div className="mt-0.5 flex shrink-0 gap-2">
            {SOCIALS.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200
                  text-neutral-600 transition-colors hover:border-accent hover:text-accent"
              >
                <Icon size={16} />
              </a>
            ))}
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-neutral-600">
              Elsewhere
            </p>
            <p className="mt-0.5 text-sm text-neutral-600">LinkedIn · Facebook · Instagram</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
