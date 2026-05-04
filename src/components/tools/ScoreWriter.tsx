import { useState } from 'react'
import clsx from 'clsx'
import { useProject } from '../../context/ProjectContext'
import { Button } from '../ui/Button'
import type { ScoreNote } from '../../types'

const PITCHES = ['C', 'D', 'E', 'F', 'G', 'A', 'B']
const OCTAVES = [3, 4, 5, 6]
const DURATIONS: ScoreNote['duration'][] = ['whole', 'half', 'quarter', 'eighth', 'sixteenth']
const DURATION_LABELS: Record<ScoreNote['duration'], string> = {
  whole: '𝅝 Whole',
  half: '𝅗𝅥 Half',
  quarter: '♩ Quarter',
  eighth: '♪ Eighth',
  sixteenth: '𝅘𝅥𝅯 16th',
}
const DURATION_BEATS: Record<ScoreNote['duration'], number> = {
  whole: 4,
  half: 2,
  quarter: 1,
  eighth: 0.5,
  sixteenth: 0.25,
}

const PITCH_POSITIONS: Record<string, number> = {
  C: 0, D: 1, E: 2, F: 3, G: 4, A: 5, B: 6,
}

const NOTE_COLORS: Record<ScoreNote['duration'], string> = {
  whole: '#6272f3',
  half: '#48bb9a',
  quarter: '#f59e0b',
  eighth: '#e85d4a',
  sixteenth: '#a78bfa',
}

function createNote(pitch: string, octave: number, duration: ScoreNote['duration'], measure: number, beat: number): ScoreNote {
  return { id: crypto.randomUUID(), pitch, octave, duration, measure, beat }
}

function NoteSymbol({ note }: { note: ScoreNote }) {
  const posY = (6 - PITCH_POSITIONS[note.pitch]) * 8 + (5 - note.octave) * 56
  const color = NOTE_COLORS[note.duration]
  const beatX = note.beat * 40 + 20

  return (
    <g transform={`translate(${beatX}, ${posY})`}>
      {note.duration === 'whole' ? (
        <ellipse cx="0" cy="0" rx="8" ry="5" fill="none" stroke={color} strokeWidth="2" />
      ) : note.duration === 'half' ? (
        <>
          <ellipse cx="0" cy="0" rx="8" ry="5" fill="none" stroke={color} strokeWidth="2" />
          <line x1="8" y1="0" x2="8" y2="-28" stroke={color} strokeWidth="2" />
        </>
      ) : (
        <>
          <ellipse cx="0" cy="0" rx="8" ry="5" fill={color} />
          <line x1="8" y1="0" x2="8" y2="-28" stroke={color} strokeWidth="2" />
          {(note.duration === 'eighth' || note.duration === 'sixteenth') && (
            <line x1="8" y1="-28" x2="18" y2="-20" stroke={color} strokeWidth="2" />
          )}
          {note.duration === 'sixteenth' && (
            <line x1="8" y1="-22" x2="18" y2="-14" stroke={color} strokeWidth="2" />
          )}
        </>
      )}
    </g>
  )
}

export function ScoreWriter() {
  const { activeProject, dispatch } = useProject()
  const [activePitch, setActivePitch] = useState('C')
  const [activeOctave, setActiveOctave] = useState(4)
  const [activeDuration, setActiveDuration] = useState<ScoreNote['duration']>('quarter')
  const [activeMeasure, setActiveMeasure] = useState(1)

  const notes: ScoreNote[] = activeProject?.score ?? []

  const update = (updated: ScoreNote[]) => {
    dispatch({ type: 'UPDATE_SCORE', notes: updated })
  }

  const addNote = () => {
    const measureNotes = notes.filter((n) => n.measure === activeMeasure)
    const nextBeat = measureNotes.reduce((m, n) => Math.max(m, n.beat + DURATION_BEATS[n.duration]), 0)
    if (nextBeat >= 4) return // measure full
    const note = createNote(activePitch, activeOctave, activeDuration, activeMeasure, nextBeat)
    update([...notes, note])
  }

  const deleteNote = (id: string) => {
    update(notes.filter((n) => n.id !== id))
  }

  const clearMeasure = () => {
    update(notes.filter((n) => n.measure !== activeMeasure))
  }

  const measureNotes = notes.filter((n) => n.measure === activeMeasure)

  const exportABC = () => {
    const lines = ['X:1', `T:${activeProject?.name ?? 'Score'}`, 'M:4/4', 'L:1/4', 'K:C']
    const measures = Array.from(new Set(notes.map((n) => n.measure))).sort()
    const body = measures.map((m) => {
      const mNotes = notes.filter((n) => n.measure === m).sort((a, b) => a.beat - b.beat)
      return mNotes.map((n) => {
        const dur = n.duration === 'whole' ? '4' : n.duration === 'half' ? '2' : n.duration === 'eighth' ? '/2' : n.duration === 'sixteenth' ? '/4' : ''
        return `${n.pitch}${n.octave >= 5 ? n.pitch.toLowerCase() : ''}${dur}`
      }).join('')
    }).join('|')
    lines.push(body)
    const blob = new Blob([lines.join('\n')], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${activeProject?.name ?? 'score'}.abc`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="flex flex-col min-h-[500px]">
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3 px-4 py-2 border-b border-white/8 bg-slate-900/40">
        <div className="flex items-center gap-1">
          <span className="text-xs text-slate-500 mr-1">Pitch</span>
          {PITCHES.map((p) => (
            <button
              key={p}
              onClick={() => setActivePitch(p)}
              className={clsx(
                'w-7 h-7 rounded text-xs font-bold transition-colors',
                activePitch === p ? 'bg-brand-600 text-white' : 'bg-white/5 text-slate-400 hover:text-white',
              )}
            >
              {p}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1">
          <span className="text-xs text-slate-500 mr-1">Oct</span>
          {OCTAVES.map((o) => (
            <button
              key={o}
              onClick={() => setActiveOctave(o)}
              className={clsx(
                'w-7 h-7 rounded text-xs font-bold transition-colors',
                activeOctave === o ? 'bg-brand-600 text-white' : 'bg-white/5 text-slate-400 hover:text-white',
              )}
            >
              {o}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1">
          <span className="text-xs text-slate-500 mr-1">Duration</span>
          {DURATIONS.map((d) => (
            <button
              key={d}
              onClick={() => setActiveDuration(d)}
              className={clsx(
                'px-2 h-7 rounded text-xs transition-colors',
                activeDuration === d ? 'bg-brand-600 text-white' : 'bg-white/5 text-slate-400 hover:text-white',
              )}
            >
              {DURATION_LABELS[d].split(' ')[1]}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1">
          <span className="text-xs text-slate-500 mr-1">Measure</span>
          {[1, 2, 3, 4, 5, 6, 7, 8].map((m) => (
            <button
              key={m}
              onClick={() => setActiveMeasure(m)}
              className={clsx(
                'w-7 h-7 rounded text-xs font-mono transition-colors',
                activeMeasure === m ? 'bg-brand-600 text-white' : 'bg-white/5 text-slate-400 hover:text-white',
              )}
            >
              {m}
            </button>
          ))}
        </div>
        <div className="flex gap-2 ml-auto">
          <Button variant="secondary" size="sm" onClick={addNote}>Add Note</Button>
          <Button variant="ghost" size="sm" onClick={clearMeasure}>Clear</Button>
          <Button variant="ghost" size="sm" onClick={exportABC}>Export ABC</Button>
        </div>
      </div>

      {/* Score display */}
      <div className="flex-1 p-6 overflow-x-auto bg-slate-950/40">
        <div className="min-w-[500px]">
          <div className="text-xs text-slate-500 mb-3">Measure {activeMeasure} — {measureNotes.length} notes</div>

          {/* Staff */}
          <svg width="500" height="200" className="overflow-visible">
            {/* Staff lines */}
            {[0, 1, 2, 3, 4].map((i) => (
              <line
                key={i}
                x1="10"
                y1={60 + i * 16}
                x2="490"
                y2={60 + i * 16}
                stroke="#334155"
                strokeWidth="1"
              />
            ))}

            {/* Treble clef simplified */}
            <text x="14" y="100" fill="#64748b" fontSize="72" fontFamily="serif">𝄞</text>

            {/* Time signature */}
            <text x="60" y="82" fill="#64748b" fontSize="20" fontFamily="serif">4</text>
            <text x="60" y="102" fill="#64748b" fontSize="20" fontFamily="serif">4</text>

            {/* Barline start */}
            <line x1="80" y1="60" x2="80" y2="124" stroke="#475569" strokeWidth="1" />

            {/* Barline end */}
            <line x1="490" y1="60" x2="490" y2="124" stroke="#475569" strokeWidth="2" />

            {/* Notes */}
            <g transform="translate(90, 60)">
              {measureNotes.map((note) => (
                <g key={note.id} onClick={() => deleteNote(note.id)} className="cursor-pointer">
                  <NoteSymbol note={note} />
                  <title>Click to delete: {note.pitch}{note.octave} {note.duration}</title>
                </g>
              ))}
            </g>
          </svg>

          {measureNotes.length === 0 && (
            <p className="text-slate-600 text-sm mt-4">
              Select a pitch, octave, and duration above, then click "Add Note" to place notes on the staff.
              Click a note on the staff to delete it.
            </p>
          )}

          <div className="mt-6 flex flex-wrap gap-2">
            {DURATIONS.map((d) => (
              <div key={d} className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: NOTE_COLORS[d] }} />
                <span className="text-xs text-slate-500">{DURATION_LABELS[d]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Note list */}
      {notes.length > 0 && (
        <div className="border-t border-white/8 px-4 py-2 bg-slate-900/40 max-h-24 overflow-y-auto">
          <div className="flex flex-wrap gap-1.5">
            {notes.slice().sort((a, b) => a.measure - b.measure || a.beat - b.beat).map((note) => (
              <span
                key={note.id}
                onClick={() => deleteNote(note.id)}
                className="px-2 py-0.5 rounded text-xs cursor-pointer hover:bg-rose-500/20 transition-colors"
                style={{ backgroundColor: NOTE_COLORS[note.duration] + '33', color: NOTE_COLORS[note.duration] }}
                title={`M${note.measure} beat ${note.beat}`}
              >
                {note.pitch}{note.octave} m{note.measure}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
