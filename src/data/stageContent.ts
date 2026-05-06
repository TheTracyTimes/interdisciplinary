import type { Stage } from '../types'
type ProjectType = 'film' | 'music' | 'both'
interface StageLesson { title:string; body:string; checklist:string[]; proTip:string; filmNote?:string; musicNote?:string }
const CONTENT: Record<Stage,StageLesson> = {
  conception: {
    title:'Start With Why, Then What',
    body:'Before you open any software, answer four questions: Why does this project need to exist? Who is the intended audience, specifically? What emotion should they leave with? What makes you the right person to make it?\n\nSkipping these questions is the single biggest reason independent projects stall or feel hollow.',
    checklist:['Write a one-sentence logline (film) or concept statement (music)','Define your target audience — be specific (not "everyone")','Identify the core emotion or message','Research 3 comparable works and what made them succeed or fail','Set a realistic scope — solo project, small team, or full crew?','Define a rough timeline with hard deadlines'],
    proTip:'The logline test: if you cannot explain your project in one sentence without "and then," it is not focused enough yet.',
    filmNote:'Write a one-page treatment before touching your script. It forces clarity on structure before dialogue.',
    musicNote:'Define the mood board and reference tracks before arranging. Argue over feel now, not in the studio.',
  },
  'pre-production': {
    title:'Build the Blueprint',
    body:'Pre-production is the most underinvested stage for independents. A thorough script, a complete storyboard, and a locked arrangement demo dramatically reduce costly surprises.\n\nUse every tool in this platform during this stage. When you enter production, decisions should already be made.',
    checklist:['Complete a full script or song arrangement demo','Storyboard every scene or map every song section','Cast, crew, or collaborate — confirm all collaborators in writing','Location scout or studio book — secure your spaces','Build a production schedule with buffer days','Create a gear/equipment list and confirm availability','Set your budget with a 20% contingency buffer'],
    proTip:'Every scene you do not storyboard costs you at least 30 minutes on the day. Every song section you do not demo costs you a studio hour.',
    filmNote:'A shot list is not optional. Even handheld work benefits from knowing the minimum coverage required.',
    musicNote:'Lock your BPM, key, and structure before tracking. Tempo changes after the fact are expensive.',
  },
  production: {
    title:'Execute, Do Not Improvise',
    body:'Production is where the plan meets reality. Protect the schedule, protect the budget, and protect the energy of your team.\n\nThe biggest mistake independents make is turning production into additional pre-production — making creative decisions that should have been made earlier.',
    checklist:['Brief the team on each day\'s priorities before you start','Track footage/takes in real time — do not rely on memory','Record scratch audio or demos even if you are re-recording later','Log all locations, equipment, and permissions as you use them','Back up all recorded material at end of each session','Flag problem takes immediately — do not leave it for post','Stick to your schedule — overtime destroys morale and budget'],
    proTip:'After take 4, you are chasing perfection that does not exist on set. Move on.',
    filmNote:'Always get coverage first (wide, medium, close). Coverage saves you in the edit.',
    musicNote:'Capture a complete performance guide track before comping.',
  },
  'post-production': {
    title:'The Art of Restraint',
    body:'Post-production is where patience becomes a skill. The temptation is to add — more effects, more edits, more layers. The discipline is to subtract until only the essential remains.\n\nFor film: assemble first, fine cut, then lock picture before audio. For music: arrangement before mixing, mix before mastering.',
    checklist:['Organize all assets before opening your editor or DAW','Create a rough cut/rough mix first — resist polishing too early','Get feedback on the rough from trusted collaborators','Lock picture (film) or arrangement (music) before finalizing audio','Color grade or master only after content is locked','Create distribution-ready exports in required formats','Document all versions and maintain a clear file hierarchy'],
    proTip:'Listen to your mix at very low volume. Problems you could not hear loud become obvious at quiet.',
    filmNote:'Do not color grade until picture is locked.',
    musicNote:'Mix in mono occasionally. If it sounds good in mono, it will sound great in stereo.',
  },
  funding: {
    title:'The Pitch Is a Creative Act',
    body:'Funding is not begging — it is proposing a partnership. Every funder is asking one question: why should I bet on this? Your job is to answer with clarity, evidence, and specificity.\n\nIndependent creatives consistently underfund themselves by underestimating their value.',
    checklist:['Map all viable funding sources for your project type and size','Research grant deadlines — most have 6-12 month lead times','Build a crowdfunding campaign only if you have an existing audience','Prepare a pitch deck (film) or EPK (music)','Identify sync licensing opportunities for music projects','Calculate the true cost of completion with no volunteer labor','Set a fundraising goal that covers costs, not just a portion'],
    proTip:'Crowdfunding without an audience is just public embarrassment. Build the audience first.',
    filmNote:'Research state film offices — many have micro-grants most independents ignore.',
    musicNote:'Sync licensing often pays more per track than years of streaming. Pursue it actively.',
  },
  distribution: {
    title:'A Release Is Not a Launch',
    body:'Uploading your work is a release. A launch is a campaign — with timing, press, audience preparation, and follow-through. Most independent projects are released; almost none are launched.\n\nDistribution strategy should be decided in pre-production, not after post.',
    checklist:['Choose your primary distribution platforms based on your audience','Prepare platform-specific technical specs for all exports','Register your work with relevant rights organizations','Build a press kit and 3-5 personalized press pitches','Set a release date at least 6 weeks out and work backward','Line up at least 3 promotional beats across the release window','Plan for what happens the week after release — do not go silent'],
    proTip:'The day-of release is the worst day to post about your project. Build audience awareness 2-3 weeks before.',
    filmNote:'Consider festival strategy before wide release. A festival run builds legitimacy money cannot buy.',
    musicNote:'Spotify editorial playlist pitching requires submission at least 7 days before release date.',
  },
}
export function getStageContent(stage:Stage,_type?:ProjectType):StageLesson { return CONTENT[stage] }
