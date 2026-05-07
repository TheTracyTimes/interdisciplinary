import type { VercelRequest, VercelResponse } from '@vercel/node'

const DOCUSEAL_API = 'https://api.docuseal.com'
const apiKey = process.env.DOCUSEAL_API_KEY!

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'POST') {
    // Create a DocuSeal submission from a template
    const { templateId, signerEmail, signerName, fields } = req.body

    try {
      const response = await fetch(`${DOCUSEAL_API}/submissions`, {
        method: 'POST',
        headers: {
          'X-Auth-Token': apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          template_id: templateId,
          send_email: false,
          submitters: [{
            role: 'Client',
            email: signerEmail,
            name: signerName,
            fields: fields ?? [],
          }],
        }),
      })

      const data = await response.json()
      if (!response.ok) return res.status(response.status).json({ error: data })

      // Return the signing URL for the client
      const signingUrl = data.submitters?.[0]?.embed_src
      return res.status(200).json({ submissionId: data.id, signingUrl })
    } catch (err: any) {
      return res.status(500).json({ error: err.message })
    }
  }

  if (req.method === 'GET') {
    // Check submission status
    const { submissionId } = req.query
    const response = await fetch(`${DOCUSEAL_API}/submissions/${submissionId}`, {
      headers: { 'X-Auth-Token': apiKey },
    })
    const data = await response.json()
    return res.status(200).json(data)
  }

  return res.status(405).end()
}
