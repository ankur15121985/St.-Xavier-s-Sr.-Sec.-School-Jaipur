import { createClient } from '@supabase/supabase-js';

const getStaticEnv = (): { url?: string; key?: string } => {
  let url = process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  let key = process.env.VITE_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!url || !key) {
    try {
      url = url || (import.meta as any).env?.VITE_SUPABASE_URL || (import.meta as any).env?.NEXT_PUBLIC_SUPABASE_URL;
      key = key || (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || (import.meta as any).env?.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    } catch {}
  }
  return { url, key };
};

const { url: envUrl, key: envKey } = getStaticEnv();
const SUPABASE_URL = envUrl;
const SUPABASE_ANON_KEY = envKey;

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
