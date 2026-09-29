import type { ImageMetadata } from 'astro';
import data from '../content/fotos.json';

const bestanden = import.meta.glob<{ default: ImageMetadata }>('../assets/instagram/*.jpg', { eager: true });

export interface Foto {
  src: ImageMetadata;
  alt: string;
  fotograaf: string;
  fotograafHref?: string;
}

export function foto(sleutel: string): Foto {
  const bestand = bestanden[`../assets/instagram/${sleutel}.jpg`];
  const info = (data.beelden as Record<string, { fotograaf: string; alt: string }>)[sleutel];
  if (!bestand || !info) throw new Error(`Onbekende foto: ${sleutel}`);
  const maker = (data.fotografen as Record<string, { naam: string; href?: string }>)[info.fotograaf];
  return { src: bestand.default, alt: info.alt, fotograaf: maker.naam, fotograafHref: maker.href };
}

export const fotografen = Object.values(data.fotografen as Record<string, { naam: string; href?: string }>);
