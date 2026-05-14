import { supabase } from '../supabaseClient';

export interface EducationQualification {
  examination: string;
  percentage: string;
  year: string;
  institution: string;
  subjects: string;
}

export interface TeachingExperience {
  fromYear: string;
  toYear: string;
  institution: string;
  subjects: string;
  classes: string;
}

export interface Achievement {
  year: string;
  field: string;
  description: string;
}

export interface CareerApplication {
  id?: string;
  application_no?: string;
  category: string;
  full_name: string;
  parent_spouse_name: string;
  mobile_number: string;
  email: string;
  gender: string;
  dob: string;
  aadhar_number: string;
  address: string;
  photo_url?: string;
  user_ip?: string;
  declaration_accepted: boolean;
  major_subject: string;
  minor_subject_1: string;
  minor_subject_2: string;
  salary_expected: string;
  tet_details: string;
  interests: string;
  responsibilities_handled: string;
  statement_of_purpose: string;
  other_experience: string;
  education_qualifications: EducationQualification[];
  teaching_experience: TeachingExperience[];
  achievements: Achievement[];
  created_at?: string;
  status?: string;
}

export const careerService = {
  async submitApplication(application: CareerApplication) {
    const { data, error } = await supabase
      .from('career_applications')
      .insert([application])
      .select();
    
    if (error) throw error;
    return data;
  },

  async getAllApplications() {
    const { data, error } = await supabase
      .from('career_applications')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as CareerApplication[];
  },

  async updateApplicationStatus(id: string, status: string) {
    const { data, error } = await supabase
      .from('career_applications')
      .update({ status })
      .eq('id', id);
    
    if (error) throw error;
    return data;
  }
};
