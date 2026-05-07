import type { VercelRequest, VercelResponse } from '@vercel/node'
import Mux from '@mux/mux-node'

const mux = new Mux({
  tokenId: process.env.MUX_TOKEN_ID!,
  tokenSecret: process.env.MUX_TOKEN_SECRET!,
})

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).end()

  const { title } = req.body

  try {
    const upload = await mux.video.uploads.create({
      cors_origin: process.env.VITE_APP_URL ?? '*',
      new_asset_settings: {
        playback_policy: ['public'],
        meta: { title },
      },
    })

    return res.status(200).json({
      uploadUrl: upload.url,
      assetId: upload.id,
    })
  } catch (err: any) {
    return res.status(500).json({ error: err.message })
  }
}
