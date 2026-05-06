import { useEffect, useRef, useState } from 'react'
import clsx from 'clsx'
import { Renderer, Stave, StaveNote, Voice, Formatter, Beam, Accidental } from 'vexflow'
import jsPDF from 'jspdf'
import { useApp } from '../../context/AppContext'
import { Button } from '../ui/Button'
import type { ScoreNote } from '../../types'

const PITCHES = ['C', 'D', 'E', 'F', 'G', 'A', 'B']
const PITCH_ACCIDENTALS = ['C#', 'Db', 'D#', 'Eb', 'F#', 'Gb', 'G#', 'Ab', 'A#', 'Bb']
const OCTAVES = [3, 4, 5, 6]
const DURATIONS: ScoreNote['duration'][] = ['whole', 'half', 'quarter', 'eighth', 'sixteenth']
const DUR_LABEL: Record<ScoreNote['duration'], string> = { whole: 'Whole', half: 'Half', quarter: 'Quarter', eighth: 'Eighth', sixteenth: '16th' }
const DUR_BEATS: Record<ScoreNote['duration'], number> = { whole: 4, half: 2, quarter: 1, eighth: 0.5, sixteenth: 0.25 }
const VF_DUR: Record<ScoreNote['duration'], string> = { whole: 'w', half: 'h', quarter: 'q', eighth: '8', sixteenth: '16' }

// Map our pitch string to VexFlow key format
function toVFKey(pitch: string, octave: number): string {
  // 'C#' → 'c#/4', 'Bb' → 'bb/4', 'C' → 'c/4'
  const lower = pitch.toLowerCase()
  return `${lower}/${octave}`
}

// Extract accidental character for VexFlow Accidental class
function getAccidental(pitch: string): string | null {
  if (pitch.includes('#')) return '#'
  if (pitch.endsWith('b') && pitch.length > 1) return 'b'
  return null
}

function generateMusicXML(notes: ScoreNote[], title: string): string {
  const measures: Record<number, ScoreNote[]> = {}
  for (const n of notes) {
    if (!measures[n.measure]) measures[n.measure] = []
    measures[n.measure].push(n)
  }

  const durType: Record<ScoreNote['duration'], string> = {
    whole: 'whole', half: 'half', quarter: 'quarter', eighth: 'eighth', sixteenth: '16th',
  }
  const durDivisions: Record<ScoreNote['duration'], number> = {
    whole: 16, half: 8, quarter: 4, eighth: 2, sixteenth: 1,
  }

  const measureNums = Object.keys(measures).map(Number).sort((a, b) => a - b)
  if (measureNums.length === 0) measureNums.push(1)

  const measureXml = measureNums.map(num => {
    const attrs = num === measureNums[0] ? `
      <attributes>
        <divisions>4</divisions>
        <key><fifths>0</fifths><mode>major</mode></key>
        <time><beats>4</beats><beat-type>4</beat-type></time>
        <clef><sign>G</sign><line>2</line></clef>
      </attributes>` : ''

    const noteXml = (measures[num] || []).map(n => {
      const step = n.pitch.replace('#', '').replace('b', '')
      const alter = n.pitch.includes('#') ? '<alter>1</alter>' : n.pitch.endsWith('b') && n.pitch.length > 1 ? '<alter>-1</alter>' : ''
      return `
      <note>
        <pitch>
          <step>${step.toUpperCase()}</step>
          ${alter}
          <octave>${n.octave}</octave>
        </pitch>
        <duration>${durDivisions[n.duration]}</duration>
        <type>${durType[n.duration]}</type>
      </note>`
    }).join('')

    return `
    <measure number="${num}">${attrs}${noteXml}
    </measure>`
  }).join('')

  return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE score-partwise PUBLIC "-//Recordare//DTD MusicXML 3.1 Partwise//EN"
  "http://www.musicxml.org/dtds/partwise.dtd">
<score-partwise version="3.1">
  <work><work-title>${title}</work-title></work>
  <part-list>
    <score-part id="P1"><part-name>Music</part-name></score-part>
  </part-list>
  <part id="P1">${measureXml}
  </part>
</score-partwise>`
}

function downloadText(content: string, filename: string, mime: string) {
  const blob = new Blob([content], { type: mime })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url; a.download = filename; a.click()
  URL.revokeObjectURL(url)
}

function downloadSVG(container: HTMLDivElement, filename: string) {
  const svgEl = container.querySelector('svg')
  if (!svgEl) return
  const data = new XMLSerializer().serializeToString(svgEl)
  downloadText(data, filename, 'image/svg+xml')
}

async function exportScorePDF(container: HTMLDivElement, title: string) {
  const svgEl = container.querySelector('svg')
  if (!svgEl) return

  const svgData = new XMLSerializer().serializeToString(svgEl)
  const svgBase64 = btoa(unescape(encodeURIComponent(svgData)))
  const imgSrc = 'data:image/svg+xml;base64,' + svgBase64

  const img = new Image()
  await new Promise<void>(resolve => {
    img.onload = () => resolve()
    img.src = imgSrc
  })

  const W = svgEl.clientWidth || 800
  const H = svgEl.clientHeight || 200
  const canvas = document.createElement('canvas')
  canvas.width = W; canvas.height = H
  const ctx = canvas.getContext('2d')!
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, W, H)
  ctx.drawImage(img, 0, 0)

  const pdf = new jsPDF({ orientation: W > H ? 'landscape' : 'portrait', unit: 'px', format: [W + 80, H + 100] })
  pdf.setFont('helvetica', 'bold')
  pdf.setFontSize(14)
  pdf.setTextColor(20, 20, 20)
  pdf.text(title || 'Score', 40, 36)
  pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 40, 50, W, H)
  pdf.save(`${title || 'score'}.pdf`)
}

export function ScoreWriter() {
  const { activeProject, updateProject } = useApp()
  const containerRef = useRef<HTMLDivElement>(null)

  const [pitch, setPitch] = useState('C')
  const [octave, setOctave] = useState(4)
  const [duration, setDuration] = useState<ScoreNote['duration']>('quarter')
  const [currentMeasure, setCurrentMeasure] = useState(1)
  const [page, setPage] = useState(0) // 4 measures per page

  const MEASURES_PER_PAGE = 4

  const notes: ScoreNote[] = activeProject?.score ?? []

  const updateNotes = (n: ScoreNote[]) => activeProject && updateProject(activeProject.id, { score: n })

  const measureBeats = (num: number) =>
    notes.filter(n => n.measure === num).reduce((sum, n) => sum + DUR_BEATS[n.duration], 0)

  function addNote() {
    const used = measureBeats(currentMeasure)
    const needed = DUR_BEATS[duration]
    if (used + needed > 4) return
    updateNotes([...notes, {
      id: crypto.randomUUID(),
      pitch, octave, duration,
      measure: currentMeasure,
      beat: used,
    }])
  }

  function deleteNote(id: string) {
    updateNotes(notes.filter(n => n.id !== id))
  }

  const maxMeasure = Math.max(...notes.map(n => n.measure), 1)
  const totalPages = Math.ceil(maxMeasure / MEASURES_PER_PAGE)

  // VexFlow render
  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    container.innerHTML = ''

    const STAVE_H = 150
    const PAD_TOP = 50
    const PAD_LEFT = 16
    const FIRST_W = 280
    const REST_W = 200
    const TOTAL_W = PAD_LEFT + FIRST_W + REST_W * (MEASURES_PER_PAGE - 1) + PAD_LEFT

    const renderer = new Renderer(container, Renderer.Backends.SVG)
    renderer.resize(TOTAL_W, STAVE_H + PAD_TOP + 20)
    const ctx = renderer.getContext()
    ctx.setFont('Arial', 10)
    ctx.setFillStyle('#e2e8f0')
    ctx.setStrokeStyle('#e2e8f0')

    let x = PAD_LEFT
    const startMeasure = page * MEASURES_PER_PAGE + 1

    for (let i = 0; i < MEASURES_PER_PAGE; i++) {
      const measureNum = startMeasure + i
      const w = i === 0 ? FIRST_W : REST_W
      const stave = new Stave(x, PAD_TOP, w)
      if (i === 0) stave.addClef('treble').addTimeSignature('4/4')
      stave.setContext(ctx).draw()

      // highlight current measure
      if (measureNum === currentMeasure) {
        ctx.save()
        ctx.setFillStyle('rgba(98,114,243,0.08)')
        ctx.fillRect(x, PAD_TOP, w, 80)
        ctx.restore()
      }

      // measure number label
      ctx.save()
      ctx.setFillStyle(measureNum === currentMeasure ? '#6272f3' : '#475569')
      ctx.setFont('monospace', 9)
      ctx.fillText(`M${measureNum}`, x + 4, PAD_TOP - 8)
      ctx.restore()

      const measureNotes = notes
        .filter(n => n.measure === measureNum)
        .sort((a, b) => a.beat - b.beat)

      if (measureNotes.length > 0) {
        try {
          const vfNotes = measureNotes.map(n => {
            const key = toVFKey(n.pitch, n.octave)
            const note = new StaveNote({ keys: [key], duration: VF_DUR[n.duration] })
            const acc = getAccidental(n.pitch)
            if (acc) note.addModifier(new Accidental(acc), 0)
            return note
          })

          const voice = new Voice({ numBeats: 4, beatValue: 4 })
          voice.setMode(Voice.Mode.SOFT)
          voice.addTickables(vfNotes)

          const beamable = vfNotes.filter(n => {
            const dur = measureNotes.find(mn => toVFKey(mn.pitch, mn.octave) === (n as any).keys?.[0])?.duration
            return dur === 'eighth' || dur === 'sixteenth'
          })
          const beams = beamable.length > 1 ? Beam.generateBeams(beamable) : []

          new Formatter().joinVoices([voice]).format([voice], w - 30)
          voice.draw(ctx, stave)
          beams.forEach(b => b.setContext(ctx).draw())
        } catch {
          // Skip rendering errors for malformed measures
        }
      }

      x += w
    }

    // Style the SVG
    const svg = container.querySelector('svg')
    if (svg) {
      svg.style.background = '#111113'
      svg.style.borderRadius = '8px'
    }
  }, [notes, page, currentMeasure])

  const beatsLeft = 4 - measureBeats(currentMeasure)
  const canAdd = beatsLeft >= DUR_BEATS[duration]

  return (
    <div className="flex flex-col h-full min-h-[500px]">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-4 px-5 py-3 border-b border-white/8 shrink-0" style={{ background: '#111113' }}>

        {/* Pitch */}
        <div className="flex flex-col gap-1">
          <span className="text-[9px] font-mono text-slate-600 uppercase tracking-widest">Pitch</span>
          <div className="flex gap-0.5">
            {PITCHES.map(p => (
              <button key={p} onClick={() => setPitch(p)}
                className={clsx('w-6 h-6 text-[10px] font-bold font-mono transition-colors', pitch === p ? 'text-white' : 'text-slate-600 hover:text-slate-300')}
                style={{ background: pitch === p ? '#6272f3' : 'rgba(255,255,255,0.05)', borderRadius: 3 }}>
                {p}
              </button>
            ))}
          </div>
          <div className="flex gap-0.5 flex-wrap">
            {PITCH_ACCIDENTALS.map(p => (
              <button key={p} onClick={() => setPitch(p)}
                className={clsx('h-5 px-1 text-[9px] font-mono transition-colors', pitch === p ? 'text-white' : 'text-slate-700 hover:text-slate-400')}
                style={{ background: pitch === p ? '#a855f7' : 'rgba(255,255,255,0.04)', borderRadius: 2 }}>
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Octave */}
        <div className="flex flex-col gap-1">
          <span className="text-[9px] font-mono text-slate-600 uppercase tracking-widest">Octave</span>
          <div className="flex gap-0.5">
            {OCTAVES.map(o => (
              <button key={o} onClick={() => setOctave(o)}
                className={clsx('w-6 h-6 text-[10px] font-bold font-mono transition-colors', octave === o ? 'text-white' : 'text-slate-600 hover:text-slate-300')}
                style={{ background: octave === o ? '#6272f3' : 'rgba(255,255,255,0.05)', borderRadius: 3 }}>
                {o}
              </button>
            ))}
          </div>
        </div>

        {/* Duration */}
        <div className="flex flex-col gap-1">
          <span className="text-[9px] font-mono text-slate-600 uppercase tracking-widest">Duration</span>
          <div className="flex gap-0.5">
            {DURATIONS.map(d => (
              <button key={d} onClick={() => setDuration(d)}
                className={clsx('px-2 h-6 text-[9px] font-mono transition-colors', duration === d ? 'text-white' : 'text-slate-600 hover:text-slate-300')}
                style={{ background: duration === d ? '#6272f3' : 'rgba(255,255,255,0.05)', borderRadius: 3 }}>
                {DUR_LABEL[d]}
              </button>
            ))}
          </div>
        </div>

        {/* Measure */}
        <div className="flex flex-col gap-1">
          <span className="text-[9px] font-mono text-slate-600 uppercase tracking-widest">Measure</span>
          <div className="flex items-center gap-1">
            <button onClick={() => { const m = Math.max(1, currentMeasure - 1); setCurrentMeasure(m); setPage(Math.floor((m - 1) / MEASURES_PER_PAGE)) }}
              className="w-6 h-6 text-slate-500 hover:text-white text-xs font-mono" style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 3 }}>
              &lt;
            </button>
            <span className="text-xs font-mono text-white w-6 text-center">{currentMeasure}</span>
            <button onClick={() => { const m = currentMeasure + 1; setCurrentMeasure(m); setPage(Math.floor((m - 1) / MEASURES_PER_PAGE)) }}
              className="w-6 h-6 text-slate-500 hover:text-white text-xs font-mono" style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 3 }}>
              &gt;
            </button>
          </div>
        </div>

        {/* Add / Clear */}
        <div className="flex flex-col gap-1 ml-auto">
          <span className="text-[9px] font-mono text-slate-600 uppercase tracking-widest">
            {canAdd ? `${beatsLeft} beats left` : 'Measure full'}
          </span>
          <div className="flex gap-1">
            <Button size="sm" onClick={addNote} disabled={!canAdd}>Add Note</Button>
            <Button variant="ghost" size="sm" onClick={() => updateNotes(notes.filter(n => n.measure !== currentMeasure))}>
              Clear M{currentMeasure}
            </Button>
          </div>
        </div>
      </div>

      {/* Staff */}
      <div className="flex-1 overflow-auto p-4" style={{ background: '#0c0c0e' }}>
        <div ref={containerRef} className="min-w-[800px]" />

        {/* Page nav */}
        {totalPages > 1 && (
          <div className="flex items-center gap-2 mt-3">
            <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}
              className="text-[10px] font-mono text-slate-500 hover:text-white disabled:opacity-30 px-2 py-1 border border-white/8 rounded transition-colors">
              Prev
            </button>
            <span className="text-[10px] font-mono text-slate-600">
              Page {page + 1} of {totalPages} &nbsp;· measures {page * MEASURES_PER_PAGE + 1}–{Math.min((page + 1) * MEASURES_PER_PAGE, maxMeasure)}
            </span>
            <button onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1}
              className="text-[10px] font-mono text-slate-500 hover:text-white disabled:opacity-30 px-2 py-1 border border-white/8 rounded transition-colors">
              Next
            </button>
          </div>
        )}

        {/* Note list for current measure */}
        {notes.filter(n => n.measure === currentMeasure).length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {notes
              .filter(n => n.measure === currentMeasure)
              .sort((a, b) => a.beat - b.beat)
              .map(n => (
                <button
                  key={n.id}
                  onClick={() => deleteNote(n.id)}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded border border-white/10 text-[10px] font-mono text-slate-400 hover:border-red-400/50 hover:text-red-400 transition-colors"
                  style={{ background: '#1a1a1d' }}
                  title="Click to delete"
                >
                  <span className="text-brand-400">{n.pitch}{n.octave}</span>
                  <span className="text-slate-600">{DUR_LABEL[n.duration]}</span>
                  <span className="text-slate-700">×</span>
                </button>
              ))}
          </div>
        )}

        {notes.length === 0 && (
          <p className="text-slate-700 text-xs font-mono mt-6">Select pitch, octave, and duration above, then click Add Note. Click any note pill to delete it.</p>
        )}
      </div>

      {/* Export bar */}
      <div className="px-5 py-3 border-t border-white/8 flex items-center gap-2 flex-wrap shrink-0" style={{ background: '#111113' }}>
        <span className="text-[9px] font-mono text-slate-600 uppercase tracking-widest mr-2">Export</span>
        <Button variant="outline" size="sm" onClick={() => {
          if (containerRef.current) downloadSVG(containerRef.current, `${activeProject?.title || 'score'}.svg`)
        }}>
          SVG
        </Button>
        <Button variant="outline" size="sm" onClick={() => {
          if (containerRef.current) exportScorePDF(containerRef.current, activeProject?.title || 'Score')
        }}>
          PDF
        </Button>
        <Button variant="outline" size="sm" onClick={() => {
          const xml = generateMusicXML(notes, activeProject?.title || 'Score')
          downloadText(xml, `${activeProject?.title || 'score'}.musicxml`, 'application/xml')
        }}>
          MusicXML
        </Button>
        <span className="text-[9px] font-mono text-slate-700 ml-2">MusicXML opens in MuseScore, Finale, Sibelius, Dorico</span>
      </div>
    </div>
  )
}
