import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://bfqyrnvyhivflapjwllk.supabase.co"
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJmcXlybnZ5aGl2ZmxhcGp3bGxrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc0Mjg4NzEsImV4cCI6MjA5MzAwNDg3MX0.fCbIjOk8isAv5d2QJVPxVH4IV-_LnAglguU1Z9D-3qU"

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * Uploads a file to Supabase Storage and returns the public URL
 * @param file The file object from input change
 * @param folder The folder within the 'uploads' bucket (e.g., 'fees', 'notices')
 */
export async function uploadFile(file: File, folder: string = 'misc'): Promise<string> {
  const bucket = 'uploads'; // User confirmed this bucket exists
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
  const filePath = `${folder}/${fileName}`;

  console.log(`[Supabase Storage] Attempting upload of ${file.name} to bucket: ${bucket}, path: ${filePath}`);
  
  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: true
    });

  if (uploadError) {
    throw uploadError;
  }

  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(filePath);

  return data.publicUrl;
}
