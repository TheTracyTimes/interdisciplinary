export type ProjectType = 'film' | 'music' | 'both'

export type Stage =
  | 'conception'
  | 'pre-production'
  | 'production'
  | 'post-production'
  | 'funding'
  | 'distribution'

export interface StageInfo {
  id: Stage
  label: string
  shortLabel: string
  icon: string
  color: string
  bgColor: string
  description: string
  tagline: string
  tier: 'free' | 'creator' | 'pro'
}

export interface ScriptBlock {
  id: string
  type: 'scene' | 'action' | 'character' | 'dialogue' | 'parenthetical' | 'transition'
  content: string
}

export interface StoryboardPanel {
  id: string
  order: number
  description: string
  shotType: string
  notes: string
  bgColor: string
}

export interface ArrangementSection {
  id: string
  label: string
  startBar: number
  lengthBars: number
  color: string
  trackId: string
}

export interface ArrangementTrack {
  id: string
  name: string
  type: 'lead' | 'harmony' | 'bass' | 'drums' | 'keys' | 'strings' | 'brass' | 'fx' | 'vocal'
  color: string
  sections: ArrangementSection[]
}

export interface ScoreNote {
  id: string
  pitch: string
  octave: number
  duration: 'whole' | 'half' | 'quarter' | 'eighth' | 'sixteenth'
  beat: number
  measure: number
}

export interface Project {
  id: string
  name: string
  type: ProjectType
  genre: string
  logline: string
  createdAt: string
  updatedAt: string
  currentStage: Stage
  completedStages: Stage[]
  script: ScriptBlock[]
  storyboard: StoryboardPanel[]
  arrangement: {
    bpm: number
    timeSignature: [number, number]
    key: string
    tracks: ArrangementTrack[]
  }
  score: ScoreNote[]
  notes: string
}

export type PricingTier = 'free' | 'creator' | 'pro' | 'studio'
