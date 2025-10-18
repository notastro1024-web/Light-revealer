
import { GalleryItem, ArtCategory, ArtStyle, FrameMaterial, FrameColor } from './types';

export const GALLERY_ITEMS: GalleryItem[] = [
  { id: 1, title: 'Celestial Dragon', story: 'Forged in starlight, this piece captures the silent roar of a cosmic beast.', category: 'Mythical', imageUrl: 'https://picsum.photos/seed/dragon/800/1000', limit: 50 },
  { id: 2, title: 'The Gilded City', story: 'A vision of a future metropolis, where architecture touches the heavens.', category: 'Structure/Place', imageUrl: 'https://picsum.photos/seed/city/800/1000', limit: 25 },
  { id: 3, title: 'Ephemeral Gaze', story: 'A portrait that holds a thousand untold stories, illuminated from within.', category: 'Human', imageUrl: 'https://picsum.photos/seed/gaze/800/1000', limit: 100 },
  { id: 4, title: 'Automaton Heart', story: 'The soul of a machine, rendered in circuits of light.', category: 'Vehicle', imageUrl: 'https://picsum.photos/seed/robotcar/800/1000', limit: 75 },
  { id: 5, title: 'Spirit Wolf', story: 'The embodiment of the wild, its spirit glowing against the eternal night.', category: 'Animal', imageUrl: 'https://picsum.photos/seed/wolf/800/1000', limit: 50 },
  { id: 6, title: 'Phoenix Flight', story: 'Rising from ashes, a testament to rebirth and incandescent hope.', category: 'Bird', imageUrl: 'https://picsum.photos/seed/phoenix/800/1000', limit: 30 },
  { id: 7, title: 'The Lone Knight', story: 'A silent guardian whose armor gleams with the light of a forgotten oath.', category: 'Human', imageUrl: 'https://picsum.photos/seed/knight/800/1000', limit: 40 },
  { id: 8, title: 'Oceanic Leviathan', story: 'A creature from the deep, its form a dance of bioluminescence and shadow.', category: 'Mythical', imageUrl: 'https://picsum.photos/seed/leviathan/800/1000', limit: 20 },
  { id: 9, title: 'Machina Wings', story: 'A futuristic aircraft, slicing through clouds with wings of pure energy.', category: 'Vehicle', imageUrl: 'https://picsum.photos/seed/plane/800/1000', limit: 60 },
  { id: 10, title: 'The Oracle', story: 'Her eyes see beyond time, her wisdom radiating as a soft, knowing light.', category: 'Human', imageUrl: 'https://picsum.photos/seed/oracle/800/1000', limit: 15 },
];

export const ART_CATEGORIES: ArtCategory[] = ['Human', 'Animal', 'Vehicle', 'Mythical', 'Bird', 'Structure/Place'];
export const ART_STYLES: ArtStyle[] = ['Outline', 'Pencil Sketch', 'Colored Glow'];
export const FRAME_MATERIALS: FrameMaterial[] = ['Wood', 'Metal', 'Matte', 'Gloss', 'Epoxy'];
export const FRAME_COLORS: FrameColor[] = ['Black', 'Gold', 'White', 'Bronze'];

export const PRE_SELECTED_ART: { category: ArtCategory, url: string }[] = [
    { category: 'Human', url: 'https://picsum.photos/seed/humanart/600/600' },
    { category: 'Animal', url: 'https://picsum.photos/seed/animalart/600/600' },
    { category: 'Vehicle', url: 'https://picsum.photos/seed/vehicleart/600/600' },
    { category: 'Mythical', url: 'https://picsum.photos/seed/mythicalart/600/600' },
    { category: 'Bird', url: 'https://picsum.photos/seed/birdart/600/600' },
    { category: 'Structure/Place', url: 'https://picsum.photos/seed/placeart/600/600' },
];
