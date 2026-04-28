export interface Notice { id: string; title: string; content?: string; date: string; category: string; link?: string; attachmentUrl?: string; }
export interface StaffMember { id: string; name: string; role: string; bio: string; image: string; type: 'Management' | 'Faculty' | 'Administration'; }
export interface GalleryItem { id: string; url: string; caption: string; session?: string; }
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
export interface QuickLink { id: string; title: string; url: string; isPriority?: boolean; icon?: string; attachmentUrl?: string; }
export interface Event { id: string; title: string; date: string; time: string; location: string; attachmentUrl?: string; }
export interface Achievement { id: string; title: string; year: string; description: string; attachmentUrl?: string; }
export interface TransferCertificate {
  id: string;
  admission_number: string;
  dob: string;
  student_name: string;
  attachmentUrl: string;
  created_at?: string;
}
export interface StudentHonor { id: string; name: string; category: string; result: string; subtext: string; image: string; order_index: number; }
export interface MenuItem { id: string; label: string; href: string; parent_id?: string | null; order_index: number; }
export interface FAQ { id: string; question: string; answer: string; category?: string; order_index: number; }
export interface ContactMessage { id: string; name: string; email: string; subject?: string; message: string; timestamp: string; status: 'new' | 'read' | 'replied'; }
export interface AnnouncementPopup {
  id: string;
  title: string;
  type: 'text' | 'image' | 'pdf';
  content: string;
  buttonText?: string;
  buttonLink?: string;
  isActive: boolean;
  order_index: number;
}

export interface AppSettings {
  id: string;
  applyNowEnabled: boolean;
  applyNowUrl: string;
  applyNowLabel: string;
  siteName: string;
  siteLogo: string;
  contactEmail: string;
  contactPhone: string;
  contactAddress: string;
  feesPdfUrl?: string;
  popupMessage?: string;
  popupEnabled?: boolean;
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
  menu: MenuItem[];
  carousel: GalleryItem[];
  faqs: FAQ[];
  transfer_certificates?: TransferCertificate[];
  messages: ContactMessage[];
  popups: AnnouncementPopup[];
  settings: AppSettings;
  content: Record<string, string>;
}
