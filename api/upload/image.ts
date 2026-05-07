import type { VercelRequest, VercelResponse } from '@vercel/node'

const accountId = process.env.CLOUDFLARE_ACCOUNT_ID!
const token = process.env.CLOUDFLARE_IMAGES_TOKEN!

export const config = { api: { bodyParser: false } }

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'POST') {
    // Forward multipart form to Cloudflare Images
    try {
      const cfRes = await fetch(
        `https://api.cloudflare.com/client/v4/accounts/${accountId}/images/v1`,
        {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          // @ts-ignore — pass raw body through
          body: req,
          duplex: 'half',
        } as any,
      )
      const data = await cfRes.json()
      if (!data.success) return res.status(400).json({ error: data.errors })

      const image = data.result
      return res.status(200).json({
        id: image.id,
        url: image.variants[0],
      })
    } catch (err: any) {
      return res.status(500).json({ error: err.message })
    }
  }

  if (req.method === 'DELETE') {
    const { imageId } = req.body
    await fetch(`https://api.cloudflare.com/client/v4/accounts/${accountId}/images/v1/${imageId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    })
    return res.status(200).json({ deleted: true })
  }

  return res.status(405).end()
}
