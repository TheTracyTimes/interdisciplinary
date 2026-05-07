// ── Stages ─────────────────────────────────────────────────────────────────
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
  tier: 'free' | 'creator' | 'pro'
  tagline: string
  description: string
}

// ── Script ──────────────────────────────────────────────────────────────────
export type ScriptBlockType =
  | 'scene'
  | 'action'
  | 'character'
  | 'dialogue'
  | 'parenthetical'
  | 'transition'

export interface ScriptBlock {
  id: string
  type: ScriptBlockType
  content: string
}

// ── Storyboard ──────────────────────────────────────────────────────────────
export interface StoryboardPanel {
  id: string
  order: number
  description: string
  shotType: string
  notes: string
  bgColor: string
}

// ── Arrangement ─────────────────────────────────────────────────────────────
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
  type: string
  color: string
  sections: ArrangementSection[]
}

export interface ArrangementData {
  bpm: number
  timeSignature: [number, number]
  key: string
  tracks: ArrangementTrack[]
}

// ── Score ────────────────────────────────────────────────────────────────────
export interface ScoreNote {
  id: string
  pitch: string
  octave: number
  duration: 'whole' | 'half' | 'quarter' | 'eighth' | 'sixteenth'
  measure: number
  beat: number
}

// ── Kanban ───────────────────────────────────────────────────────────────────
export interface KanbanCard {
  id: string
  title: string
  notes: string
  dueDate?: string
  priority?: 'Low' | 'Medium' | 'High'
}

export type FilmKanbanCol =
  | 'Ideas'
  | 'Writing'
  | 'Filming'
  | 'Editing'
  | 'Color Correction'
  | 'Color Grading'
  | 'Finished'

export type MusicKanbanCol =
  | 'Ideas'
  | 'Scoring'
  | 'Recording'
  | 'Mixing'
  | 'Revisions'
  | 'Mastering'
  | 'Finished'

export type FilmKanban = Record<FilmKanbanCol, KanbanCard[]>
export type MusicKanban = Record<MusicKanbanCol, KanbanCard[]>

// ── Shot List ────────────────────────────────────────────────────────────────
export interface ShotItem {
  id: string
  projectId: string
  sceneNumber: number
  shotType: 'Wide' | 'Medium' | 'Close-Up' | 'Insert' | 'B-Roll' | 'Drone' | 'POV'
  movement: 'Static' | 'Pan' | 'Tilt' | 'Dolly' | 'Handheld' | 'Gimbal'
  location: string
  timeOfDay: 'Morning' | 'Midday' | 'Golden Hour' | 'Night' | 'Interior'
  equipment: string[]
  lens: 'Wide' | 'Standard' | 'Telephoto'
  audio: 'Sync Sound' | 'Voiceover' | 'Music Only' | 'Ambient'
  status: 'Planned' | 'Shot' | 'Unusable' | 'Edited'
  notes: string
}

// ── Music Cues ───────────────────────────────────────────────────────────────
export interface MusicCue {
  id: string
  projectId: string
  trackName: string
  type: 'Original Score' | 'Licensed' | 'Sound Design' | 'Beat' | 'Full Song'
  status: 'Idea' | 'Drafting' | 'Arranged' | 'Mixing' | 'Mastering' | 'Complete'
  placement: string
  duration: string
  bpm: number
  key: string
  mood: string
  instruments: string[]
  stemsExported: boolean
  filesLink: string
  notes: string
}

// ── Creative Projects ─────────────────────────────────────────────────────────
export type CreativeProjectType =
  | 'Short Film'
  | 'Music Video'
  | 'Documentary'
  | 'Song'
  | 'Beat'
  | 'Sample Pack'
  | 'Spec Ad'
  | 'Personal'

export type CreativeProjectStatus =
  | 'Idea'
  | 'Pre-Production'
  | 'Production'
  | 'Post-Production'
  | 'Mixing'
  | 'Mastering'
  | 'Complete'
  | 'On Hold'

export type CreativeProjectPriority = 'Active' | 'Backburner' | 'Someday'

export interface CreativeProject {
  id: string
  title: string
  type: CreativeProjectType
  status: CreativeProjectStatus
  priority: CreativeProjectPriority
  startDate: string
  targetDate: string
  completionDate?: string
  genre: string
  mood: string
  bpm?: number
  key?: string
  duration?: string
  collaborators: string[]
  folderLink?: string
  notes: { concept: string; goals: string; ideas: string }
  filmKanban: FilmKanban
  musicKanban: MusicKanban
  script: ScriptBlock[]
  storyboard: StoryboardPanel[]
  arrangement: ArrangementData
  score: ScoreNote[]
  shotList: ShotItem[]
  musicCues: MusicCue[]
  currentStage: Stage
  completedStages: Stage[]
  createdAt: string
  updatedAt: string
}

// backward-compat aliases
export type Project = CreativeProject
export type ProjectType = 'film' | 'music' | 'both'

// ── Assets ───────────────────────────────────────────────────────────────────
export interface Asset {
  id: string
  name: string
  type: 'LUT' | 'Preset' | 'Sound Effect' | 'Music Loop' | 'Stock Footage' | 'Graphic' | 'Font' | 'Texture'
  category: string
  source: 'Original' | 'Purchased' | 'Free' | 'Subscription'
  license: 'Personal' | 'Commercial' | 'Unlimited' | 'Attribution Required'
  fileLink: string
  usedIn: string[]
  favorite: boolean
  notes: string
  createdAt: string
}

// ── References ───────────────────────────────────────────────────────────────
export interface Reference {
  id: string
  title: string
  type: 'Video' | 'Song' | 'Photo' | 'Article' | 'Tutorial' | 'Color Palette' | 'Other'
  sourceLink: string
  whySaved: string
  tags: string[]
  projectId?: string
  dateFound: string
}

// ── Learning Log ──────────────────────────────────────────────────────────────
export interface LearningEntry {
  id: string
  topic: string
  category: 'Final Cut' | 'Logic Pro' | 'Color Grading' | 'Audio Mixing' | 'Cinematography' | 'Business' | 'Other'
  sourceUrl: string
  status: 'To Watch' | 'In Progress' | 'Completed'
  keyTakeaways: string
  date: string
  applyTo?: string
  rating: number
}

// ── Clients ───────────────────────────────────────────────────────────────────
export interface Client {
  id: string
  name: string
  email: string
  phone: string
  type: 'Individual' | 'Church' | 'Corporate' | 'Artist' | 'Organization'
  source: 'Referral' | 'Instagram' | 'Website' | 'Word of Mouth' | 'Repeat'
  status: 'Lead' | 'Active' | 'Complete' | 'Inactive'
  projectIds: string[]
  notes: string
  lastContactDate: string
  createdAt: string
}

// ── Client Projects ───────────────────────────────────────────────────────────
export interface ClientProject {
  id: string
  projectName: string
  clientId: string
  serviceType: 'Photography' | 'Videography' | 'Livestream' | 'Music Production' | 'Live Performance'
  package: 'Portrait Session' | 'Event Half-Day' | 'Event Full-Day' | 'Promo Video' | 'Custom'
  status: 'Inquiry' | 'Booked' | 'In Progress' | 'Editing' | 'Delivered' | 'Completed'
  shootDate: string
  deliveryDeadline: string
  location: string
  price: number
  depositPaid: boolean
  finalPaid: boolean
  contractSigned: boolean
  contractId?: string
  deliverables: string
  notes: string
  filesLink: string
  shareToken?: string
  portalEnabled?: boolean
  portalSettings?: PortalSettings
  createdAt: string
}

// ── Contracts ─────────────────────────────────────────────────────────────────
export interface Contract {
  id: string
  contractName: string
  clientId: string
  projectId: string
  contractType: 'Portrait' | 'Event' | 'Commercial' | 'Livestream' | 'Music Production' | 'Custom'
  status: 'Draft' | 'Sent' | 'Signed' | 'Expired'
  dateSent: string
  dateSigned: string
  expirationDate: string
  contractLink: string
  notes: string
  createdAt: string
}

// ── Schedule ──────────────────────────────────────────────────────────────────
export interface ScheduleEvent {
  id: string
  event: string
  date: string
  time: string
  duration: '1 Hour' | '2 Hours' | 'Half-Day' | 'Full-Day'
  type: 'Shoot' | 'Editing Block' | 'Meeting' | 'Deadline' | 'Personal'
  projectId?: string
  location: string
  confirmed: boolean
  notes: string
  createdAt: string
}

// ── Invoices ──────────────────────────────────────────────────────────────────
export interface Invoice {
  id: string
  invoiceNumber: string
  clientId: string
  projectId: string
  amount: number
  type: 'Deposit' | 'Final Payment' | 'Full Payment'
  status: 'Draft' | 'Sent' | 'Paid' | 'Overdue'
  dateSent: string
  dateDue: string
  datePaid: string
  paymentMethod: 'Zelle' | 'Venmo' | 'Cash' | 'Check' | 'PayPal' | 'CashApp' | 'Other'
  invoiceLink: string
  notes: string
  createdAt: string
}

// ── Equipment ─────────────────────────────────────────────────────────────────
export interface Equipment {
  id: string
  item: string
  category: 'Camera' | 'Audio' | 'Lighting' | 'Support' | 'Computer' | 'Other'
  owned: boolean
  condition: 'Good' | 'Needs Repair' | 'Replace Soon'
  notes: string
  createdAt: string
}

// ── Portal ────────────────────────────────────────────────────────────────────
export interface PortalSettings {
  showFilmKanban: boolean
  showMusicKanban: boolean
  showTimeline: boolean
  showDeliverables: boolean
  showEquipmentList: boolean
  allowMessages: boolean
  welcomeMessage: string
  brandName: string
}

export interface Deliverable {
  id: string
  clientProjectId: string
  title: string
  description: string
  fileLink?: string
  previewLink?: string
  status: 'Pending' | 'Ready for Review' | 'Approved' | 'Revision Requested'
  clientFeedback?: string
  dueDate?: string
  deliveredAt?: string
  createdAt: string
}

export interface PortalMessage {
  id: string
  clientProjectId: string
  sender: 'producer' | 'client'
  senderName: string
  content: string
  timestamp: string
  read: boolean
}

// ── Producer Profile ──────────────────────────────────────────────────────────
export const SPECIALTIES = [
  'Videography', 'Photography', 'Film Direction', 'Music Production',
  'Audio Engineering', 'Color Grading', 'Motion Graphics', 'Live Streaming',
  'Podcast Production', 'Commercial', 'Documentary', 'Wedding',
] as const
export type Specialty = typeof SPECIALTIES[number]

export interface ProducerProfile {
  handle: string
  displayName: string
  bio: string
  location: string
  specialties: string[]
  avatarColor: string
  avatarUrl: string
  instagramUrl: string
  websiteUrl: string
  youtubeUrl: string
  yearsExperience: number
  startingRate: number
  rateType: 'Per Hour' | 'Per Project' | 'Starting At'
  tagline: string
  isPublic: boolean
}

// ── Feed / Social ─────────────────────────────────────────────────────────────
export type FeedPostType = 'Portfolio' | 'Victory' | 'Method' | 'Behind the Scenes'

export interface FeedComment {
  id: string
  author: string
  body: string
  timestamp: string
}

export interface FeedPost {
  id: string
  type: FeedPostType
  title: string
  body: string
  mediaUrl: string
  tags: string[]
  category: string
  likes: number
  likedByMe: boolean
  comments: FeedComment[]
  clientApproved: boolean
  linkedProjectId?: string
  isPublished: boolean
  publishedAt?: string
  createdAt: string
}

// ── Pricing Packages ──────────────────────────────────────────────────────────
export interface PricingPackage {
  id: string
  name: string
  tagline: string
  description: string
  category: string
  price: number
  priceType: 'Fixed' | 'Starting At' | 'Per Hour' | 'Custom Quote'
  deliveryTime: string
  includes: string[]
  isActive: boolean
  popular: boolean
  createdAt: string
}

// ── Private Messaging ─────────────────────────────────────────────────────────
export interface MessageThread {
  id: string
  participantName: string
  participantEmail: string
  subject: string
  clientProjectId?: string
  lastMessageAt: string
  createdAt: string
}

export interface DirectMessage {
  id: string
  threadId: string
  sender: 'producer' | 'client'
  senderName: string
  content: string
  timestamp: string
  read: boolean
}
