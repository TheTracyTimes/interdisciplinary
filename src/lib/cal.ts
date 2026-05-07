const calUsername = import.meta.env.VITE_CAL_USERNAME as string

// Get the embed URL for a Cal.com event type
export function getCalEmbedUrl(eventSlug: string, options?: {
  name?: string
  email?: string
  notes?: string
}) {
  const base = `https://cal.com/${calUsername}/${eventSlug}`
  if (!options) return base
  const params = new URLSearchParams()
  if (options.name) params.set('name', options.name)
  if (options.email) params.set('email', options.email)
  if (options.notes) params.set('notes', options.notes)
  return `${base}?${params.toString()}`
}

// Inject Cal.com embed script (call once on mount)
export function initCalEmbed() {
  if (document.getElementById('cal-script')) return
  const script = document.createElement('script')
  script.id = 'cal-script'
  script.src = 'https://cal.com/embed.js'
  script.async = true
  document.head.appendChild(script)
}

// Open Cal.com modal for a given event
export function openCalModal(eventSlug: string) {
  const Cal = (window as any).Cal
  if (!Cal) {
    window.open(getCalEmbedUrl(eventSlug), '_blank')
    return
  }
  Cal('ui', { theme: 'dark', styles: { branding: { brandColor: '#6272f3' } } })
  Cal('openModal', { calLink: `${calUsername}/${eventSlug}` })
}
