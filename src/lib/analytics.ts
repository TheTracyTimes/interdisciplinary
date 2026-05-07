import posthog from 'posthog-js'

const key = import.meta.env.VITE_POSTHOG_KEY as string
const host = import.meta.env.VITE_POSTHOG_HOST as string

export function initAnalytics() {
  if (!key) return
  posthog.init(key, {
    api_host: host ?? 'https://app.posthog.com',
    capture_pageview: true,
    capture_pageleave: true,
    autocapture: false,
  })
}

export function identify(userId: string, traits?: Record<string, unknown>) {
  if (!key) return
  posthog.identify(userId, traits)
}

export function track(event: string, properties?: Record<string, unknown>) {
  if (!key) return
  posthog.capture(event, properties)
}

export function resetAnalytics() {
  if (!key) return
  posthog.reset()
}

// Typed events used throughout the app
export const Events = {
  PROJECT_CREATED:        'project_created',
  PROJECT_COMPLETED:      'project_completed',
  SCRIPT_EXPORTED:        'script_exported',
  SCORE_EXPORTED:         'score_exported',
  INVOICE_SENT:           'invoice_sent',
  INVOICE_PAID:           'invoice_paid',
  CONTRACT_SIGNED:        'contract_signed',
  CLIENT_PORTAL_OPENED:   'client_portal_opened',
  STORAGE_UPGRADED:       'storage_upgraded',
  PROFILE_PUBLISHED:      'profile_published',
  RESELL_LISTED:          'resell_listed',
  ARCHIVE_PUBLISHED:      'archive_published',
  AI_GENERATED:           'ai_generated',
} as const
