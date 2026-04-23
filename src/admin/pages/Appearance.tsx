import { useEffect, useState } from "react";
import { AdminLayout } from "../AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { StoreSettings, uploadAsset } from "../lib/queries";
import { Smartphone, Monitor, Upload, RefreshCw, Save } from "lucide-react";
import { toast } from "sonner";
import { Field } from "./Categories";

export default function AdminAppearance() {
  const [s, setS] = useState<StoreSettings | null>(null);
  const [view, setView] = useState<"mobile" | "desktop">("mobile");
  const [previewKey, setPreviewKey] = useState(0);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    supabase.from("store_settings").select("*").limit(1).maybeSingle().then(({ data }) => setS(data as any));
  }, []);

  if (!s) return <AdminLayout title="Aparência"><p className="text-admin-muted">Carregando...</p></AdminLayout>;

  const set = (k: keyof StoreSettings, v: any) => setS({ ...s, [k]: v });

  const upload = async (file: File, key: "logo_url" | "banner_url") => {
    const url = await uploadAsset(file, key);
    set(key, url);
    toast.success("Imagem enviada");
  };

  const publish = async () => {
    setSaving(true);
    const { error } = await supabase.from("store_settings").update({
      store_name: s.store_name, tagline: s.tagline, logo_url: s.logo_url, banner_url: s.banner_url,
      primary_color: s.primary_color, hero_title: s.hero_title, hero_subtitle: s.hero_subtitle,
    }).eq("id", s.id);
    setSaving(false);
    if (error) toast.error(error.message); else { toast.success("Aparência publicada!"); setPreviewKey((k) => k + 1); }
  };

  return (
    <AdminLayout title="Aparência">
      <div className="grid gap-5 lg:grid-cols-[400px_1fr]">
        {/* Editor */}
        <div className="admin-card space-y-4 p-5">
          <Field label="Nome da loja"><input className="admin-input" value={s.store_name} onChange={(e) => set("store_name", e.target.value)} /></Field>
          <Field label="Slogan"><input className="admin-input" value={s.tagline ?? ""} onChange={(e) => set("tagline", e.target.value)} /></Field>
          <Field label="Cor principal (HSL)">
            <div className="flex gap-2">
              <input className="admin-input flex-1" value={s.primary_color} onChange={(e) => set("primary_color", e.target.value)} placeholder="280 75% 55%" />
              <div className="size-10 rounded-lg border border-admin-border" style={{ background: `hsl(${s.primary_color})` }} />
            </div>
            <p className="mt-1 text-xs text-admin-muted">Exemplos: 280 75% 55% (roxo), 142 70% 45% (verde), 25 95% 55% (laranja)</p>
          </Field>

          <Field label="Logo">
            <div className="flex items-center gap-3">
              <div className="size-16 overflow-hidden rounded-xl bg-admin-soft">{s.logo_url && <img src={s.logo_url} className="size-full object-contain" alt="" />}</div>
              <label className="admin-btn admin-btn-outline cursor-pointer"><Upload className="size-4" />Enviar<input type="file" accept="image/*" hidden onChange={(e) => e.target.files?.[0] && upload(e.target.files[0], "logo_url")} /></label>
            </div>
          </Field>

          <Field label="Banner">
            <div className="space-y-2">
              <div className="aspect-[16/9] overflow-hidden rounded-xl bg-admin-soft">{s.banner_url && <img src={s.banner_url} className="size-full object-cover" alt="" />}</div>
              <label className="admin-btn admin-btn-outline cursor-pointer w-full"><Upload className="size-4" />Enviar banner<input type="file" accept="image/*" hidden onChange={(e) => e.target.files?.[0] && upload(e.target.files[0], "banner_url")} /></label>
            </div>
          </Field>

          <Field label="Título da home"><input className="admin-input" value={s.hero_title ?? ""} onChange={(e) => set("hero_title", e.target.value)} /></Field>
          <Field label="Subtítulo da home"><input className="admin-input" value={s.hero_subtitle ?? ""} onChange={(e) => set("hero_subtitle", e.target.value)} /></Field>

          <button className="admin-btn admin-btn-success w-full" onClick={publish} disabled={saving}>
            <Save className="size-4" />{saving ? "Publicando..." : "Publicar alterações"}
          </button>
        </div>

        {/* Preview */}
        <div className="admin-card flex flex-col p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold">Pré-visualização</h3>
            <div className="flex gap-1 rounded-lg bg-admin-soft p-1">
              <button onClick={() => setView("mobile")} className={`flex items-center gap-1 rounded-md px-3 py-1.5 text-sm ${view === "mobile" ? "bg-white shadow-sm" : "text-admin-muted"}`}><Smartphone className="size-4" />Celular</button>
              <button onClick={() => setView("desktop")} className={`flex items-center gap-1 rounded-md px-3 py-1.5 text-sm ${view === "desktop" ? "bg-white shadow-sm" : "text-admin-muted"}`}><Monitor className="size-4" />Desktop</button>
              <button onClick={() => setPreviewKey((k) => k + 1)} className="ml-1 rounded-md px-2 py-1.5 text-admin-muted hover:bg-white" title="Atualizar"><RefreshCw className="size-4" /></button>
            </div>
          </div>
          <div className="flex flex-1 items-center justify-center rounded-xl bg-admin-soft p-4">
            <div className={`overflow-hidden rounded-2xl border border-admin-border bg-white shadow-lg transition-all ${view === "mobile" ? "h-[640px] w-[360px]" : "h-[640px] w-full max-w-4xl"}`}>
              <iframe key={previewKey} src="/" className="size-full" title="Preview" />
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
