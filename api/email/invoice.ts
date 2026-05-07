import type { VercelRequest, VercelResponse } from '@vercel/node'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const from = process.env.RESEND_FROM_EMAIL ?? 'studio@interdisciplinary.app'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).end()

  const { to, clientName, invoiceNumber, amount, dueDate, producerName, portalLink } = req.body

  try {
    await resend.emails.send({
      from,
      to,
      subject: `Invoice ${invoiceNumber} from ${producerName}`,
      html: `
        <div style="font-family:monospace;max-width:560px;margin:0 auto;color:#e2e8f0;background:#0a0a0b;padding:32px;border-radius:4px">
          <p style="color:#71717a;font-size:10px;letter-spacing:0.1em;text-transform:uppercase;margin:0 0 24px">Invoice</p>
          <h1 style="font-size:20px;font-weight:600;color:#fff;margin:0 0 8px">${invoiceNumber}</h1>
          <p style="font-size:13px;color:#a1a1aa;margin:0 0 24px">From ${producerName}</p>

          <div style="border:1px solid #1e1e21;border-radius:4px;padding:20px;margin-bottom:24px">
            <p style="margin:0 0 8px;font-size:12px;color:#71717a">Amount due</p>
            <p style="margin:0;font-size:28px;font-weight:700;color:#f59e0b;font-family:monospace">$${Number(amount).toLocaleString()}</p>
            <p style="margin:8px 0 0;font-size:11px;color:#52525b">Due ${dueDate}</p>
          </div>

          <p style="font-size:13px;color:#a1a1aa;margin:0 0 24px">Hi ${clientName},<br>Please find your invoice attached. Payment is due by ${dueDate}.</p>

          ${portalLink ? `<a href="${portalLink}" style="display:inline-block;background:#6272f3;color:#fff;padding:10px 20px;border-radius:4px;font-size:12px;font-weight:600;text-decoration:none">View project portal →</a>` : ''}

          <p style="font-size:10px;color:#3f3f46;margin:32px 0 0">Interdisciplinary · Studio OS</p>
        </div>
      `,
    })
    return res.status(200).json({ sent: true })
  } catch (err: any) {
    return res.status(500).json({ error: err.message })
  }
}
