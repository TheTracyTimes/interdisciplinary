import type { VercelRequest, VercelResponse } from '@vercel/node'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const from = process.env.RESEND_FROM_EMAIL ?? 'studio@interdisciplinary.app'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).end()

  const { to, clientName, contractTitle, producerName, signLink } = req.body

  try {
    await resend.emails.send({
      from,
      to,
      subject: `Contract ready to sign — ${contractTitle}`,
      html: `
        <div style="font-family:monospace;max-width:560px;margin:0 auto;color:#e2e8f0;background:#0a0a0b;padding:32px;border-radius:4px">
          <p style="color:#71717a;font-size:10px;letter-spacing:0.1em;text-transform:uppercase;margin:0 0 24px">Contract</p>
          <h1 style="font-size:18px;font-weight:600;color:#fff;margin:0 0 8px">${contractTitle}</h1>
          <p style="font-size:13px;color:#a1a1aa;margin:0 0 24px">From ${producerName}</p>

          <p style="font-size:13px;color:#a1a1aa;margin:0 0 24px">Hi ${clientName},<br>Please review and sign the contract below to get started.</p>

          <a href="${signLink}" style="display:inline-block;background:#48bb9a;color:#fff;padding:12px 24px;border-radius:4px;font-size:13px;font-weight:600;text-decoration:none">Review & sign →</a>

          <p style="font-size:11px;color:#3f3f46;margin:32px 0 0">Powered by DocuSeal · Interdisciplinary Studio OS</p>
        </div>
      `,
    })
    return res.status(200).json({ sent: true })
  } catch (err: any) {
    return res.status(500).json({ error: err.message })
  }
}
