import { uploadFile } from '../supabaseClient';

export const storageService = {
  async uploadFile(file: File, folder: string = 'uploads'): Promise<string> {
    try {
      // Use the helper from supabaseClient
      const publicUrl = await uploadFile(file, folder);
      return publicUrl;
    } catch (error) {
      console.error('Supabase Storage Error:', error);
      throw error;
    }
  }
};
