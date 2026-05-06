import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import type {
  CreativeProject, Client, ClientProject, Contract,
  ScheduleEvent, Invoice, Equipment, Asset, Reference, LearningEntry,
  FilmKanban, MusicKanban, Deliverable, PortalMessage, PortalSettings,
  ProducerProfile, FeedPost, FeedComment, PricingPackage, MessageThread, DirectMessage,
} from '../types'

// ── State ─────────────────────────────────────────────────────────────────────
interface AppState {
  creativeProjects: CreativeProject[]
  activeProjectId: string | null
  clients: Client[]
  clientProjects: ClientProject[]
  contracts: Contract[]
  scheduleEvents: ScheduleEvent[]
  invoices: Invoice[]
  equipment: Equipment[]
  assets: Asset[]
  references: Reference[]
  learningEntries: LearningEntry[]
  deliverables: Deliverable[]
  portalMessages: PortalMessage[]
  equipmentPublic: boolean
  producerProfile: ProducerProfile
  feedPosts: FeedPost[]
  pricingPackages: PricingPackage[]
  messageThreads: MessageThread[]
  directMessages: DirectMessage[]
}

const defaultFilmKanban: FilmKanban = {
  Ideas: [], Writing: [], Filming: [], Editing: [],
  'Color Correction': [], 'Color Grading': [], Finished: [],
}

const defaultMusicKanban: MusicKanban = {
  Ideas: [], Scoring: [], Recording: [], Mixing: [],
  Revisions: [], Mastering: [], Finished: [],
}

function defaultProject(overrides: Partial<CreativeProject> = {}): CreativeProject {
  const now = new Date().toISOString()
  return {
    id: crypto.randomUUID(),
    title: 'Untitled Project',
    type: 'Personal',
    status: 'Idea',
    priority: 'Active',
    startDate: now.split('T')[0],
    targetDate: '',
    genre: '',
    mood: '',
    collaborators: [],
    notes: { concept: '', goals: '', ideas: '' },
    filmKanban: { ...defaultFilmKanban },
    musicKanban: { ...defaultMusicKanban },
    script: [],
    storyboard: [],
    arrangement: { bpm: 120, timeSignature: [4, 4], key: 'C major', tracks: [] },
    score: [],
    shotList: [],
    musicCues: [],
    currentStage: 'conception',
    completedStages: [],
    createdAt: now,
    updatedAt: now,
    ...overrides,
  }
}

const STORAGE_KEY = 'interdisciplinary_v2'

const defaultProducerProfile: ProducerProfile = {
  handle: '',
  displayName: '',
  bio: '',
  location: '',
  specialties: [],
  avatarColor: '#6272f3',
  instagramUrl: '',
  websiteUrl: '',
  youtubeUrl: '',
  yearsExperience: 0,
  startingRate: 0,
  rateType: 'Starting At',
  tagline: '',
  isPublic: false,
}

const defaultPortalSettings: PortalSettings = {
  showFilmKanban: false,
  showMusicKanban: false,
  showTimeline: true,
  showDeliverables: true,
  showEquipmentList: false,
  allowMessages: true,
  welcomeMessage: '',
  brandName: '',
}

function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      // Migrate existing clientProjects to include portal fields
      if (parsed.clientProjects) {
        parsed.clientProjects = parsed.clientProjects.map((p: any) => {
          if (p.portalEnabled === undefined) p.portalEnabled = false
          if (!p.portalSettings) p.portalSettings = { ...defaultPortalSettings }
          return p as ClientProject
        })
      }
      return {
        deliverables: [],
        portalMessages: [],
        equipmentPublic: false,
        producerProfile: { ...defaultProducerProfile },
        feedPosts: [],
        pricingPackages: [],
        messageThreads: [],
        directMessages: [],
        ...parsed,
      }
    }
  } catch {}
  return {
    creativeProjects: [],
    activeProjectId: null,
    clients: [],
    clientProjects: [],
    contracts: [],
    scheduleEvents: [],
    invoices: [],
    equipment: [],
    assets: [],
    references: [],
    learningEntries: [],
    deliverables: [],
    portalMessages: [],
    equipmentPublic: false,
    producerProfile: { ...defaultProducerProfile },
    feedPosts: [],
    pricingPackages: [],
    messageThreads: [],
    directMessages: [],
  }
}

// ── Context interface ─────────────────────────────────────────────────────────
interface AppContextValue {
  state: AppState
  activeProject: CreativeProject | null

  // Creative Projects
  createProject: (overrides?: Partial<CreativeProject>) => string
  updateProject: (id: string, data: Partial<CreativeProject>) => void
  deleteProject: (id: string) => void
  setActiveProject: (id: string | null) => void

  // Clients
  createClient: (data: Omit<Client, 'id' | 'createdAt'>) => string
  updateClient: (id: string, data: Partial<Client>) => void
  deleteClient: (id: string) => void

  // Client Projects
  createClientProject: (data: Omit<ClientProject, 'id' | 'createdAt'>) => string
  updateClientProject: (id: string, data: Partial<ClientProject>) => void
  deleteClientProject: (id: string) => void

  // Contracts
  createContract: (data: Omit<Contract, 'id' | 'createdAt'>) => string
  updateContract: (id: string, data: Partial<Contract>) => void
  deleteContract: (id: string) => void

  // Schedule
  createEvent: (data: Omit<ScheduleEvent, 'id' | 'createdAt'>) => string
  updateEvent: (id: string, data: Partial<ScheduleEvent>) => void
  deleteEvent: (id: string) => void

  // Invoices
  createInvoice: (data: Omit<Invoice, 'id' | 'createdAt'>) => string
  updateInvoice: (id: string, data: Partial<Invoice>) => void
  deleteInvoice: (id: string) => void

  // Equipment
  createEquipment: (data: Omit<Equipment, 'id' | 'createdAt'>) => string
  updateEquipment: (id: string, data: Partial<Equipment>) => void
  deleteEquipment: (id: string) => void

  // Assets
  createAsset: (data: Omit<Asset, 'id' | 'createdAt'>) => string
  updateAsset: (id: string, data: Partial<Asset>) => void
  deleteAsset: (id: string) => void

  // References
  createReference: (data: Omit<Reference, 'id'>) => string
  updateReference: (id: string, data: Partial<Reference>) => void
  deleteReference: (id: string) => void

  // Learning
  createLearning: (data: Omit<LearningEntry, 'id'>) => string
  updateLearning: (id: string, data: Partial<LearningEntry>) => void
  deleteLearning: (id: string) => void

  // Deliverables
  createDeliverable: (data: Omit<Deliverable, 'id' | 'createdAt'>) => string
  updateDeliverable: (id: string, data: Partial<Deliverable>) => void
  deleteDeliverable: (id: string) => void

  // Portal Messages
  createPortalMessage: (data: Omit<PortalMessage, 'id'>) => string
  markMessagesRead: (clientProjectId: string) => void

  // Portal token management
  generatePortalToken: (clientProjectId: string) => string
  revokePortalToken: (clientProjectId: string) => void

  // Equipment public toggle
  setEquipmentPublic: (value: boolean) => void
  defaultPortalSettings: PortalSettings

  // Producer Profile
  updateProducerProfile: (data: Partial<ProducerProfile>) => void
  defaultProducerProfile: ProducerProfile

  // Feed Posts
  createFeedPost: (data: Omit<FeedPost, 'id' | 'createdAt' | 'likes' | 'likedByMe' | 'comments'>) => string
  updateFeedPost: (id: string, data: Partial<FeedPost>) => void
  deleteFeedPost: (id: string) => void
  toggleFeedLike: (id: string) => void
  addFeedComment: (postId: string, comment: Omit<FeedComment, 'id'>) => void

  // Pricing Packages
  createPricingPackage: (data: Omit<PricingPackage, 'id' | 'createdAt'>) => string
  updatePricingPackage: (id: string, data: Partial<PricingPackage>) => void
  deletePricingPackage: (id: string) => void

  // Message Threads
  createMessageThread: (data: Omit<MessageThread, 'id' | 'createdAt' | 'lastMessageAt'>) => string
  updateMessageThread: (id: string, data: Partial<MessageThread>) => void
  deleteMessageThread: (id: string) => void

  // Direct Messages
  sendDirectMessage: (data: Omit<DirectMessage, 'id'>) => string
  markThreadRead: (threadId: string) => void
}

const AppContext = createContext<AppContextValue | null>(null)

// ── Provider ──────────────────────────────────────────────────────────────────
export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(loadState)

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)) } catch {}
  }, [state])

  const activeProject = state.creativeProjects.find(p => p.id === state.activeProjectId) ?? null

  // ── Generic helpers ──────────────────────────────────────────────────────
  const now = () => new Date().toISOString()

  function makeCreate<T extends { id: string; createdAt: string }>(
    key: keyof AppState,
    factory: (data: Omit<T, 'id' | 'createdAt'>) => T,
  ) {
    return (data: Omit<T, 'id' | 'createdAt'>) => {
      const item = factory(data)
      setState(s => ({ ...s, [key]: [...(s[key] as unknown as T[]), item] }))
      return item.id
    }
  }

  function makeUpdate<T extends { id: string }>(key: keyof AppState) {
    return (id: string, data: Partial<T>) => {
      setState(s => ({
        ...s,
        [key]: (s[key] as unknown as T[]).map(item => item.id === id ? { ...item, ...data } : item),
      }))
    }
  }

  function makeDelete<T extends { id: string }>(key: keyof AppState) {
    return (id: string) => {
      setState(s => ({ ...s, [key]: (s[key] as unknown as T[]).filter(item => item.id !== id) }))
    }
  }

  // ── Creative Projects ─────────────────────────────────────────────────────
  const createProject = useCallback((overrides?: Partial<CreativeProject>) => {
    const project = defaultProject(overrides)
    setState(s => ({
      ...s,
      creativeProjects: [...s.creativeProjects, project],
      activeProjectId: project.id,
    }))
    return project.id
  }, [])

  const updateProject = useCallback((id: string, data: Partial<CreativeProject>) => {
    setState(s => ({
      ...s,
      creativeProjects: s.creativeProjects.map(p =>
        p.id === id ? { ...p, ...data, updatedAt: now() } : p
      ),
    }))
  }, [])

  const deleteProject = useCallback((id: string) => {
    setState(s => ({
      ...s,
      creativeProjects: s.creativeProjects.filter(p => p.id !== id),
      activeProjectId: s.activeProjectId === id ? null : s.activeProjectId,
    }))
  }, [])

  const setActiveProject = useCallback((id: string | null) => {
    setState(s => ({ ...s, activeProjectId: id }))
  }, [])

  // ── Clients ───────────────────────────────────────────────────────────────
  const createClient = makeCreate<Client>('clients', data => ({
    id: crypto.randomUUID(), createdAt: now(), ...data,
  }))
  const updateClient = makeUpdate<Client>('clients')
  const deleteClient = makeDelete<Client>('clients')

  // ── Client Projects ───────────────────────────────────────────────────────
  const createClientProject = makeCreate<ClientProject>('clientProjects', data => {
    const item: ClientProject = {
      id: crypto.randomUUID(), createdAt: now(), ...data,
    }
    if (item.portalEnabled === undefined) item.portalEnabled = false
    if (!item.portalSettings) item.portalSettings = { ...defaultPortalSettings }
    return item
  })
  const updateClientProject = makeUpdate<ClientProject>('clientProjects')
  const deleteClientProject = makeDelete<ClientProject>('clientProjects')

  // ── Contracts ─────────────────────────────────────────────────────────────
  const createContract = makeCreate<Contract>('contracts', data => ({
    id: crypto.randomUUID(), createdAt: now(), ...data,
  }))
  const updateContract = makeUpdate<Contract>('contracts')
  const deleteContract = makeDelete<Contract>('contracts')

  // ── Schedule ──────────────────────────────────────────────────────────────
  const createEvent = makeCreate<ScheduleEvent>('scheduleEvents', data => ({
    id: crypto.randomUUID(), createdAt: now(), ...data,
  }))
  const updateEvent = makeUpdate<ScheduleEvent>('scheduleEvents')
  const deleteEvent = makeDelete<ScheduleEvent>('scheduleEvents')

  // ── Invoices ──────────────────────────────────────────────────────────────
  const createInvoice = makeCreate<Invoice>('invoices', data => ({
    id: crypto.randomUUID(), createdAt: now(), ...data,
  }))
  const updateInvoice = makeUpdate<Invoice>('invoices')
  const deleteInvoice = makeDelete<Invoice>('invoices')

  // ── Equipment ─────────────────────────────────────────────────────────────
  const createEquipment = makeCreate<Equipment>('equipment', data => ({
    id: crypto.randomUUID(), createdAt: now(), ...data,
  }))
  const updateEquipment = makeUpdate<Equipment>('equipment')
  const deleteEquipment = makeDelete<Equipment>('equipment')

  // ── Assets ────────────────────────────────────────────────────────────────
  const createAsset = makeCreate<Asset>('assets', data => ({
    id: crypto.randomUUID(), createdAt: now(), ...data,
  }))
  const updateAsset = makeUpdate<Asset>('assets')
  const deleteAsset = makeDelete<Asset>('assets')

  // ── References ────────────────────────────────────────────────────────────
  const createReference = useCallback((data: Omit<Reference, 'id'>) => {
    const ref: Reference = { id: crypto.randomUUID(), ...data }
    setState(s => ({ ...s, references: [...s.references, ref] }))
    return ref.id
  }, [])
  const updateReference = makeUpdate<Reference>('references')
  const deleteReference = makeDelete<Reference>('references')

  // ── Learning ──────────────────────────────────────────────────────────────
  const createLearning = useCallback((data: Omit<LearningEntry, 'id'>) => {
    const entry: LearningEntry = { id: crypto.randomUUID(), ...data }
    setState(s => ({ ...s, learningEntries: [...s.learningEntries, entry] }))
    return entry.id
  }, [])
  const updateLearning = makeUpdate<LearningEntry>('learningEntries')
  const deleteLearning = makeDelete<LearningEntry>('learningEntries')

  // ── Deliverables ──────────────────────────────────────────────────────────
  const createDeliverable = makeCreate<Deliverable>('deliverables', data => ({
    id: crypto.randomUUID(), createdAt: now(), ...data,
  }))
  const updateDeliverable = makeUpdate<Deliverable>('deliverables')
  const deleteDeliverable = makeDelete<Deliverable>('deliverables')

  // ── Portal Messages ───────────────────────────────────────────────────────
  const createPortalMessage = useCallback((data: Omit<PortalMessage, 'id'>) => {
    const msg: PortalMessage = { id: crypto.randomUUID(), ...data }
    setState(s => ({ ...s, portalMessages: [...s.portalMessages, msg] }))
    return msg.id
  }, [])

  const markMessagesRead = useCallback((clientProjectId: string) => {
    setState(s => ({
      ...s,
      portalMessages: s.portalMessages.map(m =>
        m.clientProjectId === clientProjectId ? { ...m, read: true } : m
      ),
    }))
  }, [])

  // ── Portal tokens ─────────────────────────────────────────────────────────
  const generatePortalToken = useCallback((clientProjectId: string) => {
    const token = crypto.randomUUID().replace(/-/g, '').slice(0, 20)
    setState(s => ({
      ...s,
      clientProjects: s.clientProjects.map(p =>
        p.id === clientProjectId ? { ...p, shareToken: token, portalEnabled: true } : p
      ),
    }))
    return token
  }, [])

  const revokePortalToken = useCallback((clientProjectId: string) => {
    setState(s => ({
      ...s,
      clientProjects: s.clientProjects.map(p =>
        p.id === clientProjectId ? { ...p, shareToken: undefined, portalEnabled: false } : p
      ),
    }))
  }, [])

  // ── Equipment public ──────────────────────────────────────────────────────
  const setEquipmentPublic = useCallback((value: boolean) => {
    setState(s => ({ ...s, equipmentPublic: value }))
  }, [])

  // ── Producer Profile ──────────────────────────────────────────────────────
  const updateProducerProfile = useCallback((data: Partial<ProducerProfile>) => {
    setState(s => ({ ...s, producerProfile: { ...s.producerProfile, ...data } }))
  }, [])

  // ── Feed Posts ────────────────────────────────────────────────────────────
  const createFeedPost = useCallback((data: Omit<FeedPost, 'id' | 'createdAt' | 'likes' | 'likedByMe' | 'comments'>) => {
    const post: FeedPost = {
      id: crypto.randomUUID(), createdAt: now(),
      likes: 0, likedByMe: false, comments: [], ...data,
    }
    setState(s => ({ ...s, feedPosts: [post, ...s.feedPosts] }))
    return post.id
  }, [])

  const updateFeedPost = makeUpdate<FeedPost>('feedPosts')
  const deleteFeedPost = makeDelete<FeedPost>('feedPosts')

  const toggleFeedLike = useCallback((id: string) => {
    setState(s => ({
      ...s,
      feedPosts: s.feedPosts.map(p =>
        p.id === id ? { ...p, likedByMe: !p.likedByMe, likes: p.likedByMe ? p.likes - 1 : p.likes + 1 } : p
      ),
    }))
  }, [])

  const addFeedComment = useCallback((postId: string, comment: Omit<FeedComment, 'id'>) => {
    const c: FeedComment = { id: crypto.randomUUID(), ...comment }
    setState(s => ({
      ...s,
      feedPosts: s.feedPosts.map(p => p.id === postId ? { ...p, comments: [...p.comments, c] } : p),
    }))
  }, [])

  // ── Pricing Packages ──────────────────────────────────────────────────────
  const createPricingPackage = makeCreate<PricingPackage>('pricingPackages', data => ({
    id: crypto.randomUUID(), createdAt: now(), ...data,
  }))
  const updatePricingPackage = makeUpdate<PricingPackage>('pricingPackages')
  const deletePricingPackage = makeDelete<PricingPackage>('pricingPackages')

  // ── Message Threads ───────────────────────────────────────────────────────
  const createMessageThread = useCallback((data: Omit<MessageThread, 'id' | 'createdAt' | 'lastMessageAt'>) => {
    const t: MessageThread = { id: crypto.randomUUID(), createdAt: now(), lastMessageAt: now(), ...data }
    setState(s => ({ ...s, messageThreads: [t, ...s.messageThreads] }))
    return t.id
  }, [])
  const updateMessageThread = makeUpdate<MessageThread>('messageThreads')
  const deleteMessageThread = makeDelete<MessageThread>('messageThreads')

  // ── Direct Messages ───────────────────────────────────────────────────────
  const sendDirectMessage = useCallback((data: Omit<DirectMessage, 'id'>) => {
    const msg: DirectMessage = { id: crypto.randomUUID(), ...data }
    setState(s => ({
      ...s,
      directMessages: [...s.directMessages, msg],
      messageThreads: s.messageThreads.map(t =>
        t.id === data.threadId ? { ...t, lastMessageAt: data.timestamp } : t
      ),
    }))
    return msg.id
  }, [])

  const markThreadRead = useCallback((threadId: string) => {
    setState(s => ({
      ...s,
      directMessages: s.directMessages.map(m =>
        m.threadId === threadId ? { ...m, read: true } : m
      ),
    }))
  }, [])

  const value: AppContextValue = {
    state, activeProject,
    createProject, updateProject, deleteProject, setActiveProject,
    createClient, updateClient, deleteClient,
    createClientProject, updateClientProject, deleteClientProject,
    createContract, updateContract, deleteContract,
    createEvent, updateEvent, deleteEvent,
    createInvoice, updateInvoice, deleteInvoice,
    createEquipment, updateEquipment, deleteEquipment,
    createAsset, updateAsset, deleteAsset,
    createReference, updateReference, deleteReference,
    createLearning, updateLearning, deleteLearning,
    createDeliverable, updateDeliverable, deleteDeliverable,
    createPortalMessage, markMessagesRead,
    generatePortalToken, revokePortalToken,
    setEquipmentPublic, defaultPortalSettings,
    updateProducerProfile, defaultProducerProfile,
    createFeedPost, updateFeedPost, deleteFeedPost, toggleFeedLike, addFeedComment,
    createPricingPackage, updatePricingPackage, deletePricingPackage,
    createMessageThread, updateMessageThread, deleteMessageThread,
    sendDirectMessage, markThreadRead,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}

// Backward-compat alias for existing tools
export const useProject = useApp
