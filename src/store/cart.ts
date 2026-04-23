import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "@/data/menu";

export type CartItem = {
  product: Product;
  qty: number;
};

type CartState = {
  items: Record<string, CartItem>;
  note: string;
  payment: "pix" | "dinheiro" | "cartao";
  add: (product: Product) => void;
  remove: (id: string) => void;
  decrement: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  setNote: (note: string) => void;
  setPayment: (p: CartState["payment"]) => void;
  clear: () => void;
  total: () => number;
  count: () => number;
};

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: {},
      note: "",
      payment: "pix",
      add: (product) =>
        set((s) => {
          const existing = s.items[product.id];
          return {
            items: {
              ...s.items,
              [product.id]: {
                product,
                qty: existing ? existing.qty + 1 : 1,
              },
            },
          };
        }),
      remove: (id) =>
        set((s) => {
          const next = { ...s.items };
          delete next[id];
          return { items: next };
        }),
      decrement: (id) =>
        set((s) => {
          const existing = s.items[id];
          if (!existing) return s;
          if (existing.qty <= 1) {
            const next = { ...s.items };
            delete next[id];
            return { items: next };
          }
          return {
            items: { ...s.items, [id]: { ...existing, qty: existing.qty - 1 } },
          };
        }),
      setQty: (id, qty) =>
        set((s) => {
          if (qty <= 0) {
            const next = { ...s.items };
            delete next[id];
            return { items: next };
          }
          const existing = s.items[id];
          if (!existing) return s;
          return { items: { ...s.items, [id]: { ...existing, qty } } };
        }),
      setNote: (note) => set({ note }),
      setPayment: (payment) => set({ payment }),
      clear: () => set({ items: {}, note: "" }),
      total: () =>
        Object.values(get().items).reduce(
          (sum, it) => sum + it.product.price * it.qty,
          0
        ),
      count: () =>
        Object.values(get().items).reduce((sum, it) => sum + it.qty, 0),
    }),
    { name: "flame-cart" }
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
    { name: "flame-profile" }
  )
);
