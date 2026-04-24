import { useEffect, useState } from "react";
import { AdminLayout } from "../AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Product, Category, uploadAsset } from "../lib/queries";
import { Pencil, Plus, Trash2, Upload, X, Star } from "lucide-react";
import { fmtBRL } from "@/lib/format";
import { toast } from "sonner";
import { ExtrasEditor } from "../components/ExtrasEditor";
import type { ExtraGroup } from "@/data/menu";

export default function AdminProducts() {
  const [items, setItems] = useState<Product[]>([]);
  const [cats, setCats] = useState<Category[]>([]);
  const [editing, setEditing] = useState<Partial<Product> | null>(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const [{ data: p }, { data: c }] = await Promise.all([
      supabase.from("products").select("*").order("created_at"),
      supabase.from("categories").select("*").order("position"),
    ]);
    setItems((p as any) ?? []);
    setCats((c as any) ?? []);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const remove = async (id: string) => {
    if (!confirm("Excluir este produto?")) return;
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) toast.error(error.message); else { toast.success("Produto excluído"); load(); }
  };

  return (
    <AdminLayout title="Produtos">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-admin-muted">{items.length} produtos cadastrados</p>
        <button className="admin-btn admin-btn-primary" onClick={() => setEditing({ name: "", price: 0, active: true, featured: false, extras: [] })}>
          <Plus className="size-4" /> Novo produto
        </button>
      </div>

      <div className="admin-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="admin-table">
            <thead><tr><th>Produto</th><th>Categoria</th><th>Preço</th><th>Status</th><th></th></tr></thead>
            <tbody>
              {loading && <tr><td colSpan={5} className="text-center text-admin-muted">Carregando...</td></tr>}
              {!loading && items.length === 0 && <tr><td colSpan={5} className="text-center text-admin-muted">Nenhum produto</td></tr>}
              {items.map((p) => (
                <tr key={p.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="size-10 shrink-0 overflow-hidden rounded-lg bg-admin-soft">
                        {p.image_url && <img src={p.image_url} alt="" className="size-full object-cover" />}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate font-medium">{p.name}</p>
                        {p.featured && <span className="text-xs text-admin-primary">⭐ Destaque</span>}
                      </div>
                    </div>
                  </td>
                  <td className="text-admin-muted">{cats.find((c) => c.id === p.category_id)?.name ?? "—"}</td>
                  <td className="font-semibold">{fmtBRL(p.price)}</td>
                  <td>
                    <span className="admin-badge" style={{ background: p.active ? "hsl(142 70% 42% / 0.15)" : "hsl(0 0% 50% / 0.15)", color: p.active ? "hsl(142 70% 32%)" : "hsl(0 0% 40%)" }}>
                      {p.active ? "Ativo" : "Inativo"}
                    </span>
                  </td>
                  <td>
                    <div className="flex items-center justify-end gap-1">
                      <button className="admin-btn admin-btn-ghost" onClick={() => setEditing(p)}><Pencil className="size-4" /></button>
                      <button className="admin-btn admin-btn-danger" onClick={() => remove(p.id)}><Trash2 className="size-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {editing && <ProductDrawer cats={cats} value={editing} onClose={() => setEditing(null)} onSaved={() => { setEditing(null); load(); }} />}
    </AdminLayout>
  );
}

function ProductDrawer({ value, cats, onClose, onSaved }: { value: Partial<Product>; cats: Category[]; onClose: () => void; onSaved: () => void }) {
  const [v, setV] = useState<Partial<Product>>(value);
  const [saving, setSaving] = useState(false);

  const set = (k: keyof Product, val: any) => setV((s) => ({ ...s, [k]: val }));

  const onUpload = async (file: File) => {
    const url = await uploadAsset(file, "products");
    set("image_url", url);
    toast.success("Imagem enviada");
  };

  const save = async () => {
    setSaving(true);
    const payload = {
      name: v.name ?? "",
      description: v.description ?? null,
      price: Number(v.price ?? 0),
      image_url: v.image_url ?? null,
      category_id: v.category_id ?? null,
      featured: !!v.featured,
      active: v.active ?? true,
      extras: v.extras ?? [],
    };
    const res = v.id ? await supabase.from("products").update(payload).eq("id", v.id) : await supabase.from("products").insert(payload);
    setSaving(false);
    if (res.error) toast.error(res.error.message); else { toast.success("Salvo"); onSaved(); }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40" onClick={onClose}>
      <div className="h-full w-full max-w-lg overflow-y-auto bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold text-admin-fg">{v.id ? "Editar produto" : "Novo produto"}</h2>
          <button onClick={onClose}><X className="size-5 text-admin-muted" /></button>
        </div>

        <div className="space-y-4">
          <Field label="Imagem">
            <div className="flex items-center gap-3">
              <div className="size-20 overflow-hidden rounded-xl bg-admin-soft">
                {v.image_url && <img src={v.image_url} alt="" className="size-full object-cover" />}
              </div>
              <label className="admin-btn admin-btn-outline cursor-pointer">
                <Upload className="size-4" /> Enviar imagem
                <input type="file" accept="image/*" hidden onChange={(e) => e.target.files?.[0] && onUpload(e.target.files[0])} />
              </label>
            </div>
          </Field>
          <Field label="Nome"><input className="admin-input" value={v.name ?? ""} onChange={(e) => set("name", e.target.value)} /></Field>
          <Field label="Descrição"><textarea className="admin-textarea" value={v.description ?? ""} onChange={(e) => set("description", e.target.value)} /></Field>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field label="Preço (R$)"><input className="admin-input" type="number" step="0.10" value={v.price ?? 0} onChange={(e) => set("price", parseFloat(e.target.value))} /></Field>
            <Field label="Categoria">
              <select className="admin-input" value={v.category_id ?? ""} onChange={(e) => set("category_id", e.target.value || null)}>
                <option value="">— sem categoria —</option>
                {cats.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </Field>
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-3">
            <label className="flex items-center gap-2 text-sm text-admin-fg">
              <input type="checkbox" checked={!!v.featured} onChange={(e) => set("featured", e.target.checked)} />
              <Star className="size-4 text-admin-primary" /> Destaque (mais vendidos / promoção)
            </label>
            <label className="flex items-center gap-2 text-sm text-admin-fg">
              <input type="checkbox" checked={v.active ?? true} onChange={(e) => set("active", e.target.checked)} /> Ativo
            </label>
          </div>

          <div>
            <div className="mb-2 mt-1">
              <h3 className="text-sm font-semibold text-admin-fg">Acompanhamentos / extras</h3>
              <p className="text-xs text-admin-muted">Crie categorias com itens grátis ou pagos. Funciona pra qualquer produto (não só açaí).</p>
            </div>
            <ExtrasEditor
              value={(v.extras as ExtraGroup[]) ?? []}
              onChange={(next) => set("extras", next)}
            />
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <button className="admin-btn admin-btn-outline flex-1" onClick={onClose}>Cancelar</button>
          <button className="admin-btn admin-btn-success flex-1" onClick={save} disabled={saving}>{saving ? "Salvando..." : "Salvar"}</button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block"><span className="mb-1.5 block text-xs font-medium text-admin-muted">{label}</span>{children}</label>;
}
