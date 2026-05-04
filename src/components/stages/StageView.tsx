import { useState } from 'react'
import clsx from 'clsx'
import { useProject } from '../../context/ProjectContext'
import { STAGES } from '../../data/stages'
import { getStageContent } from '../../data/stageContent'
import { Button } from '../ui/Button'
import { Badge } from '../ui/Badge'
import { Card } from '../ui/Card'
import { ScriptWriter } from '../tools/ScriptWriter'
import { StoryBoard } from '../tools/StoryBoard'
import { ArrangementMapper } from '../tools/ArrangementMapper'
import { ScoreWriter } from '../tools/ScoreWriter'
import type { Stage } from '../../types'

const TOOL_TABS: Partial<Record<Stage, { label: string; component: React.ComponentType }[]>> = {
  'pre-production': [
    { label: '📝 Script', component: ScriptWriter },
    { label: '🎞 Storyboard', component: StoryBoard },
    { label: '🎵 Arrangement', component: ArrangementMapper },
    { label: '🎼 Score', component: ScoreWriter },
  ],
  production: [
    { label: '📝 Script', component: ScriptWriter },
    { label: '🎞 Storyboard', component: StoryBoard },
  ],
  'post-production': [
    { label: '🎵 Arrangement', component: ArrangementMapper },
    { label: '🎼 Score', component: ScoreWriter },
  ],
}

export function StageView() {
  const { state, activeProject, dispatch } = useProject()
  const [activeToolTab, setActiveToolTab] = useState(0)

  const stageInfo = STAGES.find((s) => s.id === state.activeStage)
  if (!stageInfo || !activeProject) return null

  const content = getStageContent(state.activeStage, activeProject.type)
  const toolTabs = TOOL_TABS[state.activeStage] ?? []
  const isCompleted = activeProject.completedStages.includes(state.activeStage)
  const isLocked = stageInfo.tier !== 'free'

  const ActiveTool = toolTabs[activeToolTab]?.component ?? null

  const markComplete = () => {
    dispatch({ type: 'COMPLETE_STAGE', stage: state.activeStage })
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Stage header */}
      <div className={clsx('px-6 pt-5 pb-4 border-b border-white/8 shrink-0', stageInfo.bgColor)}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl">{stageInfo.icon}</span>
              <h2 className="text-xl font-bold text-white">{stageInfo.label}</h2>
              <Badge variant={stageInfo.tier as 'free' | 'creator' | 'pro'}>
                {stageInfo.tier === 'free' ? 'Free' : stageInfo.tier === 'creator' ? 'Creator' : 'Pro'}
              </Badge>
              {isCompleted && <Badge variant="free">Completed ✓</Badge>}
            </div>
            <p className={clsx('text-sm font-medium italic', stageInfo.color)}>{stageInfo.tagline}</p>
          </div>
          {!isCompleted && (
            <Button variant="secondary" size="sm" onClick={markComplete}>
              Mark Complete
            </Button>
          )}
        </div>
      </div>

      {isLocked ? (
        <LockedStage tier={stageInfo.tier} label={stageInfo.label} />
      ) : (
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Learning content */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-6 max-w-3xl">
              <h3 className="text-lg font-semibold text-white mb-3">{content.title}</h3>
              <div className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap mb-6">
                {content.body}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {activeProject.type !== 'music' && content.filmNote && (
                  <Card className="p-4 border-rose-500/20 bg-rose-500/5">
                    <div className="flex items-center gap-1.5 mb-2">
                      <span>🎬</span>
                      <span className="text-xs font-semibold text-rose-400 uppercase tracking-wider">Film note</span>
                    </div>
                    <p className="text-sm text-slate-300">{content.filmNote}</p>
                  </Card>
                )}
                {activeProject.type !== 'film' && content.musicNote && (
                  <Card className="p-4 border-teal-500/20 bg-teal-500/5">
                    <div className="flex items-center gap-1.5 mb-2">
                      <span>🎵</span>
                      <span className="text-xs font-semibold text-teal-400 uppercase tracking-wider">Music note</span>
                    </div>
                    <p className="text-sm text-slate-300">{content.musicNote}</p>
                  </Card>
                )}
              </div>

              <Card className="p-4 border-amber-500/20 bg-amber-500/5 mb-6">
                <div className="flex items-center gap-1.5 mb-2">
                  <span>💡</span>
                  <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">Pro tip</span>
                </div>
                <p className="text-sm text-slate-300">{content.proTip}</p>
              </Card>

              <div>
                <h4 className="text-sm font-semibold text-white mb-3">Stage Checklist</h4>
                <div className="flex flex-col gap-2">
                  {content.checklist.map((item, i) => (
                    <ChecklistItem key={i} stageId={state.activeStage} index={i} text={item} />
                  ))}
                </div>
              </div>
            </div>

            {/* Tools section */}
            {toolTabs.length > 0 && (
              <div className="border-t border-white/8">
                <div className="flex items-center gap-0 px-6 pt-4 pb-0 overflow-x-auto">
                  {toolTabs.map((tab, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveToolTab(i)}
                      className={clsx(
                        'px-4 py-2 text-sm font-medium rounded-t-lg border-b-2 transition-colors whitespace-nowrap',
                        activeToolTab === i
                          ? 'text-white border-brand-400 bg-white/5'
                          : 'text-slate-400 border-transparent hover:text-white',
                      )}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
                <div className="border-t border-white/8">
                  {ActiveTool && <ActiveTool />}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function ChecklistItem({
  stageId,
  index,
  text,
}: {
  stageId: Stage
  index: number
  text: string
}) {
  const key = `checklist_${stageId}_${index}`
  const [checked, setChecked] = useState(() => localStorage.getItem(key) === '1')

  const toggle = () => {
    const next = !checked
    setChecked(next)
    localStorage.setItem(key, next ? '1' : '0')
  }

  return (
    <label className="flex items-start gap-3 cursor-pointer group">
      <div
        onClick={toggle}
        className={clsx(
          'w-4 h-4 rounded border flex items-center justify-center mt-0.5 shrink-0 transition-colors',
          checked
            ? 'bg-emerald-500 border-emerald-500'
            : 'border-white/20 group-hover:border-white/40',
        )}
      >
        {checked && <span className="text-white text-xs leading-none">✓</span>}
      </div>
      <span className={clsx('text-sm', checked ? 'text-slate-500 line-through' : 'text-slate-300')}>
        {text}
      </span>
    </label>
  )
}

function LockedStage({ tier, label }: { tier: string; label: string }) {
  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="text-center max-w-sm">
        <div className="text-5xl mb-4">🔒</div>
        <h3 className="text-xl font-semibold text-white mb-2">{label} is locked</h3>
        <p className="text-slate-400 text-sm mb-6">
          This stage requires a{' '}
          <span className="text-brand-400 font-medium capitalize">{tier}</span> plan or higher.
          Upgrade to unlock all 6 stages, unlimited projects, and full export capabilities.
        </p>
        <Button variant="primary">Upgrade Plan</Button>
      </div>
    </div>
  )
}
