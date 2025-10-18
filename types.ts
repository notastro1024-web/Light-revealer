
export enum Page {
  Home = 'Home',
  Customize = 'Customize',
  Gallery = 'Gallery',
  About = 'About',
  Contact = 'Contact',
}

export interface GalleryItem {
  id: number;
  title: string;
  story: string;
  category: string;
  imageUrl: string;
  limit: number;
}

export type ArtCategory = 'Human' | 'Animal' | 'Vehicle' | 'Mythical' | 'Bird' | 'Structure/Place';

export type ArtStyle = 'Outline' | 'Pencil Sketch' | 'Colored Glow';

export type FrameMaterial = 'Wood' | 'Metal' | 'Matte' | 'Gloss' | 'Epoxy';

export type FrameColor = 'Black' | 'Gold' | 'White' | 'Bronze';

export interface ElementStylePair {
  element: string;
  style: ArtStyle;
}
