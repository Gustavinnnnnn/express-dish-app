import heroAcai from "@/assets/hero-acai.jpg";
import acai300 from "@/assets/acai-300.jpg";
import acai500 from "@/assets/acai-500.jpg";
import acai1l from "@/assets/acai-1l.jpg";
import vitamina from "@/assets/vitamina-acai.jpg";
import picole from "@/assets/picole.jpg";

export type Category = { id: string; name: string; emoji: string };

/** Grupo de extras configurável */
export type ExtraOption = {
  id: string;
  name: string;
  price: number; // 0 = grátis
};

export type ExtraGroup = {
  id: string;
  title: string;
  description?: string;
  /** "free" = grátis (com limite max), "paid" = pago (qty livre, soma preço), "single" = escolha única (radio) */
  kind: "free" | "paid" | "single";
  required?: boolean;
  /** Para "free": limite total de unidades. Para "paid": opcional. */
  max?: number;
  options: ExtraOption[];
};

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  popular?: boolean;
  tag?: string;
  extras?: ExtraGroup[];
};

export const categories: Category[] = [
  { id: "acai", name: "Açaí", emoji: "🍇" },
  { id: "vitaminas", name: "Vitaminas", emoji: "🥤" },
  { id: "picoles", name: "Picolés", emoji: "🍦" },
];

// Grupos reutilizáveis de extras de açaí
const fruitsFree: ExtraGroup = {
  id: "frutas",
  title: "Frutas grátis",
  description: "Escolha até 3 frutas sem custo",
  kind: "free",
  max: 3,
  options: [
    { id: "banana", name: "Banana", price: 0 },
    { id: "morango", name: "Morango", price: 0 },
    { id: "kiwi", name: "Kiwi", price: 0 },
    { id: "uva", name: "Uva", price: 0 },
    { id: "manga", name: "Manga", price: 0 },
  ],
};

const toppingsFree: ExtraGroup = {
  id: "complementos-free",
  title: "Complementos grátis",
  description: "Escolha até 2",
  kind: "free",
  max: 2,
  options: [
    { id: "leite-po", name: "Leite em pó", price: 0 },
    { id: "leite-cond", name: "Leite condensado", price: 0 },
    { id: "mel", name: "Mel", price: 0 },
    { id: "granola-s", name: "Granola simples", price: 0 },
  ],
};

const toppingsPaid: ExtraGroup = {
  id: "extras-pagos",
  title: "Extras pagos",
  description: "Adicione quantos quiser",
  kind: "paid",
  options: [
    { id: "granola-p", name: "Granola premium", price: 2.0 },
    { id: "nutella", name: "Nutella", price: 4.0 },
    { id: "ovomaltine", name: "Ovomaltine", price: 3.0 },
    { id: "paçoca", name: "Paçoca", price: 2.5 },
    { id: "morango-extra", name: "Morango extra", price: 3.5 },
    { id: "amendoim", name: "Amendoim", price: 2.0 },
  ],
};

const utensil: ExtraGroup = {
  id: "colher",
  title: "Acompanhamentos",
  kind: "single",
  required: true,
  options: [
    { id: "com-colher", name: "Com colher", price: 0 },
    { id: "sem-colher", name: "Sem colher", price: 0 },
  ],
};

const acaiExtras: ExtraGroup[] = [fruitsFree, toppingsFree, toppingsPaid, utensil];

export const products: Product[] = [
  {
    id: "p1",
    name: "Açaí 300ml",
    description: "Polpa de açaí cremosa batida na hora.",
    price: 14.9,
    image: acai300,
    category: "acai",
    popular: true,
    extras: acaiExtras,
  },
  {
    id: "p2",
    name: "Açaí 500ml",
    description: "Tamanho clássico para matar a fome.",
    price: 19.9,
    image: acai500,
    category: "acai",
    popular: true,
    tag: "Mais pedido",
    extras: acaiExtras,
  },
  {
    id: "p3",
    name: "Açaí 1 Litro",
    description: "Tamanho família — perfeito para dividir.",
    price: 34.9,
    image: acai1l,
    category: "acai",
    tag: "Família",
    extras: acaiExtras,
  },
  {
    id: "p4",
    name: "Vitamina de Açaí",
    description: "Açaí batido com leite e banana. Cremoso e refrescante.",
    price: 16.9,
    image: vitamina,
    category: "vitaminas",
    popular: true,
    extras: [
      {
        id: "fruta-vit",
        title: "Fruta adicional",
        kind: "single",
        options: [
          { id: "banana", name: "Banana (padrão)", price: 0 },
          { id: "morango", name: "Morango", price: 0 },
          { id: "manga", name: "Manga", price: 0 },
        ],
      },
      toppingsPaid,
    ],
  },
  {
    id: "p5",
    name: "Picolé de Açaí",
    description: "Picolé artesanal de açaí puro.",
    price: 7.9,
    image: picole,
    category: "picoles",
  },
];

export const offers = [
  {
    id: "o1",
    title: "Açaí 500ml + 2 extras",
    subtitle: "Monte do seu jeito",
    price: 24.9,
    oldPrice: 29.9,
    image: acai500,
    productId: "p2",
  },
  {
    id: "o2",
    title: "Combo Família 1L",
    subtitle: "Açaí 1L + extras pagos",
    price: 39.9,
    oldPrice: 49.9,
    image: acai1l,
    productId: "p3",
  },
  {
    id: "o3",
    title: "Vitamina cremosa",
    subtitle: "Vitamina de açaí 500ml",
    price: 14.9,
    oldPrice: 18.9,
    image: vitamina,
    productId: "p4",
  },
];

export const STORE = {
  name: "Roxo Açaí",
  tagline: "Açaí cremoso do jeito que você ama",
  whatsapp: "5551999999999",
  address: "Rua dos Frutos, 456 — Centro",
};

export { heroAcai };
