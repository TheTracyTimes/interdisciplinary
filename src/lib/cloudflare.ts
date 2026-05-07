const accountHash = import.meta.env.VITE_CLOUDFLARE_IMAGES_ACCOUNT_HASH as string

// Build a Cloudflare Images delivery URL with optional variant
export function cfImageUrl(imageId: string, variant: 'public' | 'thumbnail' | 'avatar' = 'public') {
  if (!accountHash || !imageId) return ''
  return `https://imagedelivery.net/${accountHash}/${imageId}/${variant}`
}

// Upload an image via our API (server holds the Cloudflare token)
export async function uploadImage(file: File, folder = 'general'): Promise<{ id: string; url: string }> {
  const form = new FormData()
  form.append('file', file)
  form.append('folder', folder)

  const res = await fetch('/api/upload/image', { method: 'POST', body: form })
  if (!res.ok) throw new Error('Image upload failed')
  return res.json()
}

// Delete an image
export async function deleteImage(imageId: string) {
  await fetch('/api/upload/image', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ imageId }),
  })
}
