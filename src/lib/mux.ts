// Mux video upload and playback helpers

export interface MuxAsset {
  id: string
  playbackId: string
  status: 'preparing' | 'ready' | 'errored'
  duration?: number
}

// Request an upload URL from Mux via our API
export async function createMuxUpload(title: string): Promise<{ uploadUrl: string; assetId: string }> {
  const res = await fetch('/api/upload/mux', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title }),
  })
  if (!res.ok) throw new Error('Failed to create Mux upload')
  return res.json()
}

// Get playback URL for a Mux asset
export function getMuxPlaybackUrl(playbackId: string, type: 'hls' | 'dash' = 'hls') {
  if (type === 'hls') return `https://stream.mux.com/${playbackId}.m3u8`
  return `https://stream.mux.com/${playbackId}.mpd`
}

// Get thumbnail URL
export function getMuxThumbnailUrl(playbackId: string, time = 0) {
  return `https://image.mux.com/${playbackId}/thumbnail.jpg?time=${time}`
}

// Get animated GIF preview
export function getMuxGifUrl(playbackId: string) {
  return `https://image.mux.com/${playbackId}/animated.gif?width=320`
}
