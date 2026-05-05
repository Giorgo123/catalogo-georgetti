import type { Product } from "./types";

export function formatARS(value: number): string {
  // Sin centavos, estilo Argentina
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(value);
}

function isAbsoluteUrl(url: string): boolean {
  return /^https?:\/\//i.test(url);
}

export function productImageUrl(p: Product): string {
  // 1) Si trae image explícito, úsalo
  if (p.image && p.image.trim()) {
    const raw = p.image.trim();
    if (isAbsoluteUrl(raw) || raw.startsWith("/")) return raw;
    return `/images/${raw}`;
  }

  // 2) Convención por código: subís `public/images/<COD>.webp` (recomendado)
  // Si no existe, el <img> cae al placeholder via onError.
  return `/images/${p.code}.webp`;
}

export function categoryPlaceholder(cat: string): string {
  const key = cat.toLowerCase();
  // Nota: estos nombres tienen que coincidir con `public/placeholders/*`
  if (key.includes("mosq")) return "/placeholders/mosqueton.webp";
  if (key.includes("arg")) return "/placeholders/argolla.webp";
  if (key.includes("cad")) return "/placeholders/cadena.webp";
  if (key.includes("torn")) return "/placeholders/torniqueta.webp";
  if (key.includes("soga")) return "/placeholders/soga.webp";
  if (key.includes("coll")) return "/placeholders/collar.webp";
  return "/placeholders/otros.svg";
}
