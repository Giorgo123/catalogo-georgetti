# Catálogo Web (PWA) - Cesar Luis Georgetti

## Requisitos
- Node.js 18+

## Setup
```bash
npm i
npm run dev
```

## Build / Deploy
```bash
npm run build
npm run preview
```

## Datos
- `src/data/products.json` (generado desde el Excel)
- Para imágenes por producto:
  - poner archivos en `public/images/<COD>.webp` (recomendado)
  - ejemplo: `public/images/AH10.webp`
- Si no hay imagen, se usa placeholder por categoría.

## WhatsApp
El botón "Consultar" arma un mensaje con código + nombre.
Cambiar el número en `src/config.ts`.
