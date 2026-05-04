import { Link } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'

const PLANS = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    badge: 'free' as const,
    tagline: 'Start here. Always.',
    features: [
      'Conception stage (full)',
      'Pre-Production stage (full)',
      'Scriptwriter tool',
      'Storyboard tool',
      'Arrangement Mapper',
      'Score Writer',
      '1 active project',
      'Local storage (browser)',
      'Export: .txt screenplay, .abc score',
    ],
    cta: 'Start free',
    ctaVariant: 'outline' as const,
    ctaLink: '/dashboard',
    highlight: false,
  },
  {
    name: 'Creator',
    price: '$12',
    period: 'per month',
    badge: 'creator' as const,
    tagline: 'For active independents.',
    features: [
      'Everything in Free',
      'Production stage (full)',
      'Post-Production stage (full)',
      'Funding stage (full)',
      'Unlimited projects',
      'Export: PDF screenplay',
      'Export: MIDI (arrangement)',
      'Export: PDF score',
      'Cloud sync & backup',
      'Collaboration (share read-only)',
    ],
    cta: 'Start Creator',
    ctaVariant: 'primary' as const,
    ctaLink: '/dashboard',
    highlight: true,
  },
  {
    name: 'Pro',
    price: '$29',
    period: 'per month',
    badge: 'pro' as const,
    tagline: 'For serious independents.',
    features: [
      'Everything in Creator',
      'Distribution & Release stage (full)',
      'Real-time collaboration',
      'DAW export presets (Ableton, Logic)',
      'NLE export presets (Premiere, DaVinci)',
      'Press kit generator',
      'Release timeline planner',
      'Priority support',
    ],
    cta: 'Start Pro',
    ctaVariant: 'secondary' as const,
    ctaLink: '/dashboard',
    highlight: false,
  },
  {
    name: 'Studio',
    price: '$99',
    period: 'per month',
    badge: 'studio' as const,
    tagline: 'For small teams and collectives.',
    features: [
      'Everything in Pro',
      'Up to 10 team members',
      'White-label workspace',
      'Custom domain',
      'API access',
      'Dedicated onboarding',
      'SLA support',
    ],
    cta: 'Contact us',
    ctaVariant: 'outline' as const,
    ctaLink: '/dashboard',
    highlight: false,
  },
]

const FAQ = [
  {
    q: 'Can I really use Conception and Pre-Production for free, forever?',
    a: 'Yes. Stages 1 and 2 — along with all four tools (Scriptwriter, Storyboard, Arrangement Mapper, Score Writer) — are free with one active project. We want breaking-in creatives to have a real place to start, not a crippled demo.',
  },
  {
    q: "Why doesn't Interdisciplinary include a full DAW or video editor?",
    a: "Because we'd lose. Ableton, Logic, Premiere, and DaVinci Resolve are exceptional at what they do. Our value is the workflow layer: planning, structuring, scoring, scripting, and releasing. We're designed to hand off to those tools gracefully, not compete with them.",
  },
  {
    q: 'Who is the Creator plan for?',
    a: "Creator is for anyone who is actively making things — shooting their first short, recording their debut EP, or working on a multimedia project. If you're going past pre-production into actual production and post, Creator unlocks what you need.",
  },
  {
    q: "Is my data safe if I'm on the free plan?",
    a: "Free plan data lives in your browser's local storage — it never leaves your device. Creator+ plans get encrypted cloud sync. We'd rather be honest about this than pretend free users get the same persistence as paying ones.",
  },
  {
    q: 'Can I cancel anytime?',
    a: 'Yes. Monthly plans cancel at end of billing period with no fees. We rely on being genuinely useful to retain subscribers, not lock-in.',
  },
]

export function Pricing() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-14">
          <h1 className="text-4xl font-bold text-white mb-3">Simple, honest pricing</h1>
          <p className="text-slate-400 max-w-lg mx-auto">
            Start free. Pay only when you need more stages, more projects, or more power.
            No trials, no limits on free core features.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-16">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-xl border p-6 flex flex-col ${
                plan.highlight
                  ? 'border-brand-400 bg-brand-500/8 ring-2 ring-brand-400/20'
                  : 'border-white/10 bg-slate-800/40'
              }`}
            >
              {plan.highlight && (
                <div className="text-center mb-4">
                  <Badge variant="creator" size="sm">Most popular</Badge>
                </div>
              )}
              <div className="mb-5">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-lg font-bold text-white">{plan.name}</h3>
                  <Badge variant={plan.badge} size="xs">{plan.badge}</Badge>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-white">{plan.price}</span>
                  <span className="text-slate-500 text-sm">/{plan.period}</span>
                </div>
                <p className="text-slate-400 text-xs mt-1">{plan.tagline}</p>
              </div>

              <ul className="flex-1 space-y-2 mb-6">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <span className="text-emerald-400 mt-0.5 shrink-0">✓</span>
                    <span className="text-slate-300">{f}</span>
                  </li>
                ))}
              </ul>

              <Link to={plan.ctaLink}>
                <Button variant={plan.ctaVariant} className="w-full">
                  {plan.cta}
                </Button>
              </Link>
            </div>
          ))}
        </div>

        {/* Business case callout */}
        <Card className="p-8 mb-16 border-amber-500/20 bg-amber-500/5">
          <h2 className="text-xl font-bold text-white mb-3">The honest business model</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm text-slate-300">
            <div>
              <h4 className="font-semibold text-white mb-2">Why free matters</h4>
              <p className="leading-relaxed text-slate-400">
                The independent creative market is enormous but price-sensitive. A meaningful free tier builds trust and volume — the users who grow with the platform upgrade naturally. We don't want the barrier to be money.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-2">Why $12 is the right number</h4>
              <p className="leading-relaxed text-slate-400">
                At $12/month Creator, it's less than one recording studio hour, one Netflix subscription, or one Spotify plan. It's a real value for real production stages. We'd rather 10,000 Creator subscribers than 500 at $50.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-2">Where growth comes from</h4>
              <p className="leading-relaxed text-slate-400">
                Every independent who ships something using Interdisciplinary becomes a case study. We win by helping people release real work — that's the growth engine. Marketing that matters is a finished project.
              </p>
            </div>
          </div>
        </Card>

        {/* FAQ */}
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">Common questions</h2>
          <div className="space-y-5">
            {FAQ.map((item) => (
              <div key={item.q} className="border-b border-white/8 pb-5">
                <h3 className="font-semibold text-white mb-2">{item.q}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
