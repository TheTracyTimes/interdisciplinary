import { Link } from 'react-router-dom'

const DAWS: { label: string; logo: string }[] = [
  { label: 'Ableton Live', logo: '/logos/ableton-live.png' },
  { label: 'Logic Pro', logo: '/logos/logic-pro.png' },
  { label: 'Pro Tools', logo: '/logos/avid-pro-tools.png' },
]

const NLES: { label: string; logo: string }[] = [
  { label: 'Premiere Pro', logo: '/logos/adobe-premiere-pro.png' },
  { label: 'Final Cut Pro', logo: '/logos/final-cut-pro.png' },
  { label: 'DaVinci Resolve', logo: '/logos/davinci-resolve.png' },
]

const PIPELINE_STAGES = [
  {
    num: '01',
    label: 'Conception',
    desc: 'Idea development, creative brief, mood board, reference gathering.',
    tier: 'Free',
    color: '#6272f3',
  },
  {
    num: '02',
    label: 'Pre-Production',
    desc: 'Script, storyboard, shot list, timeline, contracts, scheduling.',
    tier: 'Free',
    color: '#6272f3',
  },
  {
    num: '03',
    label: 'Production',
    desc: 'Active shoot or recording. Session notes, asset capture, logging.',
    tier: 'Studio',
    color: '#06b6d4',
  },
  {
    num: '04',
    label: 'Post-Production',
    desc: 'Edit, color, mix, score, sound design, revision management.',
    tier: 'Studio',
    color: '#06b6d4',
  },
  {
    num: '05',
    label: 'Funding',
    desc: 'Invoice, payment collection, grant tracking, budget close-out.',
    tier: 'Studio',
    color: '#48bb9a',
  },
  {
    num: '06',
    label: 'Distribution & Release',
    desc: 'Deliverable delivery, client portal, portfolio publishing, release.',
    tier: 'Studio',
    color: '#f59e0b',
  },
]

const TOOLS = [
  {
    label: 'Screenplay & Script',
    tag: 'Film',
    color: '#06b6d4',
    desc: 'Proper screenplay formatting — scene headings, action lines, dialogue — built for storytellers, not software engineers.',
  },
  {
    label: 'Storyboard Studio',
    tag: 'Film',
    color: '#06b6d4',
    desc: 'Visualize every shot before you pick up a camera. Panel-by-panel, shot-logged, and shareable with your crew.',
  },
  {
    label: 'Arrangement Mapper',
    tag: 'Music',
    color: '#6272f3',
    desc: 'Map your picture visually before entering the studio. Lock your keys, vibe, and tempo. Chorus first.',
  },
  {
    label: 'Score Writer',
    tag: 'Music',
    color: '#6272f3',
    desc: 'Compose for picture or standalone. Notate by measure and export as standard music notation.',
  },
  {
    label: '6-Stage Pipeline',
    tag: 'Both',
    color: '#48bb9a',
    desc: 'From idea to distribution — a guided workflow that teaches you what the industry knows, independently.',
  },
  {
    label: 'Cross-Discipline Projects',
    tag: 'Both',
    color: '#48bb9a',
    desc: 'Work on film and music within the same project. Score writers and directors in one workspace — the way the industry actually works.',
  },
]

const COMPARISON = [
  { feature: 'Screenplay writer',       ix: true,  daw: false,     nle: false   },
  { feature: 'Storyboard tool',         ix: true,  daw: false,     nle: 'Limit' },
  { feature: 'Arrangement mapper',      ix: true,  daw: 'Partial', nle: false   },
  { feature: 'Score writer',            ix: true,  daw: 'Partial', nle: false   },
  { feature: '6-stage guided workflow', ix: true,  daw: false,     nle: false   },
  { feature: 'Film + music in one project', ix: true, daw: false,  nle: false   },
  { feature: 'Learning content per stage', ix: true, daw: false,   nle: false   },
  { feature: 'Industry-grade audio engine', ix: false, daw: true,  nle: false   },
  { feature: 'Video timeline & editing',   ix: false, daw: false,  nle: true    },
]

const AUDIENCE = [
  {
    label: 'Aspiring Filmmakers',
    color: '#06b6d4',
    tag: 'NLE Users',
    logos: NLES,
    desc: 'You have a story. You need structure. Script it, board it, learn what pre-production actually means, and release your first short without burning your budget.',
  },
  {
    label: 'Aspiring Musicians',
    color: '#6272f3',
    tag: 'DAW Users',
    logos: DAWS,
    desc: 'You can play. You need a plan. Map your album before you record, score it properly, learn how sync and distribution work, and release music that gets heard.',
  },
  {
    label: 'Creative Professionals',
    color: '#48bb9a',
    tag: 'Both',
    logos: [
      { label: 'Adobe Photoshop', logo: '/logos/adobe-photoshop.png' },
      { label: 'Adobe Illustrator', logo: '/logos/adobe-illustrator.png' },
      { label: 'Adobe InDesign', logo: '/logos/adobe-indesign.png' },
      { label: 'Adobe Lightroom', logo: '/logos/adobe-lightroom.png' },
    ],
    desc: 'Directors who score their own work. Composers who produce their own films. Multimedia artists who need one workspace that respects both disciplines.',
  },
]

const PRODUCER_FEATURES = [
  { text: 'Manage film and music projects end-to-end' },
  { text: 'Client portal with selective visibility controls' },
  { text: 'Invoicing, contracts, and packages in one place' },
  { text: 'Post your work to build your public portfolio' },
  { text: 'Shareable gear list and pricing packages' },
  { text: 'Film and music pipeline kanban boards' },
]

const CLIENT_FEATURES = [
  { text: 'Real-time project progress visibility' },
  { text: 'Approve or request revisions on deliverables' },
  { text: 'See shoot dates, deadlines, and milestones' },
  { text: 'Private encrypted messaging with your producer' },
  { text: 'One link — no app download required' },
  { text: 'Leave testimonials to help your producer grow' },
]

function Check() {
  return (
    <span className="text-emerald-400 font-bold text-sm">+</span>
  )
}

function Dash() {
  return (
    <span className="text-slate-700 font-mono text-sm">—</span>
  )
}

function Partial({ label }: { label: string }) {
  return (
    <span className="text-amber-400 text-xs font-mono">{label}</span>
  )
}

export function Landing() {
  return (
    <div className="min-h-screen text-white" style={{ background: '#0a0a0b', fontFamily: 'inherit' }}>

      {/* Nav */}
      <nav
        className="sticky top-0 z-20 border-b border-white/6 px-6 py-0 flex items-stretch justify-between"
        style={{ background: 'rgba(10,10,11,0.96)', backdropFilter: 'blur(12px)', height: 44 }}
      >
        <div className="flex items-center gap-3 border-r border-white/6 pr-4 mr-4">
          <div className="w-5 h-5 rounded bg-gradient-to-br from-brand-500 to-violet-600 flex items-center justify-center text-white text-[9px] font-black">
            IX
          </div>
          <span className="text-xs font-semibold text-white tracking-widest uppercase">Interdisciplinary</span>
        </div>

        <div className="hidden sm:flex items-stretch gap-0">
          {[
            { label: 'Community', to: '/community' },
            { label: 'Discover', to: '/discover' },
            { label: 'Gear', to: '/gear' },
            { label: 'Pricing', to: '/pricing' },
          ].map(l => (
            <Link
              key={l.to}
              to={l.to}
              className="flex items-center px-4 text-[11px] text-slate-500 hover:text-white border-r border-white/6 transition-colors tracking-wide uppercase font-medium"
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2 ml-auto pl-4 border-l border-white/6">
          <Link
            to="/client"
            className="text-[11px] text-slate-400 hover:text-white transition-colors px-3 py-1.5 rounded border border-white/10 hover:border-white/25 uppercase tracking-wide font-medium"
          >
            Client Login
          </Link>
          <Link
            to="/app"
            className="text-[11px] text-white px-3 py-1.5 rounded font-bold hover:opacity-90 transition-opacity uppercase tracking-wide"
            style={{ background: '#6272f3' }}
          >
            Producer Studio
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden px-6 pt-24 pb-20 text-center border-b border-white/6">
        {/* Subtle grid background */}
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
        <div className="absolute top-0 left-1/3 w-[500px] h-[300px] rounded-full opacity-10 blur-[80px] pointer-events-none" style={{ background: '#6272f3' }} />
        <div className="absolute top-0 right-1/3 w-[300px] h-[200px] rounded-full opacity-8 blur-[60px] pointer-events-none" style={{ background: '#06b6d4' }} />

        <div className="relative max-w-4xl mx-auto">
          <div
            className="inline-flex items-center gap-2 px-3 py-1 text-[10px] font-mono mb-8 border uppercase tracking-widest"
            style={{ background: 'rgba(98,114,243,0.1)', borderColor: 'rgba(98,114,243,0.25)', color: '#a5b4fc', borderRadius: 4 }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
            Open Beta — Free to start
          </div>

          <h1 className="text-5xl sm:text-7xl font-black tracking-tight leading-[1.1] mb-6">
            <span className="block">Where the speed of sound,</span>
            <span
              className="block"
              style={{
                background: 'linear-gradient(135deg, #6272f3 0%, #a78bfa 50%, #06b6d4 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              meets the speed of light.
            </span>
          </h1>

          <p className="text-base text-slate-400 max-w-2xl mx-auto leading-relaxed mb-8">
            Interdisciplinary is the first creative platform built for both musicians and filmmakers.
            Script your story. Arrange your score. Storyboard your vision. Then learn how to fund and release it — all in one workflow.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-14">
            <Link
              to="/app"
              className="px-7 py-3 text-sm font-bold text-white hover:opacity-90 transition-opacity tracking-wide"
              style={{ background: '#6272f3', borderRadius: 6 }}
            >
              Start your project — free
            </Link>
            <Link
              to="/pricing"
              className="px-7 py-3 text-sm font-medium text-slate-300 border border-white/15 hover:border-white/30 transition-colors tracking-wide"
              style={{ borderRadius: 6 }}
            >
              See pricing
            </Link>
          </div>

        </div>
      </section>

      {/* Not replacing — context statement */}
      <section className="border-b border-white/6 px-6 py-16" style={{ background: '#0c0c0e' }}>
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-[10px] font-mono text-slate-600 uppercase tracking-widest mb-4">Context</p>
          <h2 className="text-2xl font-bold text-white mb-4">
            We're not trying to replace Ableton or Premiere Pro.
          </h2>
          <p className="text-sm text-slate-400 leading-relaxed max-w-xl mx-auto">
            Those tools are extraordinary at what they do. We're the bridge that comes before — and after.
            The creative workspace where your script, your score, and your release strategy live together.
            When you're ready for a recording session, you export and open your DAW. When you're done editing,
            you come back here to plan distribution.
          </p>
          <div className="mt-8 grid grid-cols-3 gap-0 border border-white/8 max-w-lg mx-auto" style={{ borderRadius: 6 }}>
            {[
              { label: 'Pre-production', sub: 'Interdisciplinary', color: '#6272f3' },
              { label: 'Production', sub: 'Your DAW or NLE', color: '#06b6d4' },
              { label: 'Distribution', sub: 'Interdisciplinary', color: '#48bb9a' },
            ].map((item, i) => (
              <div
                key={item.label}
                className="p-4 text-center"
                style={{
                  borderLeft: i > 0 ? '1px solid rgba(255,255,255,0.06)' : 'none',
                  borderTop: `2px solid ${item.color}`,
                }}
              >
                <p className="text-[10px] font-mono uppercase tracking-widest mb-1" style={{ color: item.color }}>{item.label}</p>
                <p className="text-[11px] text-slate-500">{item.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6-Stage Pipeline */}
      <section className="border-b border-white/6 px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <p className="text-[10px] font-mono text-slate-600 uppercase tracking-widest mb-2">Workflow</p>
          <div className="flex items-end justify-between mb-10">
            <h2 className="text-3xl font-bold text-white">The 6-Stage Pipeline</h2>
            <p className="text-xs text-slate-500 max-w-xs text-right hidden md:block">The workflow professionals follow but rarely document. Now it's your north star.</p>
          </div>

          {/* Timeline track */}
          <div className="relative mb-8">
            <div className="absolute top-3 left-0 right-0 h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-0">
              {PIPELINE_STAGES.map((stage, i) => (
                <div key={stage.num} className="relative" style={{ borderLeft: i > 0 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                  {/* Track marker */}
                  <div className="flex items-center gap-2 mb-4 px-4">
                    <div className="w-6 h-6 shrink-0 flex items-center justify-center text-[10px] font-black font-mono" style={{ background: stage.color, color: '#000', borderRadius: 3 }}>
                      {stage.num}
                    </div>
                    <div
                      className="text-[9px] font-mono px-1.5 py-0.5 uppercase tracking-wider"
                      style={{
                        color: stage.tier === 'Free' ? '#48bb9a' : '#64748b',
                        borderRadius: 2,
                        border: stage.tier === 'Free' ? '1px solid rgba(72,187,154,0.3)' : '1px solid rgba(255,255,255,0.06)',
                        background: stage.tier === 'Free' ? 'rgba(72,187,154,0.08)' : 'transparent',
                      }}
                    >
                      {stage.tier}
                    </div>
                  </div>
                  <div className="px-4 pb-6">
                    <div className="w-full h-0.5 mb-4" style={{ background: stage.color + '60' }} />
                    <p className="text-xs font-bold text-white mb-2">{stage.label}</p>
                    <p className="text-[10px] text-slate-600 leading-relaxed">{stage.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Tools / Everything in one workspace */}
      <section className="border-b border-white/6 px-6 py-20" style={{ background: '#0c0c0e' }}>
        <div className="max-w-6xl mx-auto">
          <p className="text-[10px] font-mono text-slate-600 uppercase tracking-widest mb-2">Toolset</p>
          <h2 className="text-3xl font-bold text-white mb-3">Everything in one workspace</h2>
          <p className="text-sm text-slate-500 mb-8">Stop context-switching between tools that don't talk to each other.</p>

          {/* Creative Tools 2×3 grid */}
          <div className="rounded-xl overflow-hidden border border-white/8 mb-10 max-w-2xl" style={{ background: '#0e0e10' }}>
            <div className="grid grid-cols-3">
              {[
                { label: 'Script writer', path: '/app/script' },
                { label: 'Storyboarding', path: '/app/storyboard' },
                { label: '6-stage pipeline', path: '/app/film' },
              ].map((item, i) => (
                <Link
                  key={item.path}
                  to="/app"
                  className={`flex items-center justify-center px-3 py-4 text-center text-xs font-mono text-slate-400 hover:text-white hover:bg-white/5 transition-colors${i < 2 ? ' border-r border-white/6' : ''}`}
                  style={{ borderTop: '2px solid rgba(6,182,212,0.3)' }}
                >
                  {item.label}
                </Link>
              ))}
            </div>
            <div className="h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />
            <div className="grid grid-cols-3">
              {[
                { label: 'Score writer', path: '/app/score' },
                { label: 'Arrangement mapping', path: '/app/arrangement' },
                { label: 'Cross-discipline', path: '/app/projects' },
              ].map((item, i) => (
                <Link
                  key={item.path}
                  to="/app"
                  className={`flex items-center justify-center px-3 py-4 text-center text-xs font-mono text-slate-400 hover:text-white hover:bg-white/5 transition-colors${i < 2 ? ' border-r border-white/6' : ''}`}
                  style={{ borderBottom: '2px solid rgba(98,114,243,0.3)' }}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex gap-6 mb-10 -mt-7">
            <span className="text-[9px] font-mono uppercase tracking-widest" style={{ color: '#06b6d490' }}>Film / NLE</span>
            <span className="text-[9px] font-mono uppercase tracking-widest" style={{ color: '#6272f390' }}>Music / DAW</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px" style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 8, overflow: 'hidden' }}>
            {TOOLS.map(tool => (
              <div
                key={tool.label}
                className="p-5"
                style={{ background: '#0c0c0e', borderLeft: `3px solid ${tool.color}` }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <span
                    className="text-[9px] font-mono px-1.5 py-0.5 uppercase tracking-widest"
                    style={{
                      color: tool.color,
                      background: tool.color + '15',
                      border: `1px solid ${tool.color}30`,
                      borderRadius: 2,
                    }}
                  >
                    {tool.tag}
                  </span>
                </div>
                <p className="text-sm font-bold text-white mb-2">{tool.label}</p>
                <p className="text-[11px] text-slate-500 leading-relaxed">{tool.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Honest Comparison */}
      <section className="border-b border-white/6 px-6 py-20">
        <div className="max-w-4xl mx-auto">
          <p className="text-[10px] font-mono text-slate-600 uppercase tracking-widest mb-2">Comparison</p>
          <h2 className="text-3xl font-bold text-white mb-3">Honest comparison</h2>
          <p className="text-sm text-slate-500 mb-10">We're a different category, not a better DAW or NLE.</p>

          <div className="border border-white/8 overflow-hidden" style={{ borderRadius: 6 }}>
            {/* Header */}
            <div className="grid grid-cols-4 border-b border-white/8" style={{ background: '#111113' }}>
              <div className="px-5 py-3">
                <span className="text-[10px] font-mono text-slate-600 uppercase tracking-widest">Feature</span>
              </div>
              <div className="px-5 py-3 border-l border-white/8">
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest" style={{ color: '#6272f3' }}>Interdisciplinary</span>
              </div>
              <div className="px-4 py-3 border-l border-white/8">
                <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-semibold mb-1.5">DAW</p>
                <div className="flex items-center gap-1.5">
                  {DAWS.map(d => (
                    <img key={d.label} src={d.logo} alt={d.label} title={d.label} className="h-4 w-auto object-contain opacity-50" />
                  ))}
                </div>
              </div>
              <div className="px-4 py-3 border-l border-white/8">
                <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-semibold mb-1.5">NLE</p>
                <div className="flex items-center gap-1.5">
                  {NLES.map(n => (
                    <img key={n.label} src={n.logo} alt={n.label} title={n.label} className="h-4 w-auto object-contain opacity-50" />
                  ))}
                </div>
              </div>
            </div>

            {COMPARISON.map((row, i) => (
              <div
                key={row.feature}
                className="grid grid-cols-4 border-b border-white/5"
                style={{ background: i % 2 === 0 ? '#0a0a0b' : '#0c0c0e' }}
              >
                <div className="px-5 py-3 flex items-center">
                  <span className="text-xs text-slate-400">{row.feature}</span>
                </div>
                <div className="px-5 py-3 border-l border-white/6 flex items-center">
                  {row.ix === true ? <Check /> : <Dash />}
                </div>
                <div className="px-5 py-3 border-l border-white/6 flex items-center">
                  {row.daw === true ? <Check /> : row.daw === false ? <Dash /> : <Partial label={row.daw as string} />}
                </div>
                <div className="px-5 py-3 border-l border-white/6 flex items-center">
                  {row.nle === true ? <Check /> : row.nle === false ? <Dash /> : <Partial label={row.nle as string} />}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dual entry: Producer / Client */}
      <section className="border-b border-white/6 px-6 py-20" style={{ background: '#0c0c0e' }}>
        <div className="max-w-4xl mx-auto">
          <p className="text-[10px] font-mono text-slate-600 uppercase tracking-widest mb-2 text-center">Access</p>
          <h2 className="text-3xl font-bold text-white mb-10 text-center">Two roles. One platform.</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link to="/app" className="group block">
              <div
                className="p-6 border transition-all duration-200 group-hover:border-brand-500/50"
                style={{ background: '#111113', borderColor: 'rgba(98,114,243,0.2)', borderRadius: 6, borderLeft: '3px solid #6272f3' }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-[9px] font-mono px-2 py-0.5 uppercase tracking-widest" style={{ color: '#6272f3', background: 'rgba(98,114,243,0.1)', border: '1px solid rgba(98,114,243,0.2)', borderRadius: 2 }}>Producer</span>
                </div>
                <p className="text-base font-bold text-white mb-4">Studio Access</p>
                <ul className="space-y-2 mb-6">
                  {PRODUCER_FEATURES.map(f => (
                    <li key={f.text} className="flex items-start gap-2 text-[11px] text-slate-500">
                      <span className="text-brand-400 shrink-0 mt-px font-bold">+</span>
                      {f.text}
                    </li>
                  ))}
                </ul>
                <div className="w-full py-2.5 text-sm font-bold text-white text-center" style={{ background: '#6272f3', borderRadius: 4 }}>
                  Enter Studio
                </div>
              </div>
            </Link>

            <Link to="/client" className="group block">
              <div
                className="p-6 border transition-all duration-200 group-hover:border-emerald-500/40"
                style={{ background: '#111113', borderColor: 'rgba(72,187,154,0.15)', borderRadius: 6, borderLeft: '3px solid #48bb9a' }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-[9px] font-mono px-2 py-0.5 uppercase tracking-widest" style={{ color: '#48bb9a', background: 'rgba(72,187,154,0.1)', border: '1px solid rgba(72,187,154,0.2)', borderRadius: 2 }}>Client</span>
                </div>
                <p className="text-base font-bold text-white mb-4">Portal Access</p>
                <ul className="space-y-2 mb-6">
                  {CLIENT_FEATURES.map(f => (
                    <li key={f.text} className="flex items-start gap-2 text-[11px] text-slate-500">
                      <span className="text-emerald-400 shrink-0 mt-px font-bold">+</span>
                      {f.text}
                    </li>
                  ))}
                </ul>
                <div className="w-full py-2.5 text-sm font-bold text-white text-center" style={{ background: '#48bb9a', borderRadius: 4 }}>
                  Access My Project
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Who it's for */}
      <section className="border-b border-white/6 px-6 py-20">
        <div className="max-w-5xl mx-auto">
          <p className="text-[10px] font-mono text-slate-600 uppercase tracking-widest mb-2 text-center">Audience</p>
          <h2 className="text-3xl font-bold text-white mb-10 text-center">Who Interdisciplinary is for</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {AUDIENCE.map(a => (
              <div
                key={a.label}
                className="p-6 border border-white/8"
                style={{ background: '#0c0c0e', borderRadius: 6, borderTop: `3px solid ${a.color}` }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <span
                    className="text-[9px] font-mono px-2 py-0.5 uppercase tracking-widest"
                    style={{ color: a.color, background: a.color + '12', border: `1px solid ${a.color}30`, borderRadius: 2 }}
                  >
                    {a.tag}
                  </span>
                </div>
                <p className="text-sm font-bold text-white mb-3">{a.label}</p>
                <p className="text-[11px] text-slate-500 leading-relaxed mb-4">{a.desc}</p>
                <div className="flex flex-wrap items-center gap-2">
                  {a.logos.map(l => (
                    <img key={l.label} src={l.logo} alt={l.label} title={l.label} className="h-4 w-auto object-contain opacity-40 hover:opacity-70 transition-opacity" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-24 text-center relative overflow-hidden border-b border-white/6" style={{ background: '#0c0c0e' }}>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[250px] rounded-full blur-[80px] opacity-10" style={{ background: '#6272f3' }} />
        </div>
        <div className="relative max-w-xl mx-auto">
          <p className="text-[10px] font-mono text-slate-600 uppercase tracking-widest mb-4">Get started</p>
          <h2 className="text-4xl font-black text-white mb-4 leading-tight">Create without walls.</h2>
          <p className="text-slate-500 mb-10 text-sm leading-relaxed">
            Start your first project today. Conception and pre-production are free forever.
            No credit card, no commitment — just a better way to start.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-5">
            <Link
              to="/app"
              className="px-8 py-3 text-sm font-bold text-white hover:opacity-90 transition-opacity tracking-wide uppercase"
              style={{ background: '#6272f3', borderRadius: 4 }}
            >
              Open the studio
            </Link>
            <Link
              to="/discover"
              className="px-8 py-3 text-sm font-medium text-slate-400 border border-white/12 hover:border-white/25 transition-colors tracking-wide uppercase"
              style={{ borderRadius: 4 }}
            >
              Browse producers
            </Link>
          </div>
          <p className="text-[10px] font-mono text-slate-700 uppercase tracking-widest">
            No credit card &nbsp;·&nbsp; No app download &nbsp;·&nbsp; Works in any browser
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/6 px-6 py-8" style={{ background: '#0a0a0b' }}>
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-gradient-to-br from-brand-500 to-violet-600 flex items-center justify-center text-white text-[9px] font-black">IX</div>
            <span className="text-xs font-mono text-slate-600 uppercase tracking-widest">Interdisciplinary</span>
          </div>
          <div className="flex items-center gap-6">
            {[
              { label: 'Community', to: '/community' },
              { label: 'Discover', to: '/discover' },
              { label: 'Pricing', to: '/pricing' },
              { label: 'Forum', to: '/app/forum' },
            ].map(l => (
              <Link key={l.to} to={l.to} className="text-[10px] font-mono text-slate-700 hover:text-slate-400 transition-colors uppercase tracking-widest">{l.label}</Link>
            ))}
          </div>
          <div className="text-right">
            <p className="text-[10px] font-mono text-slate-700">© {new Date().getFullYear()} Interdisciplinary</p>
            <p className="text-[9px] font-mono text-slate-800 mt-0.5">Built for the independent creative</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
