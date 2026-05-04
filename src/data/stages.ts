import type { StageInfo } from '../types'

export const STAGES: StageInfo[] = [
  {
    id: 'conception',
    label: 'Conception',
    shortLabel: 'Conceive',
    icon: '💡',
    color: 'text-violet-400',
    bgColor: 'bg-violet-500/10 border-violet-500/30',
    tier: 'free',
    tagline: 'Ideas become intentions',
    description:
      'Every great project starts with a spark. Conception is where you define what you want to say, who you are saying it to, and why now. This stage protects your idea from scope creep before a single note or frame is created.',
  },
  {
    id: 'pre-production',
    label: 'Pre-Production',
    shortLabel: 'Pre-Prod',
    icon: '📐',
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10 border-blue-500/30',
    tier: 'free',
    tagline: 'Plans reduce chaos later',
    description:
      'Pre-production is where money is saved and disasters are avoided. Script your scenes, storyboard your shots, arrange your music structure, assemble your team and schedule. Every hour here saves three in production.',
  },
  {
    id: 'production',
    label: 'Production',
    shortLabel: 'Produce',
    icon: '🎬',
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/10 border-amber-500/30',
    tier: 'creator',
    tagline: 'Execute the plan',
    description:
      'Production is capture — recording audio, filming footage, and tracking instruments. Your job here is to follow the plan from pre-production while staying flexible when reality diverges. Minimize decisions; maximize execution.',
  },
  {
    id: 'post-production',
    label: 'Post-Production',
    shortLabel: 'Post-Prod',
    icon: '✂️',
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/10 border-emerald-500/30',
    tier: 'creator',
    tagline: 'Shape the final form',
    description:
      'Post is where projects become what they truly are. Edit footage, mix and master audio, color grade, add VFX, sync music to picture. This stage rewards patience and a willingness to kill your darlings.',
  },
  {
    id: 'funding',
    label: 'Funding',
    shortLabel: 'Fund',
    icon: '💰',
    color: 'text-rose-400',
    bgColor: 'bg-rose-500/10 border-rose-500/30',
    tier: 'creator',
    tagline: 'Money follows a clear pitch',
    description:
      'Most independent creatives treat funding as an afterthought. Treat it as a discipline. Grants, crowdfunding, sync licensing, brand partnerships, and pre-sales are all viable paths — each requires a different pitch and timeline.',
  },
  {
    id: 'distribution',
    label: 'Distribution & Release',
    shortLabel: 'Release',
    icon: '🚀',
    color: 'text-orange-400',
    bgColor: 'bg-orange-500/10 border-orange-500/30',
    tier: 'pro',
    tagline: 'Great work deserves an audience',
    description:
      'A finished project without a release strategy is a tree falling in an empty forest. Distribution is a skill: understanding platforms, timing, metadata, press kits, and the difference between a release and a launch.',
  },
]

export const STAGE_IDS = STAGES.map((s) => s.id)
