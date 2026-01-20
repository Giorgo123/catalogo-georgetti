import type { Product } from "./types";

export function formatARS(value: number): string {
  // Sin centavos, estilo Argentina
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(value);
}

export function productImageUrl(p: Product): string {
  // 1) Si trae image explícito, úsalo
  if (p.image && p.image.trim()) return p.image.trim();

  // 2) Convención por código (vos subís public/images/<COD>.jpg|png|webp)
  // No podemos detectar extensión al vuelo sin back, así que probamos .jpg primero.
  // Si falla, el <img> cae al placeholder via onError.
  return `/images/${p.code}.jpg`;
}

export function categoryPlaceholder(cat: string): string {
  const key = cat.toLowerCase();
  if (key.includes("soga")) return "/placeholders/sogas.svg";
  if (key.includes("mosquet")) return "/placeholders/mosquetones.svg";
  if (key.includes("argoll")) return "/placeholders/argollas.svg";
  if (key.includes("cadena")) return "/placeholders/cadenas.svg";
  if (key.includes("torniq")) return "/placeholders/torniquetas.svg";
  if (key.includes("grill")) return "/placeholders/grilletes.svg";
  return "/placeholders/otros.svg";
}
