import { createContext, useContext, useReducer, useEffect, useCallback } from 'react'
import type { ReactNode } from 'react'
import type { Project, Stage, ScriptBlock, StoryboardPanel, ArrangementTrack, ScoreNote } from '../types'

interface State {
  projects: Project[]
  activeProjectId: string | null
  activeStage: Stage
}

type Action =
  | { type: 'CREATE_PROJECT'; project: Project }
  | { type: 'DELETE_PROJECT'; id: string }
  | { type: 'SET_ACTIVE_PROJECT'; id: string | null }
  | { type: 'SET_STAGE'; stage: Stage }
  | { type: 'UPDATE_SCRIPT'; blocks: ScriptBlock[] }
  | { type: 'UPDATE_STORYBOARD'; panels: StoryboardPanel[] }
  | { type: 'UPDATE_ARRANGEMENT_TRACKS'; tracks: ArrangementTrack[] }
  | { type: 'UPDATE_ARRANGEMENT_META'; bpm: number; key: string }
  | { type: 'UPDATE_SCORE'; notes: ScoreNote[] }
  | { type: 'UPDATE_NOTES'; notes: string }
  | { type: 'COMPLETE_STAGE'; stage: Stage }
  | { type: 'LOAD'; state: State }

const STORAGE_KEY = 'interdisciplinary_v1'

function createDefaultProject(partial: Partial<Project>): Project {
  return {
    id: crypto.randomUUID(),
    name: 'Untitled Project',
    type: 'both',
    genre: '',
    logline: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    currentStage: 'conception',
    completedStages: [],
    script: [],
    storyboard: [],
    arrangement: {
      bpm: 120,
      timeSignature: [4, 4],
      key: 'C major',
      tracks: [],
    },
    score: [],
    notes: '',
    ...partial,
  }
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'LOAD':
      return action.state

    case 'CREATE_PROJECT':
      return { ...state, projects: [...state.projects, action.project], activeProjectId: action.project.id }

    case 'DELETE_PROJECT':
      return {
        ...state,
        projects: state.projects.filter((p) => p.id !== action.id),
        activeProjectId: state.activeProjectId === action.id ? null : state.activeProjectId,
      }

    case 'SET_ACTIVE_PROJECT':
      return { ...state, activeProjectId: action.id, activeStage: 'conception' }

    case 'SET_STAGE':
      return { ...state, activeStage: action.stage }

    case 'UPDATE_SCRIPT':
      return updateProject(state, (p) => ({ ...p, script: action.blocks, updatedAt: new Date().toISOString() }))

    case 'UPDATE_STORYBOARD':
      return updateProject(state, (p) => ({ ...p, storyboard: action.panels, updatedAt: new Date().toISOString() }))

    case 'UPDATE_ARRANGEMENT_TRACKS':
      return updateProject(state, (p) => ({
        ...p,
        arrangement: { ...p.arrangement, tracks: action.tracks },
        updatedAt: new Date().toISOString(),
      }))

    case 'UPDATE_ARRANGEMENT_META':
      return updateProject(state, (p) => ({
        ...p,
        arrangement: { ...p.arrangement, bpm: action.bpm, key: action.key },
        updatedAt: new Date().toISOString(),
      }))

    case 'UPDATE_SCORE':
      return updateProject(state, (p) => ({ ...p, score: action.notes, updatedAt: new Date().toISOString() }))

    case 'UPDATE_NOTES':
      return updateProject(state, (p) => ({ ...p, notes: action.notes, updatedAt: new Date().toISOString() }))

    case 'COMPLETE_STAGE':
      return updateProject(state, (p) => ({
        ...p,
        completedStages: p.completedStages.includes(action.stage)
          ? p.completedStages
          : [...p.completedStages, action.stage],
        updatedAt: new Date().toISOString(),
      }))

    default:
      return state
  }
}

function updateProject(state: State, fn: (p: Project) => Project): State {
  if (!state.activeProjectId) return state
  return {
    ...state,
    projects: state.projects.map((p) => (p.id === state.activeProjectId ? fn(p) : p)),
  }
}

interface Ctx {
  state: State
  activeProject: Project | null
  dispatch: React.Dispatch<Action>
  createProject: (partial: Partial<Project>) => void
}

const ProjectContext = createContext<Ctx | null>(null)

export function ProjectProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, {
    projects: [],
    activeProjectId: null,
    activeStage: 'conception',
  })

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        dispatch({ type: 'LOAD', state: JSON.parse(saved) })
      } catch {
        // ignore parse errors
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  const activeProject = state.projects.find((p) => p.id === state.activeProjectId) ?? null

  const createProject = useCallback((partial: Partial<Project>) => {
    dispatch({ type: 'CREATE_PROJECT', project: createDefaultProject(partial) })
  }, [])

  return (
    <ProjectContext.Provider value={{ state, activeProject, dispatch, createProject }}>
      {children}
    </ProjectContext.Provider>
  )
}

export function useProject() {
  const ctx = useContext(ProjectContext)
  if (!ctx) throw new Error('useProject must be used within ProjectProvider')
  return ctx
}
