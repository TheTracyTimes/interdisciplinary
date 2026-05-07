import type { VercelRequest, VercelResponse } from '@vercel/node'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-06-20' })

const PRICES: Record<string, string> = {
  pro:    process.env.STRIPE_PRICE_PRO_MONTHLY!,
  studio: process.env.STRIPE_PRICE_STUDIO_MONTHLY!,
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { tier, userId, email } = req.body as { tier: 'pro' | 'studio'; userId: string; email?: string }

  if (!PRICES[tier]) return res.status(400).json({ error: 'Invalid tier' })

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: PRICES[tier], quantity: 1 }],
      metadata: { userId, tier },
      customer_email: email,
      success_url: `${process.env.VITE_APP_URL}/app/storage?upgraded=true`,
      cancel_url: `${process.env.VITE_APP_URL}/app/storage`,
      subscription_data: { metadata: { userId, tier } },
    })

    return res.status(200).json({ url: session.url })
  } catch (err: any) {
    return res.status(500).json({ error: err.message })
  }
}
