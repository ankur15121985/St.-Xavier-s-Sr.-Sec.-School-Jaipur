export interface Notice { id: string; title: string; content?: string; date: string; category: string; link?: string; }
export interface StaffMember { id: string; name: string; role: string; bio: string; image: string; type: 'Management' | 'Faculty' | 'Administration'; }
export interface GalleryItem { id: string; url: string; caption: string; }
export interface FeeStructure { id: string; grade: string; admissionFee: string; tuition_fees: string; quarterly: string; }
export interface QuickLink { id: string; title: string; url: string; }
export interface Event { id: string; title: string; date: string; time: string; location: string; }
export interface Achievement { id: string; title: string; year: string; description: string; }

export interface AppData {
  notices: Notice[];
  staff: StaffMember[];
  gallery: GalleryItem[];
  fees: FeeStructure[];
  links: QuickLink[];
  events: Event[];
  achievements: Achievement[];
}
