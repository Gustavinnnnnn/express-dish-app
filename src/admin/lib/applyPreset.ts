import { supabase } from "@/integrations/supabase/client";
import type { DemoPreset } from "./demoPresets";

/**
 * Aplica um preset completo: substitui categorias/produtos/ofertas e
 * atualiza store_settings. As mudanças propagam ao app via Realtime.
 */
export async function applyDemoPreset(preset: DemoPreset) {
  // 1) Settings (upsert na linha única)
  const { data: existing } = await supabase
    .from("store_settings")
    .select("id")
    .limit(1)
    .maybeSingle();

  const settingsPayload = {
    store_name: preset.settings.store_name,
    tagline: preset.settings.tagline,
    primary_color: preset.settings.primary_color,
    banner_url: preset.settings.banner_url,
    logo_url: preset.settings.logo_url ?? null,
    hero_title: preset.settings.hero_title,
    hero_subtitle: preset.settings.hero_subtitle,
    default_message: preset.settings.default_message,
  };

  if (existing?.id) {
    const { error } = await supabase
      .from("store_settings")
      .update(settingsPayload)
      .eq("id", existing.id);
    if (error) throw error;
  } else {
    const { error } = await supabase.from("store_settings").insert(settingsPayload);
    if (error) throw error;
  }

  // 2) Limpa offers -> products -> categories (ordem por dependência)
  await supabase.from("offers").delete().not("id", "is", null);
  await supabase.from("products").delete().not("id", "is", null);
  await supabase.from("categories").delete().not("id", "is", null);

  // 3) Insere categorias e mapeia name -> id
  const catRows = preset.categories.map((c, i) => ({
    name: c.name,
    emoji: c.emoji,
    image_url: c.image_url ?? null,
    position: i,
    active: true,
  }));
  const { data: insertedCats, error: catErr } = await supabase
    .from("categories")
    .insert(catRows)
    .select("id, name");
  if (catErr) throw catErr;
  const catMap = new Map((insertedCats ?? []).map((c) => [c.name, c.id]));

  // 4) Insere produtos
  const prodRows = preset.products.map((p) => ({
    name: p.name,
    description: p.description,
    price: p.price,
    image_url: p.image_url,
    category_id: catMap.get(p.category) ?? null,
    featured: !!p.featured,
    active: true,
    extras: [],
  }));
  const { data: insertedProds, error: prodErr } = await supabase
    .from("products")
    .insert(prodRows)
    .select("id, name");
  if (prodErr) throw prodErr;
  const prodMap = new Map((insertedProds ?? []).map((p) => [p.name, p.id]));

  // 5) Insere ofertas
  if (preset.offers.length) {
    const offerRows = preset.offers.map((o, i) => ({
      title: o.title,
      subtitle: o.subtitle,
      price: o.price,
      old_price: o.old_price,
      image_url: o.image_url,
      product_id: o.product ? prodMap.get(o.product) ?? null : null,
      active: true,
      position: i,
    }));
    const { error: offErr } = await supabase.from("offers").insert(offerRows);
    if (offErr) throw offErr;
  }

  return true;
}
