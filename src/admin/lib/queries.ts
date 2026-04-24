import { supabase } from "@/integrations/supabase/client";

export type Category = {
  id: string;
  name: string;
  emoji: string | null;
  image_url: string | null;
  position: number;
  active: boolean;
};

export type Product = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  category_id: string | null;
  featured: boolean;
  active: boolean;
  extras: any;
};

export type Offer = {
  id: string;
  title: string;
  subtitle: string | null;
  price: number;
  old_price: number | null;
  image_url: string | null;
  product_id: string | null;
  active: boolean;
  position: number;
};

export type Order = {
  id: string;
  code: string;
  customer_name: string | null;
  customer_phone: string | null;
  items: any;
  total: number;
  status: "novo" | "preparo" | "finalizado" | "cancelado";
  payment_method: string | null;
  notes: string | null;
  created_at: string;
  payment_status?: string | null;
  mp_preference_id?: string | null;
  mp_payment_id?: string | null;
  customer_address?: string | null;
  estimated_minutes?: number | null;
};

export type Customer = {
  id: string;
  name: string;
  phone: string | null;
  address: string | null;
  notes: string | null;
  created_at: string;
};

export type TeamMember = {
  id: string;
  name: string;
  email: string | null;
  role: string;
  active: boolean;
};

export type StoreSettings = {
  id: string;
  store_name: string;
  tagline: string | null;
  logo_url: string | null;
  banner_url: string | null;
  primary_color: string;
  whatsapp: string | null;
  address: string | null;
  default_message: string | null;
  hours: Record<string, string>;
  payment_methods: string[];
  hero_title: string | null;
  hero_subtitle: string | null;
  payment_mode?: "whatsapp" | "online";
  mp_access_token?: string | null;
  mp_public_key?: string | null;
  mp_environment?: "sandbox" | "production";
};

export async function uploadAsset(file: File, prefix = "img") {
  const ext = file.name.split(".").pop();
  const path = `${prefix}/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from("store-assets").upload(path, file, { upsert: true });
  if (error) throw error;
  const { data } = supabase.storage.from("store-assets").getPublicUrl(path);
  return data.publicUrl;
}
