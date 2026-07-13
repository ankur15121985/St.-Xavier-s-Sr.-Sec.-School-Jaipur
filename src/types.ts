export interface Notice { id: string; title: string; content?: string; date: string; category: string; link?: string; attachmentUrl?: string; is_enabled?: boolean; }
export interface StaffMember { id: string; name: string; role: string; bio: string; image: string; type: 'Management' | 'Faculty' | 'Administration'; is_enabled?: boolean; }
export interface GalleryItem { id: string; url: string; caption: string; session?: string; attachmentUrl?: string; is_enabled?: boolean; }
export interface FeeStructure { 
  id: string; 
  category: string; 
  particulars: string; 
  amount: string; 
  quarterly: string; 
  remarks?: string; 
  order_index: number; 
  attachmentUrl?: string; 
}
export interface QuickLink { id: string; title: string; url: string; isPriority?: boolean; icon?: string; attachmentUrl?: string; noticeId?: string; is_enabled?: boolean; }
export interface Event { id: string; title: string; date: string; time: string; location: string; attachmentUrl?: string; is_enabled?: boolean; parsedDate?: Date; }
export interface Achievement { id: string; title: string; year: string; description: string; attachmentUrl?: string; is_enabled?: boolean; }
export interface TransferCertificate {
  id: string;
  admission_number: string;
  dob: string;
  student_name: string;
  attachmentUrl: string;
  created_at?: string;
}
export interface StudentHonor { id: string; name: string; category: string; result: string; subtext: string; image: string; order_index: number; attachmentUrl?: string; is_enabled?: boolean; }
export interface MenuItem { id: string; label: string; href: string; parent_id?: string | null; order_index: number; attachmentUrl?: string; is_enabled?: boolean; }
export interface FAQ { id: string; question: string; answer: string; category?: string; order_index: number; is_enabled?: boolean; }
export interface PageSection {
  id: string;
  page_id?: string;
  section_key?: string;
  title: string;
  heading?: string;
  content: string;
  image_url?: string;
  attachmentUrl?: string;
  is_enabled?: boolean;
  order_index: number;
  display_type?: string;
  category?: string;
}

export interface CoCurricularActivity {
  id: string;
  title: string;
  heading?: string;
  content: string;
  display_type: 'tile' | 'text' | 'heading' | 'table' | 'list';
  category?: string;
  order_index: number;
  attachmentUrl?: string;
  image_url?: string;
  is_enabled: boolean;
  created_at?: string;
}

export interface CustomContent { id: string; title: string; heading: string; content: string; order_index: number; attachmentUrl?: string; is_enabled?: boolean; }
export interface ContactMessage { id: string; name: string; email: string; subject?: string; message: string; timestamp: string; status: 'new' | 'read' | 'replied'; }
export interface AnnouncementPopup {
  id: string;
  title: string;
  header?: string;
  type: 'text' | 'image' | 'pdf' | 'link';
  content: string;
  buttonText?: string;
  buttonLink?: string;
  isActive: boolean;
  order_index: number;
  attachmentUrl?: string;
}

export interface MarqueeItem {
  id: string;
  text: string;
  link?: string;
  attachmentUrl?: string;
  isActive: boolean;
  order_index: number;
}

export interface JesuitPageContent {
  id: string;
  objectives_html: string;
  examinations_html: string;
  promotions_html: string;
  discipline_html: string;
  updated_at?: string;
}

export interface LeadGrace {
  id: string;
  heading: string;
  content: string;
  image_url?: string;
  updated_at?: string;
  is_enabled?: boolean;
}

export interface AppSettings {
  id: string;
  applyNowEnabled: boolean | number;
  applyNowUrl: string;
  applyNowLabel: string;
  siteName: string;
  siteLogo: string;
  contactEmail: string;
  contactPhone: string;
  contactAddress: string;
  currentSession?: string;
  feesPdfUrl?: string;
  popupMessage?: string;
  popupEnabled?: boolean | number;
  flagImage?: string;
  flagEnabled?: boolean;
  aboutTitle?: string;
  aboutContent?: string;
  historyTitle?: string;
  historyContent?: string;
  showCarousel?: boolean | number;
  showMarquee?: boolean | number;
  showAbout?: boolean | number;
  showFeature?: boolean | number;
  showVision?: boolean | number;
  showInsights?: boolean | number;
  showPrincipalMessage?: boolean | number;
  showGallery?: boolean | number;
  showLeadership?: boolean | number;
  showHonors?: boolean | number;
  faviconUrl?: string;
  careerFormEnabled?: boolean | number;
  googleSearchConsoleKey?: string;
  bingWebmasterKey?: string;
  indexNowKey?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  hideAttachedImages?: boolean | number;
}

export interface StudentLeader {
  id: string;
  name: string;
  role: 'Head Boy' | 'Head Girl';
  academic_year: string;
  image?: string;
  order_index: number;
  is_enabled?: boolean;
}

export interface StreamwiseTopper {
  id: string;
  name: string;
  stream: string;
  percentage: string;
  academic_year: string;
  image?: string;
  order_index: number;
  is_enabled?: boolean;
}

export interface XavieriteOfYear {
  id: string;
  name: string;
  academic_year: string;
  citation?: string;
  image?: string;
  order_index: number;
  is_enabled?: boolean;
}

export interface DigitalCampus {
  id: string; // 'current'
  title: string;
  model_url?: string;
  is_enabled: boolean;
  updated_at?: string;
}

export interface FormerStudentLeader {
  id: string;
  name: string;
  role: 'Head Boy' | 'Head Girl';
  academic_year: string;
  image?: string;
  order_index: number;
  is_enabled?: boolean;
}

export interface SiteStats {
  id: string;
  visitor_count: number;
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
  education_qualifications: {
    examination: string;
    percentage: string;
    year: string;
    institution: string;
    subjects: string;
  }[];
  teaching_experience: {
    fromYear: string;
    toYear: string;
    institution: string;
    subjects: string;
    classes: string;
  }[];
  achievements: {
    year: string;
    field: string;
    description: string;
  }[];
  teacher_category?: string;
  created_at?: string;
  status?: string;
}

export interface AppData {
  notices: Notice[];
  staff: StaffMember[];
  gallery: GalleryItem[];
  fees: FeeStructure[];
  links: QuickLink[];
  events: Event[];
  achievements: Achievement[];
  studentHonors: StudentHonor[];
  navigation_menu: MenuItem[];
  carousel: GalleryItem[];
  faqs: FAQ[];
  transfer_certificates?: TransferCertificate[];
  messages: ContactMessage[];
  popups: AnnouncementPopup[];
  marquee: MarqueeItem[];
  former_leaders: FormerLeader[];
  former_principals: FormerLeader[];
  former_rectors: FormerLeader[];
  former_managers: FormerLeader[];
  former_student_leaders: FormerStudentLeader[];
  streamwise_toppers: StreamwiseTopper[];
  xavierite_of_the_year: XavieriteOfYear[];
  useful_links: QuickLink[];
  custom_content: CustomContent[];
  school_history: any[];
  lead_grace: LeadGrace[];
  digital_campus?: DigitalCampus;
  page_sections: PageSection[];
  fire_safety: PageSection[];
  activities: PageSection[];
  co_curricular_activities: CoCurricularActivity[];
  alumni: PageSection[];
  school_info: PageSection[];
  parent_obligations: PageSection[];
  careers: PageSection[];
  mandatory_disclosures: PageSection[];
  contact_content: PageSection[];
  scholarships: PageSection[];
  career_applications?: CareerApplication[];
  site_stats: SiteStats[];
  jesuit_page_content: JesuitPageContent[];
  settings: AppSettings;
  content: Record<string, string>;
  admins: AdminCredential[];
  logs: AuditLog[];
  student_leaders?: any[]; // Keep for legacy but we will remove usage
  supabaseTableStatus?: Record<string, 'online' | 'offline'>;
}

export interface AdminCredential {
  id: string;
  username: string;
  password?: string;
  role: 'admin' | 'staff';
  created_at?: string;
}

export interface AuditLog {
  id: string;
  user: string;
  action: string;
  details: string;
  timestamp: string;
}

export interface FormerLeader {
  id: string;
  name: string;
  tenure: string;
  image?: string;
  order_index: number;
  is_enabled?: boolean;
}
