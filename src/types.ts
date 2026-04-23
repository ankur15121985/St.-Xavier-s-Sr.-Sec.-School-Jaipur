export interface Notice { id: string; title: string; content?: string; date: string; category: string; link?: string; }
export interface StaffMember { id: string; name: string; role: string; bio: string; image: string; type: 'Management' | 'Faculty' | 'Administration'; }
export interface GalleryItem { id: string; url: string; caption: string; }
export interface FeeStructure { id: string; grade: string; admissionFee: string; tuition_fees: string; quarterly: string; }
export interface QuickLink { id: string; title: string; url: string; }
export interface Event { id: string; title: string; date: string; time: string; location: string; }
export interface Achievement { id: string; title: string; year: string; description: string; }
export interface StudentHonor { id: string; name: string; category: string; result: string; subtext: string; image: string; order_index: number; }
export interface MenuItem { id: string; label: string; href: string; parent_id?: string | null; order_index: number; }

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
}
