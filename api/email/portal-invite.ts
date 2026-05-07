import type { VercelRequest, VercelResponse } from '@vercel/node'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const from = process.env.RESEND_FROM_EMAIL ?? 'studio@interdisciplinary.app'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).end()

  const { to, clientName, projectTitle, producerName, portalLink } = req.body

  try {
    await resend.emails.send({
      from,
      to,
      subject: `Your project portal is ready — ${projectTitle}`,
      html: `
        <div style="font-family:monospace;max-width:560px;margin:0 auto;color:#e2e8f0;background:#0a0a0b;padding:32px;border-radius:4px">
          <p style="color:#71717a;font-size:10px;letter-spacing:0.1em;text-transform:uppercase;margin:0 0 24px">Client Portal</p>
          <h1 style="font-size:18px;font-weight:600;color:#fff;margin:0 0 8px">${projectTitle}</h1>
          <p style="font-size:13px;color:#a1a1aa;margin:0 0 24px">With ${producerName}</p>

          <p style="font-size:13px;color:#a1a1aa;margin:0 0 24px">Hi ${clientName},<br>${producerName} has set up a private project portal where you can follow progress, review deliverables, and communicate directly.</p>

          <a href="${portalLink}" style="display:inline-block;background:#6272f3;color:#fff;padding:12px 24px;border-radius:4px;font-size:13px;font-weight:600;text-decoration:none">Open your portal →</a>

          <p style="font-size:11px;color:#3f3f46;margin:32px 0 0">No account required. This link is private — don't share it.</p>
        </div>
      `,
    })
    return res.status(200).json({ sent: true })
  } catch (err: any) {
    return res.status(500).json({ error: err.message })
  }
}
