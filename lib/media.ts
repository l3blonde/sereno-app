// lib/media.ts
import { supabase } from './supabase'

export function getMediaUrl(bucket: string, path: string): string {
    const { data } = supabase.storage.from(bucket).getPublicUrl(path)
    return data.publicUrl
}