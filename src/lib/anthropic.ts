// All Anthropic calls go through /api/ai/generate to keep the API key server-side

export type AITask =
  | 'bio'
  | 'tagline'
  | 'color_palette'
  | 'script_suggest'
  | 'score_suggest'
  | 'invoice_description'
  | 'contract_draft'

interface GenerateOptions {
  task: AITask
  context: Record<string, string | string[]>
  maxTokens?: number
}

export async function generate({ task, context, maxTokens = 512 }: GenerateOptions): Promise<string> {
  const res = await fetch('/api/ai/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ task, context, maxTokens }),
  })
  if (!res.ok) {
    const { error } = await res.json().catch(() => ({ error: 'Unknown error' }))
    throw new Error(error ?? 'AI generation failed')
  }
  const { text } = await res.json()
  return text
}

// Convenience wrappers used in BrandPage
export function generateBio(profile: { name: string; specialties: string[]; location?: string; years?: number }) {
  return generate({
    task: 'bio',
    context: {
      name: profile.name,
      specialties: profile.specialties,
      location: profile.location ?? '',
      years: String(profile.years ?? ''),
    },
  })
}

export function generateTagline(profile: { name: string; specialties: string[] }) {
  return generate({
    task: 'tagline',
    context: { name: profile.name, specialties: profile.specialties },
    maxTokens: 128,
  })
}

export function generateColorPalette(profile: { name: string; specialties: string[]; vibe?: string }) {
  return generate({
    task: 'color_palette',
    context: { name: profile.name, specialties: profile.specialties, vibe: profile.vibe ?? '' },
    maxTokens: 256,
  })
}
