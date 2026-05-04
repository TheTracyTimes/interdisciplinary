import { useState, useRef } from 'react'
import clsx from 'clsx'
import { useProject } from '../../context/ProjectContext'
import { Button } from '../ui/Button'
import type { ArrangementTrack, ArrangementSection } from '../../types'

const TRACK_COLORS = [
  '#6272f3', '#48bb9a', '#e85d4a', '#f59e0b', '#a78bfa',
  '#34d399', '#f97316', '#ec4899', '#60a5fa', '#84cc16',
]

const SECTION_LABELS = [
  'Intro', 'Verse', 'Pre-Chorus', 'Chorus', 'Bridge',
  'Outro', 'Solo', 'Breakdown', 'Drop', 'Build',
]


const BARS_PER_PAGE = 32
const BAR_WIDTH = 24 // px per bar

function createTrack(name: string, colorIdx: number): ArrangementTrack {
  return {
    id: crypto.randomUUID(),
    name,
    type: 'lead',
    color: TRACK_COLORS[colorIdx % TRACK_COLORS.length],
    sections: [],
  }
}

function createSection(trackId: string, startBar: number, color: string): ArrangementSection {
  return {
    id: crypto.randomUUID(),
    label: 'Section',
    startBar,
    lengthBars: 4,
    color,
    trackId,
  }
}

export function ArrangementMapper() {
  const { activeProject, dispatch } = useProject()
  const [selectedSection, setSelectedSection] = useState<{ trackId: string; sectionId: string } | null>(null)
  const [dragging, setDragging] = useState<{ sectionId: string; trackId: string; startX: number; origBar: number } | null>(null)
  const gridRef = useRef<HTMLDivElement>(null)

  const arr = activeProject?.arrangement ?? { bpm: 120, key: 'C major', tracks: [], timeSignature: [4, 4] as [number, number] }
  const tracks = arr.tracks

  const updateTracks = (updated: ArrangementTrack[]) => {
    dispatch({ type: 'UPDATE_ARRANGEMENT_TRACKS', tracks: updated })
  }

  const addTrack = () => {
    const t = createTrack(`Track ${tracks.length + 1}`, tracks.length)
    updateTracks([...tracks, t])
  }

  const deleteTrack = (id: string) => {
    updateTracks(tracks.filter((t) => t.id !== id))
  }

  const updateTrack = (id: string, changes: Partial<ArrangementTrack>) => {
    updateTracks(tracks.map((t) => (t.id === id ? { ...t, ...changes } : t)))
  }

  const addSection = (trackId: string) => {
    const track = tracks.find((t) => t.id === trackId)!
    const maxBar = track.sections.reduce((m, s) => Math.max(m, s.startBar + s.lengthBars), 0)
    const section = createSection(trackId, maxBar, track.color)
    updateTracks(
      tracks.map((t) => (t.id === trackId ? { ...t, sections: [...t.sections, section] } : t)),
    )
    setSelectedSection({ trackId, sectionId: section.id })
  }

  const updateSection = (trackId: string, sectionId: string, changes: Partial<ArrangementSection>) => {
    updateTracks(
      tracks.map((t) =>
        t.id === trackId
          ? { ...t, sections: t.sections.map((s) => (s.id === sectionId ? { ...s, ...changes } : s)) }
          : t,
      ),
    )
  }

  const deleteSection = (trackId: string, sectionId: string) => {
    updateTracks(
      tracks.map((t) =>
        t.id === trackId ? { ...t, sections: t.sections.filter((s) => s.id !== sectionId) } : t,
      ),
    )
    setSelectedSection(null)
  }

  const handleMouseDown = (e: React.MouseEvent, trackId: string, sectionId: string, origBar: number) => {
    e.preventDefault()
    setDragging({ sectionId, trackId, startX: e.clientX, origBar })
    setSelectedSection({ trackId, sectionId })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragging) return
    const dx = e.clientX - dragging.startX
    const barDelta = Math.round(dx / BAR_WIDTH)
    const newBar = Math.max(0, dragging.origBar + barDelta)
    updateSection(dragging.trackId, dragging.sectionId, { startBar: newBar })
  }

  const handleMouseUp = () => setDragging(null)

  const selectedSectionData =
    selectedSection
      ? tracks.find((t) => t.id === selectedSection.trackId)?.sections.find((s) => s.id === selectedSection.sectionId)
      : null

  const barNums = Array.from({ length: BARS_PER_PAGE }, (_, i) => i + 1)

  return (
    <div className="flex flex-col min-h-[500px] h-full">
      {/* Meta bar */}
      <div className="flex items-center gap-4 px-4 py-2 border-b border-white/8 bg-slate-900/40 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">BPM</span>
          <input
            type="number"
            value={arr.bpm}
            min={40}
            max={300}
            onChange={(e) => dispatch({ type: 'UPDATE_ARRANGEMENT_META', bpm: Number(e.target.value), key: arr.key })}
            className="w-16 bg-slate-800 border border-white/10 rounded px-2 py-1 text-sm text-white"
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">Key</span>
          <input
            type="text"
            value={arr.key}
            onChange={(e) => dispatch({ type: 'UPDATE_ARRANGEMENT_META', bpm: arr.bpm, key: e.target.value })}
            className="w-24 bg-slate-800 border border-white/10 rounded px-2 py-1 text-sm text-white"
          />
        </div>
        <div className="ml-auto">
          <Button variant="secondary" size="sm" onClick={addTrack}>+ Add Track</Button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Track labels */}
        <div className="w-36 shrink-0 border-r border-white/8 bg-slate-900/60 flex flex-col">
          <div className="h-8 border-b border-white/8 flex items-center px-3">
            <span className="text-xs text-slate-600">Tracks</span>
          </div>
          {tracks.map((track) => (
            <div
              key={track.id}
              className="h-12 border-b border-white/8 flex items-center px-3 gap-2 group"
            >
              <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: track.color }} />
              <input
                value={track.name}
                onChange={(e) => updateTrack(track.id, { name: e.target.value })}
                className="flex-1 bg-transparent text-xs text-white outline-none min-w-0 truncate"
              />
              <button
                onClick={() => addSection(track.id)}
                className="opacity-0 group-hover:opacity-100 text-xs text-slate-500 hover:text-white px-1"
                title="Add section"
              >
                +
              </button>
              <button
                onClick={() => deleteTrack(track.id)}
                className="opacity-0 group-hover:opacity-100 text-xs text-rose-500 hover:text-rose-300 px-1"
                title="Delete track"
              >
                ×
              </button>
            </div>
          ))}
        </div>

        {/* Timeline grid */}
        <div className="flex-1 overflow-x-auto overflow-y-hidden">
          <div
            ref={gridRef}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            style={{ width: BARS_PER_PAGE * BAR_WIDTH + 'px', minWidth: '100%' }}
          >
            {/* Bar ruler */}
            <div className="h-8 border-b border-white/8 flex items-end bg-slate-950/60">
              {barNums.map((bar) => (
                <div
                  key={bar}
                  style={{ width: BAR_WIDTH }}
                  className={clsx(
                    'shrink-0 h-full flex items-center justify-center border-r border-white/5',
                    bar % 4 === 1 && 'border-white/15',
                  )}
                >
                  {bar % 4 === 1 && (
                    <span className="text-xs text-slate-600 font-mono">{bar}</span>
                  )}
                </div>
              ))}
            </div>

            {/* Track rows */}
            {tracks.map((track) => (
              <div
                key={track.id}
                className="relative h-12 border-b border-white/8 bg-slate-950/30"
              >
                {/* Grid lines */}
                {barNums.map((bar) => (
                  <div
                    key={bar}
                    style={{ left: (bar - 1) * BAR_WIDTH, width: BAR_WIDTH }}
                    className={clsx(
                      'absolute top-0 h-full border-r border-white/5',
                      bar % 4 === 1 && 'border-white/10',
                    )}
                  />
                ))}

                {/* Sections */}
                {track.sections.map((section) => (
                  <div
                    key={section.id}
                    style={{
                      left: section.startBar * BAR_WIDTH,
                      width: section.lengthBars * BAR_WIDTH,
                      backgroundColor: section.color + '99',
                      borderColor: section.color,
                    }}
                    className={clsx(
                      'absolute top-1 bottom-1 rounded border cursor-grab active:cursor-grabbing flex items-center px-2 select-none',
                      selectedSection?.sectionId === section.id && 'ring-2 ring-white/40',
                    )}
                    onMouseDown={(e) => handleMouseDown(e, track.id, section.id, section.startBar)}
                  >
                    <span className="text-xs text-white font-medium truncate">{section.label}</span>
                  </div>
                ))}
              </div>
            ))}

            {tracks.length === 0 && (
              <div className="flex items-center justify-center h-32 text-slate-600 text-sm">
                Add a track to start mapping your arrangement
              </div>
            )}
          </div>
        </div>

        {/* Section editor */}
        {selectedSectionData && selectedSection && (
          <div className="w-48 shrink-0 border-l border-white/8 bg-slate-900/60 p-3 space-y-3">
            <h5 className="text-xs font-semibold text-white">Section</h5>
            <div>
              <label className="text-xs text-slate-500 block mb-1">Label</label>
              <select
                value={selectedSectionData.label}
                onChange={(e) => updateSection(selectedSection.trackId, selectedSection.sectionId, { label: e.target.value })}
                className="w-full bg-slate-800 border border-white/10 rounded px-2 py-1 text-xs text-white"
              >
                {SECTION_LABELS.map((l) => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-500 block mb-1">Length (bars)</label>
              <input
                type="number"
                value={selectedSectionData.lengthBars}
                min={1}
                max={64}
                onChange={(e) => updateSection(selectedSection.trackId, selectedSection.sectionId, { lengthBars: Number(e.target.value) })}
                className="w-full bg-slate-800 border border-white/10 rounded px-2 py-1 text-xs text-white"
              />
            </div>
            <div>
              <label className="text-xs text-slate-500 block mb-1">Start bar</label>
              <input
                type="number"
                value={selectedSectionData.startBar}
                min={0}
                onChange={(e) => updateSection(selectedSection.trackId, selectedSection.sectionId, { startBar: Number(e.target.value) })}
                className="w-full bg-slate-800 border border-white/10 rounded px-2 py-1 text-xs text-white"
              />
            </div>
            <Button
              variant="danger"
              size="sm"
              className="w-full"
              onClick={() => deleteSection(selectedSection.trackId, selectedSection.sectionId)}
            >
              Delete section
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
