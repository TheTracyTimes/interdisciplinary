import { useState, useRef, useCallback } from 'react'
import clsx from 'clsx'
import jsPDF from 'jspdf'
import { Document, Packer, Paragraph, TextRun, AlignmentType } from 'docx'
import { useApp } from '../../context/AppContext'
import { Button } from '../ui/Button'
import type { ScriptBlock, ScriptBlockType } from '../../types'

type BlockType = ScriptBlockType

const LABELS: Record<BlockType, string> = {
  scene: 'Scene Heading',
  action: 'Action',
  character: 'Character',
  dialogue: 'Dialogue',
  parenthetical: 'Parenthetical',
  transition: 'Transition',
}

const STYLES: Record<BlockType, string> = {
  scene: 'uppercase font-bold tracking-wide',
  action: 'text-slate-200',
  character: 'uppercase text-center font-semibold',
  dialogue: 'text-slate-200 mx-auto',
  parenthetical: 'text-slate-400 italic text-center mx-auto',
  transition: 'uppercase text-right text-slate-400',
}

const PLACEHOLDERS: Record<BlockType, string> = {
  scene: 'INT. LOCATION - DAY',
  action: 'Describe what the audience sees...',
  character: 'CHARACTER NAME',
  dialogue: 'What the character says...',
  parenthetical: '(beat)',
  transition: 'CUT TO:',
}

const NEXT: Record<BlockType, BlockType> = {
  scene: 'action',
  action: 'character',
  character: 'dialogue',
  dialogue: 'character',
  parenthetical: 'dialogue',
  transition: 'scene',
}

const ACCENT: Record<BlockType, string> = {
  scene: '#06b6d4',
  action: '#64748b',
  character: '#6272f3',
  dialogue: '#94a3b8',
  parenthetical: '#475569',
  transition: '#f59e0b',
}

// ── Fountain parser ──────────────────────────────────────────────────────────

function parseFountain(text: string): ScriptBlock[] {
  const blocks: ScriptBlock[] = []
  const lines = text.split('\n')
  let i = 0

  while (i < lines.length) {
    const line = lines[i].trimEnd()

    // Skip empty lines
    if (!line.trim()) { i++; continue }

    // Scene heading: starts with INT./EXT./INT/EXT/EST/I./E. or forced with .
    if (/^(INT\.|EXT\.|INT\/EXT\.|I\/E\.|\.(?!\.))/.test(line) || /^(INT|EXT)\s/.test(line)) {
      blocks.push({ id: crypto.randomUUID(), type: 'scene', content: line.replace(/^\./, '') })
      i++; continue
    }

    // Transition: ends with TO: or is FADE OUT./FADE IN:
    if (/^(FADE (IN|OUT|TO)|CUT TO:|DISSOLVE TO:|SMASH CUT TO:|MATCH CUT TO:|JUMP CUT TO:)/i.test(line) || /\sTO:$/.test(line)) {
      blocks.push({ id: crypto.randomUUID(), type: 'transition', content: line })
      i++; continue
    }

    // Parenthetical: wrapped in ()
    if (/^\(.*\)$/.test(line.trim())) {
      blocks.push({ id: crypto.randomUUID(), type: 'parenthetical', content: line.trim() })
      i++; continue
    }

    // Character: all-uppercase, no lowercase letters, followed by dialogue
    const nextLine = lines[i + 1]?.trimEnd()
    if (
      line === line.toUpperCase() &&
      /[A-Z]/.test(line) &&
      !line.startsWith('//') &&
      nextLine !== undefined &&
      nextLine.trim() !== '' &&
      !/^(INT\.|EXT\.)/.test(line)
    ) {
      blocks.push({ id: crypto.randomUUID(), type: 'character', content: line.trim().replace(/\s*\(.*\)$/, '') })
      i++
      // consume dialogue / parentheticals
      while (i < lines.length && lines[i].trim() !== '') {
        const dl = lines[i].trimEnd()
        if (/^\(.*\)$/.test(dl.trim())) {
          blocks.push({ id: crypto.randomUUID(), type: 'parenthetical', content: dl.trim() })
        } else {
          blocks.push({ id: crypto.randomUUID(), type: 'dialogue', content: dl })
        }
        i++
      }
      continue
    }

    // Action (default)
    blocks.push({ id: crypto.randomUUID(), type: 'action', content: line })
    i++
  }
  return blocks

  return blocks
}

// ── Fountain serializer ──────────────────────────────────────────────────────

function toFountain(blocks: ScriptBlock[]): string {
  return blocks.map((b) => {
    switch (b.type) {
      case 'scene':
        return `\n${b.content.toUpperCase()}\n`
      case 'action':
        return `\n${b.content}\n`
      case 'character': {
        const name = b.content.toUpperCase()
        return `\n${name}`
      }
      case 'dialogue':
        return b.content
      case 'parenthetical':
        return b.content
      case 'transition':
        return `\n${b.content.toUpperCase()}\n`
      default:
        return b.content
    }
  }).join('\n')
}

// ── PDF export ───────────────────────────────────────────────────────────────

function exportPDF(blocks: ScriptBlock[], title: string) {
  const pdf = new jsPDF({ unit: 'pt', format: 'letter' })
  // Letter: 612 x 792 pt
  // Margins: top 72, bottom 72, left 108 (1.5"), right 72 (1")
  const pageW = 612
  const pageH = 792
  const marginLeft = 108
  const marginRight = 72
  const marginTop = 72
  const marginBottom = 72
  const textWidth = pageW - marginLeft - marginRight

  pdf.setFont('Courier', 'normal')
  pdf.setFontSize(12)
  pdf.setTextColor(0, 0, 0)

  // Title page
  pdf.setFont('Courier', 'bold')
  pdf.setFontSize(16)
  pdf.text(title || 'Untitled Screenplay', pageW / 2, 350, { align: 'center' })
  pdf.setFont('Courier', 'normal')
  pdf.setFontSize(12)
  pdf.text('Written with Interdisciplinary', pageW / 2, 380, { align: 'center' })
  pdf.addPage()

  let y = marginTop

  function addPageIfNeeded(linesNeeded = 1) {
    if (y + linesNeeded * 14 > pageH - marginBottom) {
      pdf.addPage()
      y = marginTop
    }
  }

  for (const block of blocks) {
    if (!block.content.trim()) continue
    addPageIfNeeded(2)

    switch (block.type) {
      case 'scene':
        y += 14 // blank line before
        pdf.setFont('Courier', 'bold')
        pdf.setFontSize(12)
        const sceneLines = pdf.splitTextToSize(block.content.toUpperCase(), textWidth)
        pdf.text(sceneLines, marginLeft, y)
        y += sceneLines.length * 14 + 7
        break

      case 'action':
        pdf.setFont('Courier', 'normal')
        pdf.setFontSize(12)
        const actionLines = pdf.splitTextToSize(block.content, textWidth)
        pdf.text(actionLines, marginLeft, y)
        y += actionLines.length * 14 + 7
        break

      case 'character':
        y += 7
        pdf.setFont('Courier', 'normal')
        pdf.setFontSize(12)
        pdf.text(block.content.toUpperCase(), marginLeft + 160, y)
        y += 14
        break

      case 'dialogue': {
        pdf.setFont('Courier', 'normal')
        pdf.setFontSize(12)
        const dialogueLines = pdf.splitTextToSize(block.content, textWidth - 120)
        pdf.text(dialogueLines, marginLeft + 80, y)
        y += dialogueLines.length * 14
        break
      }

      case 'parenthetical':
        pdf.setFont('Courier', 'italic')
        pdf.setFontSize(12)
        pdf.text(block.content, marginLeft + 120, y)
        y += 14
        break

      case 'transition':
        y += 7
        pdf.setFont('Courier', 'normal')
        pdf.setFontSize(12)
        pdf.text(block.content.toUpperCase(), marginLeft, y, { align: 'right', maxWidth: textWidth + marginLeft })
        y += 14 + 7
        break
    }

    addPageIfNeeded()
  }

  // Page numbers
  const totalPages = pdf.getNumberOfPages()
  for (let p = 2; p <= totalPages; p++) {
    pdf.setPage(p)
    pdf.setFont('Courier', 'normal')
    pdf.setFontSize(12)
    pdf.setTextColor(100, 100, 100)
    pdf.text(`${p - 1}.`, pageW - marginRight, marginTop - 20)
    pdf.setTextColor(0, 0, 0)
  }

  pdf.save(`${title || 'screenplay'}.pdf`)
}

// ── DOCX export ──────────────────────────────────────────────────────────────

async function exportDOCX(blocks: ScriptBlock[], title: string) {
  const inch = 1440 // 1 inch in twips
  const half = 720
  const courier = 'Courier New'
  const size = 24 // 12pt in half-points

  const children = [
    // Title
    new Paragraph({
      children: [new TextRun({ text: (title || 'Untitled Screenplay').toUpperCase(), font: courier, size: 28, bold: true })],
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 },
    }),
    new Paragraph({
      children: [new TextRun({ text: 'Written with Interdisciplinary', font: courier, size: 20, color: '888888' })],
      alignment: AlignmentType.CENTER,
      spacing: { after: 800 },
    }),
    new Paragraph({ children: [new TextRun({ text: '' })], pageBreakBefore: true }),

    ...blocks.filter(b => b.content.trim()).map(b => {
      switch (b.type) {
        case 'scene':
          return new Paragraph({
            children: [new TextRun({ text: b.content.toUpperCase(), font: courier, size, bold: true })],
            spacing: { before: 240, after: 120 },
          })
        case 'action':
          return new Paragraph({
            children: [new TextRun({ text: b.content, font: courier, size })],
            spacing: { after: 120 },
          })
        case 'character':
          return new Paragraph({
            children: [new TextRun({ text: b.content.toUpperCase(), font: courier, size, bold: true })],
            alignment: AlignmentType.CENTER,
            spacing: { before: 240, after: 0 },
          })
        case 'dialogue':
          return new Paragraph({
            children: [new TextRun({ text: b.content, font: courier, size })],
            indent: { left: half, right: half },
            spacing: { after: 0 },
          })
        case 'parenthetical':
          return new Paragraph({
            children: [new TextRun({ text: b.content, font: courier, size, italics: true })],
            alignment: AlignmentType.CENTER,
            spacing: { after: 0 },
          })
        case 'transition':
          return new Paragraph({
            children: [new TextRun({ text: b.content.toUpperCase(), font: courier, size })],
            alignment: AlignmentType.RIGHT,
            spacing: { before: 240, after: 240 },
          })
        default:
          return new Paragraph({ children: [new TextRun({ text: b.content, font: courier, size })] })
      }
    }),
  ]

  const doc = new Document({
    sections: [{
      properties: { page: { margin: { top: inch, bottom: inch, left: Math.round(inch * 1.5), right: inch } } },
      children,
    }],
  })

  const blob = await Packer.toBlob(doc)
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url; a.download = `${title || 'screenplay'}.docx`; a.click()
  URL.revokeObjectURL(url)
}

// ── Helper ───────────────────────────────────────────────────────────────────

function createBlock(type: BlockType): ScriptBlock {
  return { id: crypto.randomUUID(), type, content: '' }
}

function downloadText(content: string, filename: string, mime: string) {
  const blob = new Blob([content], { type: mime })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url; a.download = filename; a.click()
  URL.revokeObjectURL(url)
}

// ── Component ────────────────────────────────────────────────────────────────

export function ScriptWriter() {
  const { activeProject, updateProject } = useApp()
  const [focusedId, setFocusedId] = useState<string | null>(null)
  const [exportOpen, setExportOpen] = useState(false)
  const refs = useRef<Record<string, HTMLTextAreaElement | null>>({})
  const fileRef = useRef<HTMLInputElement>(null)

  const blocks: ScriptBlock[] = activeProject?.script ?? []
  const update = (b: ScriptBlock[]) => activeProject && updateProject(activeProject.id, { script: b })

  const addBlock = useCallback((afterId: string | null, type: BlockType) => {
    const b = createBlock(type)
    if (afterId === null) {
      update([...blocks, b])
    } else {
      const idx = blocks.findIndex(x => x.id === afterId)
      const next = [...blocks]
      next.splice(idx + 1, 0, b)
      update(next)
    }
    setTimeout(() => { refs.current[b.id]?.focus(); setFocusedId(b.id) }, 30)
  }, [blocks, update])

  const deleteBlock = useCallback((id: string) => {
    const idx = blocks.findIndex(b => b.id === id)
    const next = blocks.filter(b => b.id !== id)
    update(next)
    const prev = next[idx - 1]?.id ?? next[0]?.id
    if (prev) setTimeout(() => refs.current[prev]?.focus(), 30)
  }, [blocks, update])

  function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => {
      const text = ev.target?.result as string
      const parsed = parseFountain(text)
      update(parsed)
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  const title = activeProject?.title || 'Screenplay'
  const sceneCount = blocks.filter(b => b.type === 'scene').length
  const wordCount = blocks.reduce((sum, b) => sum + b.content.split(/\s+/).filter(Boolean).length, 0)

  return (
    <div className="flex flex-col h-full min-h-[500px]">
      {/* Toolbar */}
      <div className="flex items-center gap-2 px-5 py-2 border-b border-white/8 shrink-0 flex-wrap" style={{ background: '#111113' }}>
        <span className="text-[9px] font-mono text-slate-600 uppercase tracking-widest mr-1">Add block</span>
        {(Object.keys(LABELS) as BlockType[]).map(type => (
          <button
            key={type}
            onClick={() => addBlock(focusedId, type)}
            className="flex items-center gap-1 px-2 py-1 text-[9px] font-mono uppercase tracking-wider rounded transition-colors hover:text-white"
            style={{ background: 'rgba(255,255,255,0.04)', color: ACCENT[type], border: `1px solid ${ACCENT[type]}30` }}
          >
            {LABELS[type]}
          </button>
        ))}

        <div className="ml-auto flex items-center gap-2">
          {/* Import */}
          <input ref={fileRef} type="file" accept=".fountain,.txt" className="hidden" onChange={handleImport} />
          <Button variant="ghost" size="sm" onClick={() => fileRef.current?.click()}>
            Import .fountain
          </Button>

          {/* Export dropdown */}
          <div className="relative">
            <Button variant="outline" size="sm" onClick={() => setExportOpen(v => !v)}>
              Export {exportOpen ? '▲' : '▼'}
            </Button>
            {exportOpen && (
              <div
                className="absolute right-0 top-full mt-1 border border-white/10 z-50 min-w-[160px]"
                style={{ background: '#111113', borderRadius: 4 }}
              >
                {[
                  {
                    label: 'Fountain (.fountain)',
                    action: () => downloadText(toFountain(blocks), `${title}.fountain`, 'text/plain'),
                  },
                  {
                    label: 'Plain Text (.txt)',
                    action: () => {
                      const text = blocks.map(b => {
                        switch (b.type) {
                          case 'scene': return `\n${b.content.toUpperCase()}\n`
                          case 'character': return `\n                    ${b.content.toUpperCase()}`
                          case 'dialogue': return `          ${b.content}`
                          case 'parenthetical': return `               ${b.content}`
                          case 'transition': return `\n                                        ${b.content.toUpperCase()}`
                          default: return `\n${b.content}`
                        }
                      }).join('\n')
                      downloadText(text, `${title}.txt`, 'text/plain')
                    },
                  },
                  {
                    label: 'PDF (.pdf)',
                    action: () => exportPDF(blocks, title),
                  },
                  {
                    label: 'Word (.docx)',
                    action: () => exportDOCX(blocks, title),
                  },
                ].map(opt => (
                  <button
                    key={opt.label}
                    onClick={() => { opt.action(); setExportOpen(false) }}
                    className="w-full text-left px-3 py-2 text-[10px] font-mono text-slate-400 hover:text-white hover:bg-white/5 transition-colors border-b border-white/6 last:border-0 uppercase tracking-widest"
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 overflow-y-auto p-6" style={{ background: '#08080a' }}>
        {blocks.length === 0 && (
          <div className="text-center py-16">
            <p className="text-slate-600 text-sm font-mono mb-6">Your script is empty.</p>
            <div className="flex flex-col items-center gap-2">
              <Button variant="secondary" size="sm" onClick={() => {
                const s = createBlock('scene'); s.content = 'INT. LOCATION - DAY'
                const a = createBlock('action')
                update([s, a])
                setTimeout(() => { refs.current[a.id]?.focus(); setFocusedId(a.id) }, 30)
              }}>
                Start new script
              </Button>
              <button onClick={() => fileRef.current?.click()} className="text-xs text-brand-400 hover:text-brand-300 font-mono">
                or import a .fountain file
              </button>
            </div>
          </div>
        )}

        <div className="max-w-2xl mx-auto font-mono text-sm space-y-0">
          {blocks.map(block => (
            <div
              key={block.id}
              className={clsx(
                'group relative flex items-start gap-0 transition-colors',
                focusedId === block.id ? 'bg-white/2 rounded-sm' : '',
              )}
            >
              {/* Block type indicator */}
              <div
                className="w-1 shrink-0 self-stretch rounded-l mt-0.5 opacity-0 group-focus-within:opacity-100 transition-opacity"
                style={{ background: ACCENT[block.type] }}
              />
              <textarea
                ref={el => { refs.current[block.id] = el }}
                value={block.content}
                placeholder={PLACEHOLDERS[block.type]}
                rows={1}
                onFocus={() => setFocusedId(block.id)}
                onBlur={() => setFocusedId(null)}
                onChange={e => {
                  update(blocks.map(b => b.id === block.id ? { ...b, content: e.target.value } : b))
                  e.target.style.height = 'auto'
                  e.target.style.height = e.target.scrollHeight + 'px'
                }}
                onKeyDown={e => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    addBlock(block.id, NEXT[block.type])
                  }
                  if (e.key === 'Backspace' && block.content === '' && blocks.length > 1) {
                    e.preventDefault()
                    deleteBlock(block.id)
                  }
                }}
                className={clsx(
                  'w-full bg-transparent resize-none outline-none placeholder-slate-800 leading-relaxed py-1.5 px-3',
                  STYLES[block.type],
                  'text-[13px]',
                )}
                style={{ color: block.content ? undefined : undefined }}
              />
              {/* Block type label on focus */}
              {focusedId === block.id && (
                <span
                  className="absolute right-2 top-1.5 text-[8px] font-mono uppercase tracking-widest opacity-40"
                  style={{ color: ACCENT[block.type] }}
                >
                  {LABELS[block.type]}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="px-5 py-2 border-t border-white/8 flex items-center gap-4 shrink-0" style={{ background: '#111113' }}>
        <span className="text-[9px] font-mono text-slate-700 uppercase tracking-widest">
          {blocks.length} blocks
        </span>
        <span className="text-[9px] font-mono text-slate-700 uppercase tracking-widest">
          {sceneCount} scenes
        </span>
        <span className="text-[9px] font-mono text-slate-700 uppercase tracking-widest">
          {wordCount} words
        </span>
        <span className="text-[9px] font-mono text-slate-700 uppercase tracking-widest ml-auto">
          Enter to advance · Backspace on empty to delete · Shift+Enter for newline
        </span>
      </div>
    </div>
  )
}
