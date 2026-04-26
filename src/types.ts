export interface Notice { id: string; title: string; content?: string; date: string; category: string; link?: string; attachmentUrl?: string; }
export interface StaffMember { id: string; name: string; role: string; bio: string; image: string; type: 'Management' | 'Faculty' | 'Administration'; }
export interface GalleryItem { id: string; url: string; caption: string; }
export interface FeeStructure { id: string; grade: string; admissionFee: string; tuition_fees: string; quarterly: string; attachmentUrl?: string; }
export interface QuickLink { id: string; title: string; url: string; isPriority?: boolean; icon?: string; attachmentUrl?: string; }
export interface Event { id: string; title: string; date: string; time: string; location: string; attachmentUrl?: string; }
export interface Achievement { id: string; title: string; year: string; description: string; attachmentUrl?: string; }
export interface StudentHonor { id: string; name: string; category: string; result: string; subtext: string; image: string; order_index: number; }
export interface MenuItem { id: string; label: string; href: string; parent_id?: string | null; order_index: number; }
export interface FAQ { id: string; question: string; answer: string; category?: string; order_index: number; }
export interface ContactMessage { id: string; name: string; email: string; subject?: string; message: string; timestamp: string; status: 'new' | 'read' | 'replied'; }

export interface AppSettings {
  applyNowEnabled: boolean;
  applyNowUrl: string;
  applyNowLabel: string;
  siteName: string;
  siteLogo: string;
  contactEmail: string;
  contactPhone: string;
  contactAddress: string;
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
  messages: ContactMessage[];
  settings: AppSettings;
  content: Record<string, string>;
}
