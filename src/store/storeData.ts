import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { ExtraGroup } from "@/data/menu";

export type DbCategory = { id: string; name: string; emoji: string | null; image_url: string | null; position: number; active: boolean };
export type DbProduct = {
  id: string; name: string; description: string | null; price: number;
  image_url: string | null; category_id: string | null;
  featured: boolean; active: boolean; extras: ExtraGroup[];
};
export type DbOffer = {
  id: string; title: string; subtitle: string | null;
  price: number; old_price: number | null; image_url: string | null;
  product_id: string | null; active: boolean; position: number;
};
export type DbSettings = {
  id: string; store_name: string; tagline: string | null;
  logo_url: string | null; banner_url: string | null;
  primary_color: string; whatsapp: string | null; address: string | null;
  default_message: string | null; hero_title: string | null; hero_subtitle: string | null;
  hours: Record<string, string>; payment_methods: string[];
  payment_mode?: "whatsapp" | "online";
  mp_public_key?: string | null;
  mp_environment?: "sandbox" | "production";
};

/** Compat shim — front-end antigo espera "image" e "category" string */
export type FrontProduct = DbProduct & { image: string; category: string; description: string };

const PLACEHOLDER = "/placeholder.svg";

export function useStoreData() {
  const [settings, setSettings] = useState<DbSettings | null>(null);
  const [categories, setCategories] = useState<DbCategory[]>([]);
  const [products, setProducts] = useState<FrontProduct[]>([]);
  const [offers, setOffers] = useState<DbOffer[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const [s, c, p, o] = await Promise.all([
      supabase.from("store_settings").select("*").limit(1).maybeSingle(),
      supabase.from("categories").select("*").eq("active", true).order("position", { ascending: true }),
      supabase.from("products").select("*").eq("active", true).order("created_at", { ascending: true }),
      supabase.from("offers").select("*").eq("active", true).order("position", { ascending: true }),
    ]);
    setSettings(s.data as any);
    setCategories((c.data ?? []) as any);
    setOffers((o.data ?? []) as any);
    setProducts(((p.data ?? []) as any[]).map((row) => ({
      ...row,
      image: row.image_url || PLACEHOLDER,
      category: row.category_id ?? "",
      description: row.description ?? "",
    })));
    setLoading(false);
  };

  useEffect(() => {
    load();
    // Realtime: qualquer alteração no admin reflete no app
    const ch = supabase.channel("store-data")
      .on("postgres_changes", { event: "*", schema: "public", table: "store_settings" }, load)
      .on("postgres_changes", { event: "*", schema: "public", table: "categories" }, load)
      .on("postgres_changes", { event: "*", schema: "public", table: "products" }, load)
      .on("postgres_changes", { event: "*", schema: "public", table: "offers" }, load)
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, []);

  // Aplica cor primária dinamicamente
  useEffect(() => {
    if (settings?.primary_color) {
      document.documentElement.style.setProperty("--primary", settings.primary_color);
    }
    if (settings?.store_name) {
      document.title = settings.store_name;
    }
  }, [settings?.primary_color, settings?.store_name]);

  return { settings, categories, products, offers, loading, reload: load };
}
