import { useState } from 'react'
import clsx from 'clsx'
import { useApp as useProject } from '../../context/AppContext'
import { Button } from '../ui/Button'
import type { StoryboardPanel } from '../../types'
const SHOT_TYPES=['Extreme Wide','Wide','Medium Wide','Medium','Medium Close-Up','Close-Up','Extreme Close-Up','Over-the-Shoulder','POV','Bird\'s Eye','Worm\'s Eye','Dutch Angle','Tracking','Aerial']
const PANEL_COLORS=['#1e293b','#172554','#1e1b4b','#14532d','#431407','#1c1917','#0f172a','#1a1a2e','#1f2937','#111827']
function createPanel():StoryboardPanel{ return {id:crypto.randomUUID(),order:Date.now(),description:'',shotType:'Medium',notes:'',bgColor:PANEL_COLORS[Math.floor(Math.random()*PANEL_COLORS.length)]} }
export function StoryBoard(){
  const {activeProject,updateProject}=useProject()
  const [selected,setSelected]=useState<string|null>(null)
  const panels:StoryboardPanel[]=activeProject?.storyboard??[]
  const update=(p:StoryboardPanel[])=>activeProject&&updateProject(activeProject.id,{storyboard:p})
  const selectedPanel=panels.find(p=>p.id===selected)??null
  return (
    <div className="flex h-full min-h-[500px]">
      <div className="flex-1 overflow-y-auto p-4 bg-slate-950/50">
        <div className="flex items-center justify-between mb-4"><h3 className="text-sm font-semibold text-white">Storyboard</h3><Button variant="secondary" size="sm" onClick={()=>{const p=createPanel();update([...panels,p]);setSelected(p.id)}}>+ Add Panel</Button></div>
        {panels.length===0&&<div className="text-center py-16"><p className="text-slate-600 mb-4 text-sm">No panels yet.</p><Button variant="secondary" size="sm" onClick={()=>{const p=createPanel();update([p]);setSelected(p.id)}}>Add first panel</Button></div>}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {panels.map((panel,i)=><div key={panel.id} onClick={()=>setSelected(panel.id)} className={clsx('relative rounded-lg border cursor-pointer transition-all group',selected===panel.id?'border-brand-400 ring-2 ring-brand-400/30':'border-white/10 hover:border-white/30')}>
            <div className="aspect-video rounded-t-lg flex items-end p-2" style={{backgroundColor:panel.bgColor}}><div className="w-full">{panel.description&&<p className="text-white text-xs leading-tight line-clamp-2 drop-shadow">{panel.description}</p>}</div></div>
            <div className="p-2 bg-slate-800/80 rounded-b-lg"><div className="flex items-center justify-between"><span className="text-xs text-slate-500 font-mono">{String(i+1).padStart(2,'0')}</span><span className="text-xs text-slate-400">{panel.shotType}</span></div></div>
            <div className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={e=>{e.stopPropagation();const idx=panels.findIndex(p=>p.id===panel.id);if(idx>0){const n=[...panels];[n[idx],n[idx-1]]=[n[idx-1],n[idx]];update(n)}}} className="w-5 h-5 rounded bg-black/60 text-white text-xs flex items-center justify-center">←</button>
              <button onClick={e=>{e.stopPropagation();const idx=panels.findIndex(p=>p.id===panel.id);if(idx<panels.length-1){const n=[...panels];[n[idx],n[idx+1]]=[n[idx+1],n[idx]];update(n)}}} className="w-5 h-5 rounded bg-black/60 text-white text-xs flex items-center justify-center">→</button>
              <button onClick={e=>{e.stopPropagation();update(panels.filter(p=>p.id!==panel.id));if(selected===panel.id)setSelected(null)}} className="w-5 h-5 rounded bg-rose-900/80 text-white text-xs flex items-center justify-center">×</button>
            </div>
          </div>)}
        </div>
      </div>
      {selectedPanel&&<div className="w-64 shrink-0 border-l border-white/8 bg-slate-900/60 p-4 overflow-y-auto">
        <h4 className="text-sm font-semibold text-white mb-3">Panel Editor</h4>
        <div className="space-y-3">
          <div><label className="text-xs text-slate-500 mb-1 block">Shot Type</label><select value={selectedPanel.shotType} onChange={e=>update(panels.map(p=>p.id===selectedPanel.id?{...p,shotType:e.target.value}:p))} className="w-full bg-slate-800 border border-white/10 rounded px-2 py-1.5 text-sm text-white">{SHOT_TYPES.map(s=><option key={s} value={s}>{s}</option>)}</select></div>
          <div><label className="text-xs text-slate-500 mb-1 block">Description</label><textarea value={selectedPanel.description} onChange={e=>update(panels.map(p=>p.id===selectedPanel.id?{...p,description:e.target.value}:p))} placeholder="What happens in this shot?" rows={4} className="w-full bg-slate-800 border border-white/10 rounded px-2 py-1.5 text-sm text-white resize-none placeholder-slate-600"/></div>
          <div><label className="text-xs text-slate-500 mb-1 block">Panel Color</label><div className="flex flex-wrap gap-1.5">{PANEL_COLORS.map(color=><button key={color} onClick={()=>update(panels.map(p=>p.id===selectedPanel.id?{...p,bgColor:color}:p))} className={clsx('w-6 h-6 rounded border',selectedPanel.bgColor===color?'border-white ring-1 ring-white':'border-white/20')} style={{backgroundColor:color}}/>)}</div></div>
          <div><label className="text-xs text-slate-500 mb-1 block">Director Notes</label><textarea value={selectedPanel.notes} onChange={e=>update(panels.map(p=>p.id===selectedPanel.id?{...p,notes:e.target.value}:p))} placeholder="Camera movement, lighting, mood..." rows={3} className="w-full bg-slate-800 border border-white/10 rounded px-2 py-1.5 text-sm text-white resize-none placeholder-slate-600"/></div>
        </div>
      </div>}
    </div>
  )
}
