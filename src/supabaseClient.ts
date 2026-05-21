import { createClient } from '@supabase/supabase-js';

const getEnv = (key: string): string | undefined => {
  if (typeof process !== 'undefined' && process.env && process.env[key]) {
    return process.env[key];
  }
  try {
    return (import.meta as any).env?.[key];
  } catch {
    return undefined;
  }
};

const SUPABASE_URL = getEnv('VITE_SUPABASE_URL') || getEnv('NEXT_PUBLIC_SUPABASE_URL');
const SUPABASE_ANON_KEY = getEnv('VITE_SUPABASE_ANON_KEY') || getEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY');

const isValidUrl = (url: string): boolean => {
  try {
    return Boolean(url && new URL(url));
  } catch {
    return false;
  }
};

const safeUrl = isValidUrl(SUPABASE_URL || '') ? (SUPABASE_URL as string) : 'https://placeholder-project-id.supabase.co';
const safeKey = SUPABASE_ANON_KEY || 'placeholder-anon-key';

if (!SUPABASE_URL || !SUPABASE_ANON_KEY || !isValidUrl(SUPABASE_URL)) {
  console.warn(
    "Supabase credentials missing or invalid! Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment " +
    "to enable live cloud sync. Using a placeholder client to prevent script crash."
  );
}

export const supabase = createClient(safeUrl, safeKey);

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
