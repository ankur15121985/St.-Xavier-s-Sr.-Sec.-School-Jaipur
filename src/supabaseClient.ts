import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.warn("Supabase credentials missing! Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment.");
}

export const supabase = createClient(SUPABASE_URL || '', SUPABASE_ANON_KEY || '');

/**
 * Uploads a file to Supabase Storage and returns the public URL
 * @param file The file object from input change
 * @param folder The folder within the 'uploads' bucket (e.g., 'fees', 'notices')
 */
export async function uploadFile(file: File, folder: string = 'misc'): Promise<string> {
  const bucket = 'uploads'; // User confirmed this bucket exists
  
  // Sanitize filename to avoid issues with special characters while preserving original name
  const sanitizedName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, '_');
  const filePath = `${folder}/${sanitizedName}`;

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
