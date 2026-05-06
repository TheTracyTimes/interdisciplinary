import { useState, useRef } from 'react'
import clsx from 'clsx'
import { useApp as useProject } from '../../context/AppContext'
import { Button } from '../ui/Button'
import type { ArrangementTrack, ArrangementSection } from '../../types'
const TRACK_COLORS=['#6272f3','#48bb9a','#e85d4a','#f59e0b','#a78bfa','#34d399','#f97316','#ec4899','#60a5fa','#84cc16']
const SECTION_LABELS=['Intro','Verse','Pre-Chorus','Chorus','Bridge','Outro','Solo','Breakdown','Drop','Build']
const BARS=32; const BW=24
function mkTrack(name:string,ci:number):ArrangementTrack{ return {id:crypto.randomUUID(),name,type:'lead',color:TRACK_COLORS[ci%TRACK_COLORS.length],sections:[]} }
function mkSection(trackId:string,startBar:number,color:string):ArrangementSection{ return {id:crypto.randomUUID(),label:'Section',startBar,lengthBars:4,color,trackId} }
export function ArrangementMapper(){
  const {activeProject,updateProject}=useProject()
  const [sel,setSel]=useState<{trackId:string;sectionId:string}|null>(null)
  const [drag,setDrag]=useState<{sectionId:string;trackId:string;startX:number;origBar:number}|null>(null)
  const ref=useRef<HTMLDivElement>(null)
  const arr=activeProject?.arrangement??{bpm:120,key:'C major',tracks:[],timeSignature:[4,4] as [number,number]}
  const tracks=arr.tracks
  const setTracks=(t:ArrangementTrack[])=>activeProject&&updateProject(activeProject.id,{arrangement:{...arr,tracks:t}})
  const updSec=(tid:string,sid:string,ch:Partial<ArrangementSection>)=>setTracks(tracks.map(t=>t.id===tid?{...t,sections:t.sections.map(s=>s.id===sid?{...s,...ch}:s)}:t))
  const selData=sel?tracks.find(t=>t.id===sel.trackId)?.sections.find(s=>s.id===sel.sectionId):null
  const bars=Array.from({length:BARS},(_,i)=>i+1)
  return (
    <div className="flex flex-col min-h-[500px] h-full">
      <div className="flex items-center gap-4 px-4 py-2 border-b border-white/8 bg-slate-900/40 flex-wrap">
        <div className="flex items-center gap-2"><span className="text-xs text-slate-500">BPM</span><input type="number" value={arr.bpm} min={40} max={300} onChange={e=>activeProject&&updateProject(activeProject.id,{arrangement:{...arr,bpm:Number(e.target.value)}})} className="w-16 bg-slate-800 border border-white/10 rounded px-2 py-1 text-sm text-white"/></div>
        <div className="flex items-center gap-2"><span className="text-xs text-slate-500">Key</span><input type="text" value={arr.key} onChange={e=>activeProject&&updateProject(activeProject.id,{arrangement:{...arr,key:e.target.value}})} className="w-24 bg-slate-800 border border-white/10 rounded px-2 py-1 text-sm text-white"/></div>
        <div className="ml-auto"><Button variant="secondary" size="sm" onClick={()=>setTracks([...tracks,mkTrack(`Track ${tracks.length+1}`,tracks.length)])}>+ Add Track</Button></div>
      </div>
      <div className="flex flex-1 overflow-hidden">
        <div className="w-36 shrink-0 border-r border-white/8 bg-slate-900/60 flex flex-col">
          <div className="h-8 border-b border-white/8 flex items-center px-3"><span className="text-xs text-slate-600">Tracks</span></div>
          {tracks.map(track=><div key={track.id} className="h-12 border-b border-white/8 flex items-center px-3 gap-2 group">
            <div className="w-2 h-2 rounded-full shrink-0" style={{backgroundColor:track.color}}/>
            <input value={track.name} onChange={e=>setTracks(tracks.map(t=>t.id===track.id?{...t,name:e.target.value}:t))} className="flex-1 bg-transparent text-xs text-white outline-none min-w-0 truncate"/>
            <button onClick={()=>{const t=tracks.find(x=>x.id===track.id)!;const maxBar=t.sections.reduce((m,s)=>Math.max(m,s.startBar+s.lengthBars),0);const s=mkSection(track.id,maxBar,track.color);setTracks(tracks.map(x=>x.id===track.id?{...x,sections:[...x.sections,s]}:x));setSel({trackId:track.id,sectionId:s.id})}} className="opacity-0 group-hover:opacity-100 text-xs text-slate-500 hover:text-white px-1" title="Add section">+</button>
            <button onClick={()=>setTracks(tracks.filter(t=>t.id!==track.id))} className="opacity-0 group-hover:opacity-100 text-xs text-rose-500 hover:text-rose-300 px-1">×</button>
          </div>)}
        </div>
        <div className="flex-1 overflow-x-auto overflow-y-hidden">
          <div ref={ref} onMouseMove={e=>{if(!drag)return;const dx=e.clientX-drag.startX;const newBar=Math.max(0,drag.origBar+Math.round(dx/BW));updSec(drag.trackId,drag.sectionId,{startBar:newBar})}} onMouseUp={()=>setDrag(null)} onMouseLeave={()=>setDrag(null)} style={{width:BARS*BW+'px',minWidth:'100%'}}>
            <div className="h-8 border-b border-white/8 flex items-end bg-slate-950/60">
              {bars.map(bar=><div key={bar} style={{width:BW}} className={clsx('shrink-0 h-full flex items-center justify-center border-r border-white/5',bar%4===1&&'border-white/15')}>{bar%4===1&&<span className="text-xs text-slate-600 font-mono">{bar}</span>}</div>)}
            </div>
            {tracks.map(track=><div key={track.id} className="relative h-12 border-b border-white/8 bg-slate-950/30">
              {bars.map(bar=><div key={bar} style={{left:(bar-1)*BW,width:BW}} className={clsx('absolute top-0 h-full border-r border-white/5',bar%4===1&&'border-white/10')}/>)}
              {track.sections.map(section=><div key={section.id} style={{left:section.startBar*BW,width:section.lengthBars*BW,backgroundColor:section.color+'99',borderColor:section.color}} className={clsx('absolute top-1 bottom-1 rounded border cursor-grab active:cursor-grabbing flex items-center px-2 select-none',sel?.sectionId===section.id&&'ring-2 ring-white/40')} onMouseDown={e=>{e.preventDefault();setDrag({sectionId:section.id,trackId:track.id,startX:e.clientX,origBar:section.startBar});setSel({trackId:track.id,sectionId:section.id})}}>
                <span className="text-xs text-white font-medium truncate">{section.label}</span>
              </div>)}
            </div>)}
            {tracks.length===0&&<div className="flex items-center justify-center h-32 text-slate-600 text-sm">Add a track to start mapping your arrangement</div>}
          </div>
        </div>
        {selData&&sel&&<div className="w-48 shrink-0 border-l border-white/8 bg-slate-900/60 p-3 space-y-3">
          <h5 className="text-xs font-semibold text-white">Section</h5>
          <div><label className="text-xs text-slate-500 block mb-1">Label</label><select value={selData.label} onChange={e=>updSec(sel.trackId,sel.sectionId,{label:e.target.value})} className="w-full bg-slate-800 border border-white/10 rounded px-2 py-1 text-xs text-white">{SECTION_LABELS.map(l=><option key={l} value={l}>{l}</option>)}</select></div>
          <div><label className="text-xs text-slate-500 block mb-1">Length (bars)</label><input type="number" value={selData.lengthBars} min={1} max={64} onChange={e=>updSec(sel.trackId,sel.sectionId,{lengthBars:Number(e.target.value)})} className="w-full bg-slate-800 border border-white/10 rounded px-2 py-1 text-xs text-white"/></div>
          <div><label className="text-xs text-slate-500 block mb-1">Start bar</label><input type="number" value={selData.startBar} min={0} onChange={e=>updSec(sel.trackId,sel.sectionId,{startBar:Number(e.target.value)})} className="w-full bg-slate-800 border border-white/10 rounded px-2 py-1 text-xs text-white"/></div>
          <button onClick={()=>{setTracks(tracks.map(t=>t.id===sel.trackId?{...t,sections:t.sections.filter(s=>s.id!==sel.sectionId)}:t));setSel(null)}} className="w-full px-3 py-1.5 text-sm bg-rose-600 text-white rounded-lg hover:bg-rose-700">Delete section</button>
        </div>}
      </div>
    </div>
  )
}
