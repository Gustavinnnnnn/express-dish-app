// Presets de demonstração. Cada preset = configuração completa da loja.
// Aplicação substitui categorias/produtos/ofertas e atualiza store_settings.

export type DemoCategory = { name: string; emoji: string; image_url?: string };
export type DemoProduct = {
  name: string;
  description: string;
  price: number;
  image_url: string;
  category: string; // referencia DemoCategory.name
  featured?: boolean;
};
export type DemoOffer = {
  title: string;
  subtitle: string;
  price: number;
  old_price: number;
  image_url: string;
  product?: string; // referencia DemoProduct.name
};

export type DemoPreset = {
  id: string;
  label: string;
  emoji: string;
  description: string;
  settings: {
    store_name: string;
    tagline: string;
    primary_color: string; // HSL "h s% l%"
    banner_url: string;
    logo_url?: string;
    hero_title: string;
    hero_subtitle: string;
    default_message: string;
  };
  categories: DemoCategory[];
  products: DemoProduct[];
  offers: DemoOffer[];
};

const U = (id: string, w = 800) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

export const DEMO_PRESETS: DemoPreset[] = [
  {
    id: "hamburgueria",
    label: "Hamburgueria",
    emoji: "🍔",
    description: "Burgers artesanais, batatas e refris.",
    settings: {
      store_name: "Burger House",
      tagline: "Burgers artesanais na brasa",
      primary_color: "16 90% 50%",
      banner_url: U("1568901346375-23c9450c58cd", 1600),
      hero_title: "Os melhores burgers da cidade",
      hero_subtitle: "Carne 180g, queijo derretido e pão brioche",
      default_message: "Olá! Quero fazer um pedido na Burger House:",
    },
    categories: [
      { name: "Burgers", emoji: "🍔" },
      { name: "Acompanhamentos", emoji: "🍟" },
      { name: "Bebidas", emoji: "🥤" },
    ],
    products: [
      { name: "Cheese Bacon", description: "Carne 180g, cheddar, bacon e maionese da casa.", price: 32.9, image_url: U("1568901346375-23c9450c58cd"), category: "Burgers", featured: true },
      { name: "Smash Duplo", description: "Dois smash, queijo prato, picles e molho especial.", price: 36.9, image_url: U("1572802419224-296b0aeee0d9"), category: "Burgers", featured: true },
      { name: "Veggie Burger", description: "Hambúrguer de grão-de-bico, alface, tomate e maionese vegana.", price: 28.9, image_url: U("1525059696034-4967a8e1dca2"), category: "Burgers" },
      { name: "Batata Rústica", description: "Porção 300g com cheddar e bacon.", price: 22.9, image_url: U("1573080496219-bb080dd4f877"), category: "Acompanhamentos" },
      { name: "Onion Rings", description: "Anéis de cebola crocantes.", price: 18.9, image_url: U("1639024471283-03518883512d"), category: "Acompanhamentos" },
      { name: "Coca-Cola 350ml", description: "Lata gelada.", price: 7.0, image_url: U("1622483767028-3f66f32aef97"), category: "Bebidas" },
    ],
    offers: [
      { title: "Combo Cheese Bacon", subtitle: "Burger + batata + refri", price: 49.9, old_price: 62.8, image_url: U("1568901346375-23c9450c58cd"), product: "Cheese Bacon" },
      { title: "Smash Duplo + Fritas", subtitle: "Combo do dia", price: 52.9, old_price: 65.0, image_url: U("1572802419224-296b0aeee0d9"), product: "Smash Duplo" },
    ],
  },
  {
    id: "pizzaria",
    label: "Pizzaria",
    emoji: "🍕",
    description: "Pizzas artesanais forno a lenha.",
    settings: {
      store_name: "Bella Pizza",
      tagline: "Pizza italiana de forno a lenha",
      primary_color: "0 75% 45%",
      banner_url: U("1513104890138-7c749659a591", 1600),
      hero_title: "Pizza fresquinha em 30 minutos",
      hero_subtitle: "Massa artesanal, ingredientes selecionados",
      default_message: "Olá! Quero pedir uma pizza na Bella Pizza:",
    },
    categories: [
      { name: "Pizzas Salgadas", emoji: "🍕" },
      { name: "Pizzas Doces", emoji: "🍫" },
      { name: "Bebidas", emoji: "🍷" },
    ],
    products: [
      { name: "Margherita", description: "Molho de tomate, mussarela, manjericão e azeite.", price: 49.9, image_url: U("1574071318508-1cdbab80d002"), category: "Pizzas Salgadas", featured: true },
      { name: "Calabresa", description: "Calabresa fatiada, cebola roxa e mussarela.", price: 52.9, image_url: U("1565299624946-b28f40a0ae38"), category: "Pizzas Salgadas", featured: true },
      { name: "Pepperoni", description: "Mussarela e pepperoni importado.", price: 58.9, image_url: U("1628840042765-356cda07504e"), category: "Pizzas Salgadas" },
      { name: "Quatro Queijos", description: "Mussarela, gorgonzola, parmesão e provolone.", price: 62.9, image_url: U("1513104890138-7c749659a591"), category: "Pizzas Salgadas" },
      { name: "Chocolate com Morango", description: "Chocolate ao leite e morangos frescos.", price: 56.9, image_url: U("1578985545062-69928b1d9587"), category: "Pizzas Doces" },
      { name: "Vinho Tinto Suave", description: "Taça 250ml.", price: 24.9, image_url: U("1510812431401-41d2bd2722f3"), category: "Bebidas" },
    ],
    offers: [
      { title: "Margherita em promoção", subtitle: "Pizza grande tradicional", price: 39.9, old_price: 49.9, image_url: U("1574071318508-1cdbab80d002"), product: "Margherita" },
      { title: "Combo Calabresa + Refri", subtitle: "Pizza + 2L", price: 59.9, old_price: 72.9, image_url: U("1565299624946-b28f40a0ae38"), product: "Calabresa" },
    ],
  },
  {
    id: "padaria",
    label: "Padaria",
    emoji: "🥖",
    description: "Pães, doces e café fresquinho.",
    settings: {
      store_name: "Padaria Central",
      tagline: "Pão fresquinho todo dia",
      primary_color: "30 65% 45%",
      banner_url: U("1509440159596-0249088772ff", 1600),
      hero_title: "Pão quentinho na sua mesa",
      hero_subtitle: "Doces, salgados, café e muito mais",
      default_message: "Olá! Quero fazer um pedido na Padaria Central:",
    },
    categories: [
      { name: "Pães", emoji: "🥖" },
      { name: "Doces", emoji: "🍰" },
      { name: "Salgados", emoji: "🥐" },
      { name: "Café", emoji: "☕" },
    ],
    products: [
      { name: "Pão Francês (kg)", description: "Crocante por fora, macio por dentro.", price: 16.9, image_url: U("1509440159596-0249088772ff"), category: "Pães", featured: true },
      { name: "Pão Italiano", description: "Pão rústico fermentação natural.", price: 22.9, image_url: U("1549931319-a545dcf3bc73"), category: "Pães" },
      { name: "Croissant de Chocolate", description: "Folhado e recheado de chocolate ao leite.", price: 9.9, image_url: U("1555507036-ab1f4038808a"), category: "Doces", featured: true },
      { name: "Bolo de Cenoura", description: "Fatia generosa com cobertura de chocolate.", price: 8.9, image_url: U("1574085733277-851d9d856a3a"), category: "Doces" },
      { name: "Coxinha de Frango", description: "Recheio cremoso de frango com catupiry.", price: 7.5, image_url: U("1606755962773-d324e0a13086"), category: "Salgados" },
      { name: "Café Expresso", description: "Café 100% arábica.", price: 5.5, image_url: U("1509042239860-f550ce710b93"), category: "Café" },
    ],
    offers: [
      { title: "Café + Croissant", subtitle: "Combo café da manhã", price: 12.9, old_price: 15.4, image_url: U("1555507036-ab1f4038808a"), product: "Croissant de Chocolate" },
      { title: "Pão Italiano com desconto", subtitle: "Fermentação natural", price: 18.9, old_price: 22.9, image_url: U("1549931319-a545dcf3bc73"), product: "Pão Italiano" },
    ],
  },
  {
    id: "acai",
    label: "Açaí",
    emoji: "🍇",
    description: "Açaí cremoso, vitaminas e picolés.",
    settings: {
      store_name: "Roxo Açaí",
      tagline: "Açaí cremoso do jeito que você ama",
      primary_color: "270 70% 45%",
      banner_url: U("1551024506-0bccd828d307", 1600),
      hero_title: "Açaí cremoso na sua porta",
      hero_subtitle: "Monte do seu jeito e receba em minutos",
      default_message: "Olá! Quero fazer um pedido no Roxo Açaí:",
    },
    categories: [
      { name: "Açaí", emoji: "🍇" },
      { name: "Vitaminas", emoji: "🥤" },
      { name: "Picolés", emoji: "🍦" },
    ],
    products: [
      { name: "Açaí 300ml", description: "Polpa de açaí cremosa batida na hora.", price: 14.9, image_url: U("1591741849697-fb7c66c39bf7"), category: "Açaí", featured: true },
      { name: "Açaí 500ml", description: "Tamanho clássico para matar a fome.", price: 19.9, image_url: U("1551024506-0bccd828d307"), category: "Açaí", featured: true },
      { name: "Açaí 1 Litro", description: "Tamanho família — perfeito para dividir.", price: 34.9, image_url: U("1546039907-7fa05f864c02"), category: "Açaí" },
      { name: "Vitamina de Açaí", description: "Açaí batido com leite e banana.", price: 16.9, image_url: U("1638176067000-9e2b0e6c3c1e"), category: "Vitaminas" },
      { name: "Picolé de Açaí", description: "Picolé artesanal de açaí puro.", price: 7.9, image_url: U("1488900128323-21503983a07e"), category: "Picolés" },
    ],
    offers: [
      { title: "Açaí 500ml + 2 extras", subtitle: "Monte do seu jeito", price: 24.9, old_price: 29.9, image_url: U("1551024506-0bccd828d307"), product: "Açaí 500ml" },
      { title: "Combo Família 1L", subtitle: "Açaí 1L + extras pagos", price: 39.9, old_price: 49.9, image_url: U("1546039907-7fa05f864c02"), product: "Açaí 1 Litro" },
    ],
  },
  {
    id: "restaurante",
    label: "Restaurante",
    emoji: "🍽️",
    description: "Pratos executivos e gourmet.",
    settings: {
      store_name: "Sabor & Arte",
      tagline: "Cozinha contemporânea",
      primary_color: "150 50% 35%",
      banner_url: U("1414235077428-338989a2e8c0", 1600),
      hero_title: "Sabor que conquista",
      hero_subtitle: "Pratos executivos preparados na hora",
      default_message: "Olá! Quero fazer um pedido no Sabor & Arte:",
    },
    categories: [
      { name: "Pratos Principais", emoji: "🍽️" },
      { name: "Massas", emoji: "🍝" },
      { name: "Saladas", emoji: "🥗" },
      { name: "Sobremesas", emoji: "🍮" },
    ],
    products: [
      { name: "Filé ao Molho Madeira", description: "Filé mignon com molho madeira, arroz e batata rústica.", price: 64.9, image_url: U("1546833999-b9f581a1996d"), category: "Pratos Principais", featured: true },
      { name: "Salmão Grelhado", description: "Salmão com legumes salteados e purê de batata-doce.", price: 72.9, image_url: U("1467003909585-2f8a72700288"), category: "Pratos Principais", featured: true },
      { name: "Risoto de Funghi", description: "Risoto cremoso com mix de cogumelos.", price: 54.9, image_url: U("1476124369491-e7addf5db371"), category: "Massas" },
      { name: "Spaghetti à Bolonhesa", description: "Massa italiana com molho de carne tradicional.", price: 42.9, image_url: U("1551183053-bf91a1d81141"), category: "Massas" },
      { name: "Salada Caesar", description: "Alface, croutons, parmesão e molho caesar.", price: 32.9, image_url: U("1546793665-c74683f339c1"), category: "Saladas" },
      { name: "Petit Gateau", description: "Bolo quente de chocolate com sorvete.", price: 24.9, image_url: U("1551024601-bec78aea704b"), category: "Sobremesas" },
    ],
    offers: [
      { title: "Filé Madeira em destaque", subtitle: "Prato executivo", price: 54.9, old_price: 64.9, image_url: U("1546833999-b9f581a1996d"), product: "Filé ao Molho Madeira" },
      { title: "Risoto + Sobremesa", subtitle: "Combo gourmet", price: 69.9, old_price: 79.8, image_url: U("1476124369491-e7addf5db371"), product: "Risoto de Funghi" },
    ],
  },
];

export const DEFAULT_PRESET_ID = "acai";
