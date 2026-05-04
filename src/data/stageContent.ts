import type { Stage, ProjectType } from '../types'

interface StageLesson {
  title: string
  body: string
  checklist: string[]
  proTip: string
  filmNote?: string
  musicNote?: string
}

const CONTENT: Record<Stage, StageLesson> = {
  conception: {
    title: 'Start With Why, Then What',
    body: `Before you open any software, answer four questions on paper: Why does this project need to exist? Who is the intended audience, specifically? What emotion should they leave with? And what makes you the right person to make it?

Skipping these questions is the single biggest reason independent projects stall or feel hollow. The answers become your north star when hard decisions arise in every stage that follows.`,
    checklist: [
      'Write a one-sentence logline (film) or concept statement (music)',
      'Define your target audience — be specific (not "everyone")',
      'Identify the core emotion or message',
      'Research 3 comparable works and what made them succeed or fail',
      'Set a realistic scope — solo project, small team, or full crew?',
      'Define a rough timeline with hard deadlines',
    ],
    proTip:
      'The logline test: if you can\'t explain your project in one sentence without "and then," it\'s not focused enough yet.',
    filmNote:
      'For film: write a one-page treatment before touching your script. It forces clarity on structure before dialogue.',
    musicNote:
      'For music: define the mood board and reference tracks before arranging. Argue over feel now, not in the studio.',
  },
  'pre-production': {
    title: 'Build the Blueprint',
    body: `Pre-production is the most underinvested stage for independents. The professionals who consistently ship great work spend disproportionate time here. A thorough script, a complete storyboard, and a locked arrangement demo dramatically reduce costly surprises.

Use every tool in this platform during this stage. Write your script, board your scenes, map your arrangement, and sketch your score. When you enter production, decisions should already be made.`,
    checklist: [
      'Complete a full script or song arrangement demo',
      'Storyboard every scene or map every song section',
      'Cast, crew, or collaborate — confirm all collaborators in writing',
      'Location scout or studio book — secure your spaces',
      'Build a production schedule with buffer days',
      'Create a gear/equipment list and confirm availability',
      'Set your budget with a 20% contingency buffer',
    ],
    proTip:
      'Every scene you don\'t storyboard costs you at least 30 minutes on the day. Every song section you don\'t demo costs you a studio hour.',
    filmNote:
      'For film: a shot list is not optional. Even handheld, verite-style work benefits from knowing the minimum coverage required.',
    musicNote:
      'For music: lock your BPM, key, and structure before tracking. Tempo changes after the fact are expensive.',
  },
  production: {
    title: 'Execute, Don\'t Improvise',
    body: `Production is where the plan meets reality. Your job is to execute the pre-production blueprint while staying adaptive. Protect the schedule, protect the budget, and protect the energy of your team.

The biggest production mistake independents make is turning production into additional pre-production — making creative decisions that should have been made earlier. If you find yourself doing this, pause and diagnose why the prep was insufficient.`,
    checklist: [
      'Brief the team on each day\'s priorities before you start',
      'Track footage/takes in real time — don\'t rely on memory',
      'Record scratch audio or demos even if you\'re re-recording later',
      'Log all locations, equipment, and permissions as you use them',
      'Back up all recorded material at end of each session',
      'Flag problem takes or scenes immediately — don\'t leave it for post',
      'Stick to your schedule — overtime destroys morale and budget',
    ],
    proTip:
      'The \'one more take\' trap: after take 4, you\'re chasing perfection that doesn\'t exist on set. Move on and fix it in post or reshoot if truly needed.',
    filmNote:
      'For film: always get coverage first (wide, medium, close). Coverage saves you in the edit when a performance isn\'t working.',
    musicNote:
      'For music: capture a complete performance guide track before comping. You can always cut a better take; you can\'t recreate a great feel.',
  },
  'post-production': {
    title: 'The Art of Restraint',
    body: `Post-production is where patience becomes a skill. The temptation is to add — more effects, more edits, more layers. The discipline is to subtract until only the essential remains.

For film: assemble first, then fine cut, then lock picture before touching audio. For music: get the arrangement right before mixing, and mix before mastering. Sequence matters enormously.`,
    checklist: [
      'Organize all assets before opening your editor or DAW',
      'Create a rough cut/rough mix first — resist polishing too early',
      'Get feedback on the rough from trusted collaborators',
      'Lock picture (film) or arrangement (music) before finalizing audio',
      'Color grade or master only after content is locked',
      'Create distribution-ready exports in required formats',
      'Document all versions and maintain a clear file hierarchy',
    ],
    proTip:
      'Listen to your mix or watch your cut at least once at very low volume. Problems you couldn\'t hear loud become obvious at quiet.',
    filmNote:
      'For film: don\'t color grade until picture is locked. Color timing a cut that changes is a waste of time you can\'t recover.',
    musicNote:
      'For music: mix in mono occasionally. If it sounds good in mono, it will sound great in stereo. The reverse is rarely true.',
  },
  funding: {
    title: 'The Pitch Is a Creative Act',
    body: `Funding is not begging — it\'s proposing a partnership. Every funder (grant committee, crowd, brand, investor) is asking one question: why should I bet on this? Your job is to answer that with clarity, evidence, and specificity.

Independent creatives consistently underfund themselves by underestimating their value and overpromising their timeline. Price your work based on what completion actually costs, not what you think the market will accept.`,
    checklist: [
      'Map all viable funding sources for your project type and size',
      'Research grant deadlines — most have 6–12 month lead times',
      'Build a Crowdfunding campaign only if you have an existing audience',
      'Prepare a pitch deck (film) or EPK — Electronic Press Kit (music)',
      'Identify sync licensing opportunities for music projects',
      'Calculate the true cost of completion with no volunteer labor',
      'Set a fundraising goal that covers costs, not just a portion',
    ],
    proTip:
      'Crowdfunding without an audience is just public embarrassment. Build the audience first, even if it\'s 200 genuine fans.',
    filmNote:
      'For film: research state film offices — many have micro-grants and production incentives that most independents ignore.',
    musicNote:
      'For music: sync licensing (film/TV/ad placement) often pays more per track than years of streaming. Pursue it actively.',
  },
  distribution: {
    title: 'A Release Is Not a Launch',
    body: `Uploading your work to a platform is a release. A launch is a campaign — with timing, press, audience preparation, and follow-through. Most independent projects are released; almost none are launched. That difference determines reach.

Distribution strategy should be decided in pre-production, not after post. Knowing your target platforms shapes your technical deliverables, your metadata, and your promotional timeline.`,
    checklist: [
      'Choose your primary distribution platform(s) based on your audience',
      'Prepare platform-specific technical specs for all exports',
      'Register your work with relevant rights organizations',
      'Build a press kit and 3–5 personalized press pitches',
      'Set a release date at least 6 weeks out and work backward',
      'Line up at least 3 promotional "beats" across the release window',
      'Plan for what happens the week after release — don\'t go silent',
    ],
    proTip:
      'The day-of release is the worst day to post about your project. Build 2–3 weeks of audience awareness before you drop, then release into momentum.',
    filmNote:
      'For film: consider festival strategy before wide release. A festival run builds press and legitimacy that money can\'t buy.',
    musicNote:
      'For music: playlist pitching (Spotify editorial) requires submission at least 7 days before release date via Spotify for Artists.',
  },
}

export function getStageContent(stage: Stage, _type?: ProjectType): StageLesson {
  return CONTENT[stage]
}
