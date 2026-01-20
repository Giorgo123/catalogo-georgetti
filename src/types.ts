export type Product = {
  code: string;
  name: string;
  price_ars: number;
  category: string;
  image?: string; // opcional; si está vacío usa autoload por code
};
