import type { VercelRequest, VercelResponse } from '@vercel/node'
import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const PROMPTS: Record<string, (ctx: Record<string, any>) => string> = {
  bio: ctx => `Write a professional bio for a creative producer named ${ctx.name}.
Specialties: ${Array.isArray(ctx.specialties) ? ctx.specialties.join(', ') : ctx.specialties}.
${ctx.location ? `Location: ${ctx.location}.` : ''}
${ctx.years ? `${ctx.years} years of experience.` : ''}
Write 2-3 sentences. First person. No filler phrases like "passionate" or "dedicated". Be specific and direct.`,

  tagline: ctx => `Write a short tagline (under 10 words) for a creative producer named ${ctx.name} who specializes in ${Array.isArray(ctx.specialties) ? ctx.specialties.join(' and ') : ctx.specialties}. No clichés. No quotes needed in output.`,

  color_palette: ctx => `Suggest a 3-color brand palette (hex codes) for a creative producer named ${ctx.name} specializing in ${Array.isArray(ctx.specialties) ? ctx.specialties.join(', ') : ctx.specialties}${ctx.vibe ? `, vibe: ${ctx.vibe}` : ''}. Return JSON: {"primary":"#hex","secondary":"#hex","accent":"#hex","rationale":"one sentence"}`,

  script_suggest: ctx => `The screenplay scene is: ${ctx.scene}. Suggest one line of dialogue for the character ${ctx.character}. Match the tone: ${ctx.tone ?? 'dramatic'}. Return only the dialogue line, no attribution.`,

  score_suggest: ctx => `Suggest a chord progression for a film score cue. Emotion: ${ctx.emotion}. Tempo: ${ctx.tempo ?? 'medium'}. Key: ${ctx.key ?? 'C major'}. Return 4 chords as Roman numerals and a one-sentence description.`,

  invoice_description: ctx => `Write a professional invoice line item description for: ${ctx.service}. Client: ${ctx.client}. Project: ${ctx.project}. Keep it under 15 words.`,

  contract_draft: ctx => `Draft a short professional services clause for a ${ctx.serviceType} contract. Producer: ${ctx.producer}. Client: ${ctx.client}. Deliverable: ${ctx.deliverable}. Duration: ${ctx.duration}. 3-4 sentences, plain English, no legalese.`,
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { task, context, maxTokens = 512 } = req.body as {
    task: string
    context: Record<string, any>
    maxTokens?: number
  }

  const promptFn = PROMPTS[task]
  if (!promptFn) return res.status(400).json({ error: `Unknown task: ${task}` })

  try {
    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: maxTokens,
      messages: [{ role: 'user', content: promptFn(context) }],
    })

    const text = message.content.find(b => b.type === 'text')?.text ?? ''
    return res.status(200).json({ text })
  } catch (err: any) {
    return res.status(500).json({ error: err.message })
  }
}
