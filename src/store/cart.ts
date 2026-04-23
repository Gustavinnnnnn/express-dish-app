import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product, ExtraGroup } from "@/data/menu";

/** Seleções escolhidas pelo cliente para um item do carrinho */
export type SelectedExtra = {
  groupId: string;
  groupTitle: string;
  optionId: string;
  optionName: string;
  qty: number;
  unitPrice: number; // preço por unidade (0 quando grátis)
};

export type CartItem = {
  /** Linha única no carrinho — produtos com extras diferentes ficam em linhas separadas */
  lineId: string;
  product: Product;
  qty: number;
  extras: SelectedExtra[];
  note?: string;
  /** Preço unitário (produto + extras) já calculado */
  unitPrice: number;
};

type CartState = {
  items: Record<string, CartItem>;
  note: string;
  payment: "pix" | "dinheiro" | "cartao";
  addLine: (item: Omit<CartItem, "lineId">) => void;
  increment: (lineId: string) => void;
  decrement: (lineId: string) => void;
  remove: (lineId: string) => void;
  setNote: (note: string) => void;
  setPayment: (p: CartState["payment"]) => void;
  clear: () => void;
};

export const computeUnitPrice = (
  product: Product,
  extras: SelectedExtra[]
) => {
  const extrasSum = extras.reduce(
    (sum, e) => sum + e.unitPrice * e.qty,
    0
  );
  return product.price + extrasSum;
};

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: {},
      note: "",
      payment: "pix",
      addLine: (item) =>
        set((s) => {
          const lineId =
            Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
          return {
            items: { ...s.items, [lineId]: { ...item, lineId } },
          };
        }),
      increment: (lineId) =>
        set((s) => {
          const it = s.items[lineId];
          if (!it) return s;
          return {
            items: { ...s.items, [lineId]: { ...it, qty: it.qty + 1 } },
          };
        }),
      decrement: (lineId) =>
        set((s) => {
          const it = s.items[lineId];
          if (!it) return s;
          if (it.qty <= 1) {
            const next = { ...s.items };
            delete next[lineId];
            return { items: next };
          }
          return {
            items: { ...s.items, [lineId]: { ...it, qty: it.qty - 1 } },
          };
        }),
      remove: (lineId) =>
        set((s) => {
          const next = { ...s.items };
          delete next[lineId];
          return { items: next };
        }),
      setNote: (note) => set({ note }),
      setPayment: (payment) => set({ payment }),
      clear: () => set({ items: {}, note: "" }),
    }),
    { name: "roxo-acai-cart", version: 2 }
  )
);

type ProfileState = {
  name: string;
  phone: string;
  address: string;
  history: { id: string; date: string; total: number; items: string[] }[];
  set: (p: Partial<Omit<ProfileState, "set" | "addOrder">>) => void;
  addOrder: (order: { total: number; items: string[] }) => void;
};

export const useProfile = create<ProfileState>()(
  persist(
    (set) => ({
      name: "",
      phone: "",
      address: "",
      history: [],
      set: (p) => set(p),
      addOrder: (order) =>
        set((s) => ({
          history: [
            {
              id: Date.now().toString(),
              date: new Date().toISOString(),
              ...order,
            },
            ...s.history,
          ].slice(0, 20),
        })),
    }),
    { name: "roxo-acai-profile" }
  )
);

/** Helper exportado para uso em componentes — não cria novo array a cada render. */
export type { ExtraGroup };
