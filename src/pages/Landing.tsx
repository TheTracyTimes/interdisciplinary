import { Link } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { Card } from '../components/ui/Card'
import { STAGES } from '../data/stages'

const FEATURES = [
  {
    icon: '📝',
    title: 'Screenplay & Script',
    desc: 'Proper screenplay formatting — scene headings, action lines, dialogue — built for storytellers, not software engineers.',
    tag: 'Film',
    tagVariant: 'film' as const,
  },
  {
    icon: '🎞',
    title: 'Storyboard Studio',
    desc: 'Visualize shots before you pick up a camera. Panel-by-panel, shot-type tagged, and shareable with your crew.',
    tag: 'Film',
    tagVariant: 'film' as const,
  },
  {
    icon: '🎵',
    title: 'Arrangement Mapper',
    desc: 'Map your song structure visually before entering the studio. Lock your Intro → Verse → Chorus before you spend money on recording.',
    tag: 'Music',
    tagVariant: 'music' as const,
  },
  {
    icon: '🎼',
    title: 'Score Writer',
    desc: 'Compose for picture or standalone. Place notes on a real staff, organize by measure, and export as ABC notation.',
    tag: 'Music',
    tagVariant: 'music' as const,
  },
  {
    icon: '🗺',
    title: '6-Stage Pipeline',
    desc: 'From idea to distribution — a guided workflow that teaches you what the industry knows and independents often learn too late.',
    tag: 'Both',
    tagVariant: 'neutral' as const,
  },
  {
    icon: '🤝',
    title: 'Cross-Discipline Projects',
    desc: 'Work on film and music within the same project. Score writers and directors in one workspace — the way the industry actually works.',
    tag: 'Both',
    tagVariant: 'neutral' as const,
  },
]

const COMPARISONS = [
  { feature: 'Screenplay writer', ix: true, daw: false, nle: false },
  { feature: 'Storyboard tool', ix: true, daw: false, nle: 'Limited' },
  { feature: 'Arrangement mapper', ix: true, daw: 'Partial', nle: false },
  { feature: 'Score writer', ix: true, daw: 'Partial', nle: false },
  { feature: '6-stage guided workflow', ix: true, daw: false, nle: false },
  { feature: 'Film + music in one project', ix: true, daw: false, nle: false },
  { feature: 'Learning content per stage', ix: true, daw: false, nle: false },
  { feature: 'Industry-grade audio engine', ix: false, daw: true, nle: false },
  { feature: 'Video timeline & editing', ix: false, daw: false, nle: true },
]

export function Landing() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-950/80 via-slate-950 to-slate-950" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-brand-600/10 rounded-full blur-3xl" />

        <div className="relative max-w-5xl mx-auto px-6 pt-20 pb-28 text-center">
          <Badge variant="neutral" size="sm">Open Beta · Free to start</Badge>
          <h1 className="mt-6 text-5xl sm:text-6xl font-black tracking-tight leading-tight">
            Where music
            <br />
            <span className="bg-gradient-to-r from-brand-400 to-violet-400 bg-clip-text text-transparent">
              meets picture.
            </span>
          </h1>
          <p className="mt-6 text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Interdisciplinary is the first creative platform built for both musicians and filmmakers.
            Script your story. Arrange your score. Storyboard your vision.
            Then learn how to fund and release it — all in one workflow.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/dashboard">
              <Button variant="primary" size="lg">Start your project — free</Button>
            </Link>
            <Link to="/pricing">
              <Button variant="outline" size="lg">See pricing</Button>
            </Link>
          </div>
          <p className="mt-4 text-xs text-slate-600">
            No credit card required. Conception and pre-production stages are always free.
          </p>
        </div>
      </section>

      {/* Honest positioning */}
      <section className="bg-slate-900/50 border-y border-white/8 py-12 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-lg font-semibold text-slate-300 mb-3">
            We're not trying to replace Ableton or Premiere Pro.
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            Those tools are extraordinary at what they do. We're the layer that comes before them — and after.
            The creative bridge where your script, your score, your storyboard, and your release strategy live together.
            When you're ready for a recording session, you export and open your DAW. When you're done editing, you come back here to plan distribution.
          </p>
        </div>
      </section>

      {/* 6 Stages */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-3">The 6-Stage Pipeline</h2>
          <p className="text-slate-400 text-sm max-w-xl mx-auto">
            The workflow professionals follow but rarely document. Now it's your north star.
          </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {STAGES.map((stage, i) => (
            <Card
              key={stage.id}
              className={`p-4 text-center ${stage.bgColor} border`}
            >
              <div className="text-3xl mb-2">{stage.icon}</div>
              <div className="text-xs font-mono text-slate-500 mb-1">{String(i + 1).padStart(2, '0')}</div>
              <div className="text-sm font-semibold text-white mb-1">{stage.label}</div>
              <div className={`text-xs italic ${stage.color}`}>{stage.tagline}</div>
              {stage.tier !== 'free' && (
                <Badge variant={stage.tier as 'creator' | 'pro'} size="xs" className="mt-2">
                  {stage.tier}
                </Badge>
              )}
              {stage.tier === 'free' && (
                <Badge variant="free" size="xs" className="mt-2">Free</Badge>
              )}
            </Card>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="bg-slate-900/30 py-20 px-6 border-y border-white/5">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-3">Everything in one workspace</h2>
            <p className="text-slate-400 text-sm">
              Stop context-switching between tools that don't talk to each other.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map((f) => (
              <Card key={f.title} className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <span className="text-2xl">{f.icon}</span>
                  <Badge variant={f.tagVariant} size="xs">{f.tag}</Badge>
                </div>
                <h3 className="font-semibold text-white mb-2">{f.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section className="max-w-4xl mx-auto px-6 py-20">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-white mb-3">Honest comparison</h2>
          <p className="text-slate-400 text-sm">We're a different category, not a better DAW or NLE.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-3 px-4 text-slate-400 font-medium">Feature</th>
                <th className="py-3 px-4 text-brand-400 font-semibold">Interdisciplinary</th>
                <th className="py-3 px-4 text-slate-400 font-medium">DAW (Ableton etc.)</th>
                <th className="py-3 px-4 text-slate-400 font-medium">NLE (Premiere etc.)</th>
              </tr>
            </thead>
            <tbody>
              {COMPARISONS.map((row, i) => (
                <tr key={i} className="border-b border-white/5 hover:bg-white/2">
                  <td className="py-3 px-4 text-slate-300">{row.feature}</td>
                  <td className="py-3 px-4 text-center">
                    <CompCell val={row.ix} />
                  </td>
                  <td className="py-3 px-4 text-center">
                    <CompCell val={row.daw} />
                  </td>
                  <td className="py-3 px-4 text-center">
                    <CompCell val={row.nle} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Who it's for */}
      <section className="bg-slate-900/40 border-y border-white/5 py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-10">Who Interdisciplinary is for</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                emoji: '🎬',
                title: 'Aspiring Filmmakers',
                desc: 'You have a story. You need structure. Script it, board it, learn what pre-production actually means, and release your first short without burning your budget.',
              },
              {
                emoji: '🎸',
                title: 'Aspiring Musicians',
                desc: 'You can play. You need a plan. Map your album before you record, score it properly, learn how sync and distribution work, and release music that gets heard.',
              },
              {
                emoji: '✨',
                title: 'Creative Professionals',
                desc: 'Directors who score their own work. Composers who produce their own films. Multimedia artists who need one workspace that respects both disciplines.',
              },
            ].map((persona) => (
              <Card key={persona.title} className="p-6" glass>
                <div className="text-4xl mb-4">{persona.emoji}</div>
                <h3 className="font-bold text-white mb-3">{persona.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{persona.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-2xl mx-auto px-6 py-20 text-center">
        <h2 className="text-4xl font-bold text-white mb-4">Create without walls.</h2>
        <p className="text-slate-400 mb-8 leading-relaxed">
          Start your first project today. Conception and pre-production are free forever.
          No credit card, no commitment — just a better way to start.
        </p>
        <Link to="/dashboard">
          <Button variant="primary" size="lg">Open the studio</Button>
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/8 py-8 px-6 text-center text-slate-600 text-sm">
        <p>© {new Date().getFullYear()} Interdisciplinary. Built for the independent creative.</p>
        <p className="mt-1">Exports to .txt (screenplay), .abc (score), and image formats. Your data stays local.</p>
      </footer>
    </div>
  )
}

function CompCell({ val }: { val: boolean | string }) {
  if (val === true) return <span className="text-emerald-400 font-bold">✓</span>
  if (val === false) return <span className="text-slate-700">—</span>
  return <span className="text-amber-400 text-xs">{val}</span>
}
