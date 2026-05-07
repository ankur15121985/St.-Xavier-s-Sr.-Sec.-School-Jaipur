import { supabase } from '../supabaseClient';

export interface ParentObligation {
  id: string;
  title: string;
  heading: string;
  content: string;
  attachmentUrl?: string;
  order_index: number;
  is_enabled: boolean;
}

export const obligationService = {
  async getAll() {
    const { data, error } = await supabase
      .from('parent_obligations')
      .select('*')
      .order('order_index', { ascending: true });
    
    if (error) throw error;
    return data as ParentObligation[];
  },

  async update(id: string, updates: Partial<ParentObligation>) {
    const { data, error } = await supabase
      .from('parent_obligations')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as ParentObligation;
  },

  async create(obligation: Omit<ParentObligation, 'id'>) {
    const { data, error } = await supabase
      .from('parent_obligations')
      .insert([{ ...obligation, id: crypto.randomUUID() }])
      .select()
      .single();
    
    if (error) throw error;
    return data as ParentObligation;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('parent_obligations')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};
