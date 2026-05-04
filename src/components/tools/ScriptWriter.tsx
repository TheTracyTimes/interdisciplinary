import { useState, useRef } from 'react'
import clsx from 'clsx'
import { useProject } from '../../context/ProjectContext'
import { Button } from '../ui/Button'
import type { ScriptBlock } from '../../types'

type BlockType = ScriptBlock['type']

const BLOCK_LABELS: Record<BlockType, string> = {
  scene: 'Scene Heading',
  action: 'Action',
  character: 'Character',
  dialogue: 'Dialogue',
  parenthetical: 'Parenthetical',
  transition: 'Transition',
}

const BLOCK_STYLES: Record<BlockType, string> = {
  scene: 'uppercase font-bold text-amber-300',
  action: 'text-slate-200',
  character: 'uppercase text-center text-white font-semibold',
  dialogue: 'text-slate-200 mx-auto max-w-[55%]',
  parenthetical: 'text-slate-400 italic text-center mx-auto max-w-[40%]',
  transition: 'uppercase text-right text-slate-400',
}

const BLOCK_PLACEHOLDERS: Record<BlockType, string> = {
  scene: 'INT. LOCATION - DAY',
  action: 'Describe what the audience sees...',
  character: 'CHARACTER NAME',
  dialogue: 'What the character says...',
  parenthetical: '(beat)',
  transition: 'CUT TO:',
}

const NEXT_BLOCK: Record<BlockType, BlockType> = {
  scene: 'action',
  action: 'character',
  character: 'dialogue',
  dialogue: 'character',
  parenthetical: 'dialogue',
  transition: 'scene',
}

function createBlock(type: BlockType): ScriptBlock {
  return { id: crypto.randomUUID(), type, content: '' }
}

export function ScriptWriter() {
  const { activeProject, dispatch } = useProject()
  const [focusedId, setFocusedId] = useState<string | null>(null)
  const textareaRefs = useRef<Record<string, HTMLTextAreaElement | null>>({})

  const blocks: ScriptBlock[] = activeProject?.script ?? []

  const update = (updated: ScriptBlock[]) => {
    dispatch({ type: 'UPDATE_SCRIPT', blocks: updated })
  }

  const addBlock = (afterId: string | null, type: BlockType) => {
    const block = createBlock(type)
    if (afterId === null) {
      update([...blocks, block])
    } else {
      const idx = blocks.findIndex((b) => b.id === afterId)
      const next = [...blocks]
      next.splice(idx + 1, 0, block)
      update(next)
    }
    setTimeout(() => {
      textareaRefs.current[block.id]?.focus()
      setFocusedId(block.id)
    }, 30)
  }

  const deleteBlock = (id: string) => {
    const idx = blocks.findIndex((b) => b.id === id)
    const next = blocks.filter((b) => b.id !== id)
    update(next)
    const prevId = next[idx - 1]?.id ?? next[0]?.id
    if (prevId) {
      setTimeout(() => textareaRefs.current[prevId]?.focus(), 30)
    }
  }

  const changeContent = (id: string, content: string) => {
    update(blocks.map((b) => (b.id === id ? { ...b, content } : b)))
  }

  const changeType = (id: string, type: BlockType) => {
    update(blocks.map((b) => (b.id === id ? { ...b, type } : b)))
  }

  const handleKeyDown = (e: React.KeyboardEvent, block: ScriptBlock) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      addBlock(block.id, NEXT_BLOCK[block.type])
    }
    if (e.key === 'Backspace' && block.content === '' && blocks.length > 1) {
      e.preventDefault()
      deleteBlock(block.id)
    }
  }

  const exportScript = () => {
    const text = blocks
      .map((b) => {
        switch (b.type) {
          case 'scene': return `\n${b.content}\n`
          case 'action': return `\n${b.content}\n`
          case 'character': return `\n                    ${b.content}`
          case 'dialogue': return `          ${b.content}\n`
          case 'parenthetical': return `               ${b.content}`
          case 'transition': return `\n                                        ${b.content}\n`
          default: return b.content
        }
      })
      .join('\n')

    const blob = new Blob([text], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${activeProject?.name ?? 'script'}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="flex flex-col h-full min-h-[500px]">
      {/* Toolbar */}
      <div className="flex items-center gap-2 px-6 py-2 border-b border-white/8 bg-slate-900/40 flex-wrap">
        <span className="text-xs text-slate-500 mr-1">Add block:</span>
        {(Object.keys(BLOCK_LABELS) as BlockType[]).map((type) => (
          <button
            key={type}
            onClick={() => addBlock(focusedId, type)}
            className="px-2 py-1 text-xs rounded bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            {BLOCK_LABELS[type]}
          </button>
        ))}
        <div className="ml-auto">
          <Button variant="ghost" size="sm" onClick={exportScript}>
            Export .txt
          </Button>
        </div>
      </div>

      {/* Script area */}
      <div className="flex-1 overflow-y-auto bg-slate-950/50 p-6">
        {blocks.length === 0 && (
          <div className="text-center py-16">
            <p className="text-slate-600 mb-4 text-sm">Your script is empty.</p>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                const b1 = createBlock('scene')
                b1.content = 'INT. LOCATION - DAY'
                const b2 = createBlock('action')
                update([b1, b2])
                setTimeout(() => {
                  textareaRefs.current[b2.id]?.focus()
                  setFocusedId(b2.id)
                }, 30)
              }}
            >
              Start script
            </Button>
          </div>
        )}

        <div className="max-w-2xl mx-auto font-mono text-sm space-y-1">
          {blocks.map((block) => (
            <div
              key={block.id}
              className={clsx(
                'group relative',
                focusedId === block.id && 'bg-white/3 rounded',
              )}
            >
              {/* Block type selector */}
              {focusedId === block.id && (
                <div className="absolute -left-32 top-0 flex flex-col gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <select
                    value={block.type}
                    onChange={(e) => changeType(block.id, e.target.value as BlockType)}
                    className="text-xs bg-slate-800 border border-white/10 rounded px-1 py-0.5 text-slate-400"
                  >
                    {(Object.keys(BLOCK_LABELS) as BlockType[]).map((t) => (
                      <option key={t} value={t}>{BLOCK_LABELS[t]}</option>
                    ))}
                  </select>
                </div>
              )}

              <textarea
                ref={(el) => { textareaRefs.current[block.id] = el }}
                value={block.content}
                placeholder={BLOCK_PLACEHOLDERS[block.type]}
                rows={1}
                onFocus={() => setFocusedId(block.id)}
                onBlur={() => setFocusedId(null)}
                onChange={(e) => {
                  changeContent(block.id, e.target.value)
                  e.target.style.height = 'auto'
                  e.target.style.height = e.target.scrollHeight + 'px'
                }}
                onKeyDown={(e) => handleKeyDown(e, block)}
                className={clsx(
                  'w-full bg-transparent resize-none outline-none placeholder-slate-700 leading-relaxed py-1 px-2',
                  BLOCK_STYLES[block.type],
                )}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="px-6 py-2 border-t border-white/8 text-xs text-slate-600">
        {blocks.length} blocks · Press Enter to add next block · Backspace on empty block to delete
      </div>
    </div>
  )
}
