import { supabase } from './supabase'

export type StorageBucket = 'scripts' | 'scores' | 'storyboards' | 'deliverables' | 'portfolio' | 'avatars'

export interface UploadResult {
  path: string
  url: string
  size: number
}

// Upload a file to the appropriate bucket
export async function uploadFile(
  bucket: StorageBucket,
  userId: string,
  file: File,
  folder?: string,
): Promise<UploadResult> {
  const ext = file.name.split('.').pop()
  const path = [userId, folder, `${Date.now()}.${ext}`].filter(Boolean).join('/')

  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    cacheControl: '3600',
    upsert: false,
  })
  if (error) throw error

  const { data } = supabase.storage.from(bucket).getPublicUrl(path)
  return { path, url: data.publicUrl, size: file.size }
}

// Delete a file
export async function deleteFile(bucket: StorageBucket, path: string) {
  const { error } = await supabase.storage.from(bucket).remove([path])
  if (error) throw error
}

// Get a signed URL for private files (deliverables, contracts)
export async function getSignedUrl(bucket: StorageBucket, path: string, expiresIn = 3600) {
  const { data, error } = await supabase.storage.from(bucket).createSignedUrl(path, expiresIn)
  if (error) throw error
  return data.signedUrl
}

// List all files for a user in a bucket
export async function listFiles(bucket: StorageBucket, userId: string, folder?: string) {
  const prefix = folder ? `${userId}/${folder}` : userId
  const { data, error } = await supabase.storage.from(bucket).list(prefix, {
    sortBy: { column: 'created_at', order: 'desc' },
  })
  if (error) throw error
  return data ?? []
}

// Calculate total storage used across all buckets (bytes)
export async function getTotalStorageUsed(userId: string): Promise<number> {
  const buckets: StorageBucket[] = ['scripts', 'scores', 'storyboards', 'deliverables', 'portfolio', 'avatars']
  let total = 0
  for (const bucket of buckets) {
    const files = await listFiles(bucket, userId)
    total += files.reduce((sum, f) => sum + (f.metadata?.size ?? 0), 0)
  }
  return total
}
