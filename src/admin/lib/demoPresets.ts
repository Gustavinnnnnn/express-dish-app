// Presets de demonstração. Cada preset inclui paleta completa (background, foreground,
// card, primary, etc.), conteúdo (categorias/produtos/ofertas) e metadados da loja.

export type DemoTheme = {
  background: string;        // HSL "h s% l%"
  foreground: string;
  card: string;
  card_foreground: string;
  muted: string;
  muted_foreground: string;
  border: string;
  primary: string;
  primary_foreground: string;
  accent: string;
};

export type DemoCategory = { name: string; emoji: string; image_url?: string };
export type DemoProduct = {
  name: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
  featured?: boolean;
};
export type DemoOffer = {
  title: string;
  subtitle: string;
  price: number;
  old_price: number;
  image_url: string;
  product?: string;
};

export type DemoPreset = {
  id: string;
  label: string;
  emoji: string;
  description: string;
  theme: DemoTheme;
  settings: {
    store_name: string;
    tagline: string;
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

// ----- TEMAS -----
const themeAcai: DemoTheme = {
  background: "270 30% 8%", foreground: "35 30% 96%",
  card: "270 25% 12%", card_foreground: "35 30% 96%",
  muted: "270 18% 15%", muted_foreground: "270 10% 65%",
  border: "270 20% 20%",
  primary: "280 75% 55%", primary_foreground: "0 0% 100%",
  accent: "290 80% 65%",
};

const themeBurger: DemoTheme = {
  // Preto + vermelho
  background: "0 0% 7%", foreground: "0 0% 96%",
  card: "0 0% 11%", card_foreground: "0 0% 96%",
  muted: "0 0% 14%", muted_foreground: "0 0% 65%",
  border: "0 0% 20%",
  primary: "0 80% 50%", primary_foreground: "0 0% 100%",
  accent: "16 90% 55%",
};

const themePizza: DemoTheme = {
  // Creme quente + vermelho italiano
  background: "40 50% 97%", foreground: "20 20% 12%",
  card: "0 0% 100%", card_foreground: "20 20% 12%",
  muted: "40 30% 92%", muted_foreground: "20 10% 40%",
  border: "30 25% 85%",
  primary: "0 75% 45%", primary_foreground: "0 0% 100%",
  accent: "140 50% 35%",
};

const themePadaria: DemoTheme = {
  // Branco + marrom
  background: "0 0% 100%", foreground: "30 25% 12%",
  card: "30 35% 98%", card_foreground: "30 25% 12%",
  muted: "30 25% 94%", muted_foreground: "30 10% 40%",
  border: "30 20% 88%",
  primary: "30 65% 40%", primary_foreground: "0 0% 100%",
  accent: "40 80% 55%",
};

const themeRestaurante: DemoTheme = {
  // Verde escuro elegante
  background: "150 20% 10%", foreground: "40 25% 95%",
  card: "150 18% 14%", card_foreground: "40 25% 95%",
  muted: "150 15% 18%", muted_foreground: "150 8% 65%",
  border: "150 15% 22%",
  primary: "150 50% 40%", primary_foreground: "0 0% 100%",
  accent: "40 70% 55%",
};

export const DEMO_PRESETS: DemoPreset[] = [
  {
    id: "hamburgueria", label: "Hamburgueria", emoji: "🍔",
    description: "Burgers artesanais — preto + vermelho.",
    theme: themeBurger,
    settings: {
      store_name: "Burger House",
      tagline: "Burgers artesanais na brasa",
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
    id: "pizzaria", label: "Pizzaria", emoji: "🍕",
    description: "Pizzas artesanais — creme + vermelho italiano.",
    theme: themePizza,
    settings: {
      store_name: "Bella Pizza",
      tagline: "Pizza italiana de forno a lenha",
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
    id: "padaria", label: "Padaria", emoji: "🥖",
    description: "Pães e doces — branco + marrom.",
    theme: themePadaria,
    settings: {
      store_name: "Padaria Central",
      tagline: "Pão fresquinho todo dia",
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
    id: "acai", label: "Açaí", emoji: "🍇",
    description: "Açaí — roxo profundo.",
    theme: themeAcai,
    settings: {
      store_name: "Roxo Açaí",
      tagline: "Açaí cremoso do jeito que você ama",
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
    id: "restaurante", label: "Restaurante", emoji: "🍽️",
    description: "Cozinha contemporânea — verde elegante.",
    theme: themeRestaurante,
    settings: {
      store_name: "Sabor & Arte",
      tagline: "Cozinha contemporânea",
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

const getLightness = (hsl: string) => {
  const parts = hsl.trim().split(/\s+/);
  const light = parts[2] ?? "50%";
  return Number.parseFloat(light.replace("%", ""));
};

const withAlpha = (hsl: string, alpha: number) => `hsl(${hsl} / ${alpha})`;

/** Aplica um tema ao :root via CSS variables. Não toca no admin (admin-scope tem seu próprio tema). */
export function applyThemeVars(theme: Partial<DemoTheme> | null | undefined) {
  if (!theme) return;
  const root = document.documentElement;
  const map: Record<keyof DemoTheme, string> = {
    background: "--background",
    foreground: "--foreground",
    card: "--card",
    card_foreground: "--card-foreground",
    muted: "--muted",
    muted_foreground: "--muted-foreground",
    border: "--border",
    primary: "--primary",
    primary_foreground: "--primary-foreground",
    accent: "--accent",
  };
  (Object.keys(map) as (keyof DemoTheme)[]).forEach((k) => {
    const v = theme[k];
    if (v) root.style.setProperty(map[k], v);
  });

  const background = theme.background ?? "270 30% 8%";
  const foreground = theme.foreground ?? "35 30% 96%";
  const card = theme.card ?? background;
  const cardForeground = theme.card_foreground ?? foreground;
  const muted = theme.muted ?? card;
  const primary = theme.primary ?? theme.accent ?? "280 75% 55%";
  const accent = theme.accent ?? primary;
  const isLight = getLightness(background) >= 82;
  const accentForeground = getLightness(accent) >= 62 ? "30 25% 12%" : "0 0% 100%";

  root.style.setProperty("--ring", primary);
  root.style.setProperty("--accent", accent);
  root.style.setProperty("--accent-foreground", accentForeground);
  root.style.setProperty("--primary-glow", accent);
  root.style.setProperty("--popover", card);
  root.style.setProperty("--popover-foreground", cardForeground);
  root.style.setProperty("--secondary", muted);
  root.style.setProperty("--secondary-foreground", foreground);
  root.style.setProperty("--input", isLight ? theme.background ?? muted : muted);
  root.style.setProperty(
    "--gradient-primary",
    `linear-gradient(135deg, hsl(${primary}), hsl(${accent}))`,
  );
  root.style.setProperty(
    "--gradient-card",
    `linear-gradient(160deg, hsl(${card}) 0%, hsl(${background}) 100%)`,
  );
  root.style.setProperty(
    "--gradient-hero",
    `linear-gradient(180deg, ${withAlpha(background, isLight ? 0.04 : 0)} 0%, ${withAlpha(background, isLight ? 0.42 : 0.45)} 48%, ${withAlpha(background, isLight ? 0.96 : 0.92)} 100%)`,
  );
  root.style.setProperty(
    "--shadow-glow",
    `0 10px 36px -12px ${withAlpha(primary, isLight ? 0.3 : 0.55)}`,
  );
  root.style.setProperty(
    "--shadow-card",
    isLight
      ? "0 14px 34px -18px hsl(220 30% 18% / 0.16)"
      : "0 12px 30px -16px hsl(220 45% 3% / 0.58)",
  );
  root.style.setProperty(
    "--shadow-soft",
    isLight
      ? "0 4px 16px hsl(220 22% 20% / 0.1)"
      : "0 4px 16px hsl(220 45% 3% / 0.38)",
  );
  root.style.colorScheme = isLight ? "light" : "dark";
}
