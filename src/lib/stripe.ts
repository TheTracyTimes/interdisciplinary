import { loadStripe } from '@stripe/stripe-js'

const key = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY as string

if (!key) {
  console.warn('[Stripe] Missing VITE_STRIPE_PUBLISHABLE_KEY')
}

export const stripePromise = loadStripe(key ?? '')

export type StorageTier = 'free' | 'pro' | 'studio'

// Redirect to Stripe Checkout for a storage plan upgrade
export async function checkoutStorageTier(tier: 'pro' | 'studio', userId: string) {
  const res = await fetch('/api/stripe/checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tier, userId }),
  })
  const { url, error } = await res.json()
  if (error) throw new Error(error)
  window.location.href = url
}

// Redirect to Stripe Customer Portal to manage billing
export async function openBillingPortal(customerId: string) {
  const res = await fetch('/api/stripe/portal', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ customerId }),
  })
  const { url, error } = await res.json()
  if (error) throw new Error(error)
  window.location.href = url
}
