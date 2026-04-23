import burgerClassic from "@/assets/burger-classic.jpg";
import burgerBacon from "@/assets/burger-bacon.jpg";
import burgerSmash from "@/assets/burger-smash.jpg";
import fries from "@/assets/fries.jpg";
import wings from "@/assets/wings.jpg";
import drinkSoda from "@/assets/drink-soda.jpg";
import milkshake from "@/assets/milkshake.jpg";

export type Category = {
  id: string;
  name: string;
  emoji: string;
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
};

export const categories: Category[] = [
  { id: "burgers", name: "Burgers", emoji: "🍔" },
  { id: "sides", name: "Acompanhamentos", emoji: "🍟" },
  { id: "chicken", name: "Frango", emoji: "🍗" },
  { id: "drinks", name: "Bebidas", emoji: "🥤" },
  { id: "desserts", name: "Sobremesas", emoji: "🍦" },
];

export const products: Product[] = [
  {
    id: "p1",
    name: "Cheeseburger Clássico",
    description: "Pão brioche, blend 150g, cheddar, alface e molho da casa.",
    price: 28.9,
    image: burgerClassic,
    category: "burgers",
    popular: true,
  },
  {
    id: "p2",
    name: "Bacon Lover",
    description: "Duplo cheddar, bacon crocante, cebola caramelizada.",
    price: 36.9,
    image: burgerBacon,
    category: "burgers",
    popular: true,
    tag: "Mais pedido",
  },
  {
    id: "p3",
    name: "Smash Onion BBQ",
    description: "Dois smash, anéis de cebola, BBQ defumado e cheddar.",
    price: 39.9,
    image: burgerSmash,
    category: "burgers",
    tag: "Novo",
  },
  {
    id: "p4",
    name: "Batata Rústica",
    description: "Crocante por fora, macia por dentro. Porção generosa.",
    price: 18.9,
    image: fries,
    category: "sides",
    popular: true,
  },
  {
    id: "p5",
    name: "Asinhas BBQ",
    description: "8 unidades ao molho barbecue artesanal.",
    price: 32.9,
    image: wings,
    category: "chicken",
  },
  {
    id: "p6",
    name: "Refrigerante 350ml",
    description: "Lata gelada — diversos sabores.",
    price: 7.5,
    image: drinkSoda,
    category: "drinks",
  },
  {
    id: "p7",
    name: "Milkshake Chocolate",
    description: "Cremoso com calda de chocolate belga.",
    price: 19.9,
    image: milkshake,
    category: "desserts",
    popular: true,
  },
];

export const offers = [
  {
    id: "o1",
    title: "Combo Bacon Lover",
    subtitle: "Burger + Batata + Refri",
    price: 49.9,
    oldPrice: 63.3,
    image: burgerBacon,
  },
  {
    id: "o2",
    title: "Dobradinha Smash",
    subtitle: "2 Smash Onion BBQ",
    price: 69.9,
    oldPrice: 79.8,
    image: burgerSmash,
  },
  {
    id: "o3",
    title: "Família Feliz",
    subtitle: "4 burgers + 2 batatas + 4 refris",
    price: 139.9,
    oldPrice: 178.2,
    image: burgerClassic,
  },
];

// Loja
export const STORE = {
  name: "Flame Burger",
  tagline: "Smash burgers artesanais",
  whatsapp: "5551999999999", // formato internacional sem +
  address: "Rua das Brasas, 123 — Centro",
};
