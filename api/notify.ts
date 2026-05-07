import type { VercelRequest, VercelResponse } from '@vercel/node'

const appId = process.env.VITE_ONESIGNAL_APP_ID!
const apiKey = process.env.ONESIGNAL_API_KEY!

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).end()

  const { userId, title, body, url } = req.body

  try {
    const response = await fetch('https://onesignal.com/api/v1/notifications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${apiKey}`,
      },
      body: JSON.stringify({
        app_id: appId,
        filters: [{ field: 'tag', key: 'userId', relation: '=', value: userId }],
        headings: { en: title },
        contents: { en: body },
        url,
      }),
    })
    const data = await response.json()
    return res.status(200).json(data)
  } catch (err: any) {
    return res.status(500).json({ error: err.message })
  }
}
