import { ExternalLink, MapPin, Award, Globe2 } from 'lucide-react';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';

const QUICK_FACTS = [
  { icon: MapPin, label: 'Based in', value: 'Islamabad, Pakistan' },
  { icon: Award, label: 'Recognised', value: 'Top 10 startups, Ignite' },
  { icon: Globe2, label: 'Represented at', value: 'Expand North Star 2025' },
];

const WHAT_WE_BUILD = [
  {
    title: 'Custom robots',
    description:
      'Machines built for a specific job in teaching, research, or production — mechanical design, electronics, firmware, and the software stack that sits on top, delivered as one system rather than a pile of parts to integrate.',
    tags: ['Mechanical design', 'Electronics & PCB', 'Firmware', 'ROS 2 integration'],
  },
  {
    title: 'Applied AI systems',
    description:
      'Computer vision and edge intelligence that runs where the work happens rather than in a distant data centre — models tuned to the hardware on hand, wired into the workflow they need to serve.',
    tags: ['Object detection', 'Pose & activity', 'Model optimisation', 'On-device inference'],
  },
  {
    title: 'Proof of concept, quickly',
    description:
      'Turning an idea into something you can hold and test — tightly scoped, built in weeks rather than quarters, with a straight answer on whether it is worth taking further.',
    tags: ['Feasibility study', 'Working prototype', 'Field pilot', 'Handover & training'],
  },
];

const EXPERTISE = [
  { title: 'Robot Operating System', stack: 'ROS 2 · Nav2 · MoveIt · Gazebo' },
  { title: 'Computer vision', stack: 'YOLO · DeepStream · TensorRT · Custom models' },
  { title: 'Edge AI & embedded', stack: 'NVIDIA Jetson · MCU · Custom firmware · IoT links' },
];

export default function About() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:py-16">
      <Badge tone="accent" className="uppercase tracking-wide">
        About
      </Badge>
      <h1 className="mt-3 text-3xl font-semibold leading-tight text-ink sm:text-4xl">
        Robotics and AI, built for the classroom, the lab, and the factory floor.
      </h1>
      <p className="mt-4 max-w-2xl text-base leading-relaxed text-neutral-600">
        Brainswarm Robotics Marketplace is the storefront for Brainswarm's robotics hardware —
        robots, kits, and components curated for education, research, and hands-on development.
        Brainswarm itself designs custom robots, computer vision pipelines, and edge AI systems,
        then supports them from first prototype through deployment. This site is where that
        hardware, and the hardware of partner manufacturers, is made available directly.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {QUICK_FACTS.map(({ icon: Icon, label, value }) => (
          <Card key={label} className="flex items-start gap-3">
            <Icon size={18} className="mt-0.5 shrink-0 text-accent" />
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-neutral-600">
                {label}
              </p>
              <p className="mt-0.5 text-sm font-semibold text-ink">{value}</p>
            </div>
          </Card>
        ))}
      </div>

      <section className="mt-14">
        <h2 className="text-xl font-semibold text-ink">Our mission</h2>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-neutral-600">
          Put working robotics in the hands of the people who build what comes next. That means
          hardware sturdy enough for a school lab, software a research team can extend instead of
          reverse engineer, and deployments that keep running long after handover. We would rather
          ship one system that survives contact with the real world than ten that only demo well.
        </p>
      </section>

      <section className="mt-14">
        <h2 className="text-xl font-semibold text-ink">What we build</h2>
        <p className="mt-2 text-sm text-neutral-600">
          Every engagement lands somewhere on this list, and most move through more than one.
        </p>
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-3">
          {WHAT_WE_BUILD.map((item) => (
            <Card key={item.title} className="flex flex-col">
              <h3 className="text-sm font-semibold text-ink">{item.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-neutral-600">
                {item.description}
              </p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {item.tags.map((tag) => (
                  <Badge key={tag} tone="neutral">
                    {tag}
                  </Badge>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section className="mt-14">
        <h2 className="text-xl font-semibold text-ink">Expertise that survives deployment</h2>
        <p className="mt-2 text-sm text-neutral-600">
          Three areas we go deep in — everything else we take on is built out of them.
        </p>
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-3">
          {EXPERTISE.map((item) => (
            <Card key={item.title}>
              <h3 className="text-sm font-semibold text-ink">{item.title}</h3>
              <p className="mt-2 text-xs text-neutral-600">{item.stack}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="mt-14 rounded-[var(--radius-panel)] bg-accent px-6 py-8 text-white sm:px-10">
        <span className="text-xs font-semibold uppercase tracking-wider text-accent-teal">
          2025 Highlight
        </span>
        <h2 className="mt-2 text-lg font-semibold">Expand North Star 2025, Dubai</h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/80">
          Brainswarm was selected among the top 10 startups in Pakistan and travelled to Dubai on
          the Ignite travel grant to show our robotics and AI work at the Pakistan Pavilion. Four
          memoranda of understanding opened during the event, several partnerships carried forward
          into pilots afterward, and the work was demonstrated live in front of a global investor
          and industry audience.
        </p>
      </section>

      <div className="mt-14 flex flex-col items-start gap-2 border-t border-neutral-200 pt-8">
        <p className="text-sm text-neutral-600">
          Want to see the full range of Brainswarm's custom engineering work?
        </p>
        <a
          href="https://brainswarmrobotics.com/"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:underline"
        >
          Visit brainswarmrobotics.com
          <ExternalLink size={14} />
        </a>
      </div>
    </div>
  );
}
