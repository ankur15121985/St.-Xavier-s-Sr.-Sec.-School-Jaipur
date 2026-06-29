import { createClient } from '@supabase/supabase-js';

const cleanSupabaseUrl = (url?: string): string => {
  if (!url) return '';
  const trimmed = url.trim();
  try {
    const urlObj = new URL(trimmed);
    return `${urlObj.protocol}//${urlObj.host}`;
  } catch (e) {
    return trimmed
      .replace(/\/rest\/v1\/?$/, '') 
      .replace(/\/$/, '');
  }
};

const getStaticEnv = (): { url?: string; key?: string } => {
  let url = process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  let key = process.env.VITE_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_KEY;
  
  if (!url || !key) {
    try {
      url = url || (import.meta as any).env?.VITE_SUPABASE_URL || (import.meta as any).env?.NEXT_PUBLIC_SUPABASE_URL || (import.meta as any).env?.SUPABASE_URL;
      key = key || (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || (import.meta as any).env?.NEXT_PUBLIC_SUPABASE_ANON_KEY || (import.meta as any).env?.SUPABASE_ANON_KEY || (import.meta as any).env?.SUPABASE_KEY;
    } catch {}
  }
  return { url: cleanSupabaseUrl(url), key };
};

const { url: envUrl, key: envKey } = getStaticEnv();
let SUPABASE_URL = envUrl;
let SUPABASE_ANON_KEY = envKey;

const isValidUrl = (url: string): boolean => {
  try {
    return Boolean(url && new URL(url));
  } catch {
    return false;
  }
};

let safeUrl = isValidUrl(SUPABASE_URL || '') ? (SUPABASE_URL as string) : 'https://placeholder-project-id.supabase.co';
let safeKey = SUPABASE_ANON_KEY || 'placeholder-anon-key';

if (!SUPABASE_URL || !SUPABASE_ANON_KEY || !isValidUrl(SUPABASE_URL)) {
  console.warn(
    "Supabase credentials missing or invalid! Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment " +
    "to enable live cloud sync. Using a placeholder client to prevent script crash."
  );
}

export let isSupabasePlaceholder = !SUPABASE_URL || !SUPABASE_ANON_KEY || !isValidUrl(SUPABASE_URL) || SUPABASE_URL.includes('placeholder-project-id') || safeUrl.includes('placeholder-project-id');

let activeClient = createClient(safeUrl, safeKey);

export function initializeSupabase(url: string, key: string) {
  const cleanedUrl = cleanSupabaseUrl(url);
  if (cleanedUrl && key && !cleanedUrl.includes('placeholder-project-id') && isValidUrl(cleanedUrl)) {
    activeClient = createClient(cleanedUrl, key);
    isSupabasePlaceholder = false;
    SUPABASE_URL = cleanedUrl;
    SUPABASE_ANON_KEY = key;
    safeUrl = cleanedUrl;
    safeKey = key;
    console.log('[Supabase Client] Dynamically initialized with public credentials (cleaned URL).');
  }
}

export function getIsSupabasePlaceholder(): boolean {
  return isSupabasePlaceholder;
}

export const supabase = new Proxy({} as any, {
  get(target, prop, receiver) {
    return Reflect.get(activeClient, prop, receiver);
  }
});

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
      cacheControl: 'public, max-age=31536000, immutable',
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
