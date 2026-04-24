import { useEffect, useState } from "react";
import { AdminLayout } from "../AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Offer, Product } from "../lib/queries";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { fmtBRL } from "@/lib/format";
import { toast } from "sonner";
import { Modal, Field } from "./Categories";

export default function AdminOffers() {
  const [items, setItems] = useState<Offer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [edit, setEdit] = useState<Partial<Offer> | null>(null);

  const load = async () => {
    const [{ data: o }, { data: p }] = await Promise.all([
      supabase.from("offers").select("*").order("position"),
      supabase.from("products").select("*").order("name"),
    ]);
    setItems((o as any) ?? []);
    setProducts((p as any) ?? []);
  };
  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!edit) return;
    const payload = {
      title: edit.title ?? "",
      subtitle: edit.subtitle ?? null,
      price: Number(edit.price ?? 0),
      old_price: edit.old_price ? Number(edit.old_price) : null,
      product_id: edit.product_id ?? null,
      active: edit.active ?? true,
      position: edit.position ?? 0,
    };
    const res = edit.id ? await supabase.from("offers").update(payload).eq("id", edit.id) : await supabase.from("offers").insert(payload);
    if (res.error) toast.error(res.error.message); else { toast.success("Oferta salva"); setEdit(null); load(); }
  };

  const remove = async (id: string) => {
    if (!confirm("Excluir oferta?")) return;
    await supabase.from("offers").delete().eq("id", id);
    toast.success("Excluída"); load();
  };

  return (
    <AdminLayout title="Ofertas">
      <div className="mb-5 flex justify-end">
        <button className="admin-btn admin-btn-primary" onClick={() => setEdit({ title: "", price: 0, active: true, position: items.length + 1 })}>
          <Plus className="size-4" /> Nova oferta
        </button>
      </div>

      <div className="admin-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="admin-table">
            <thead><tr><th>Oferta</th><th>Produto</th><th>Preço</th><th>De</th><th>Status</th><th></th></tr></thead>
            <tbody>
              {items.map((o) => (
                <tr key={o.id}>
                  <td><div className="font-medium">{o.title}</div><div className="text-xs text-admin-muted">{o.subtitle}</div></td>
                  <td className="text-admin-muted">{products.find((p) => p.id === o.product_id)?.name ?? "—"}</td>
                  <td className="font-semibold">{fmtBRL(o.price)}</td>
                  <td className="text-admin-muted line-through">{o.old_price ? fmtBRL(o.old_price) : "—"}</td>
                  <td>{o.active ? "Ativa" : "Inativa"}</td>
                  <td>
                    <div className="flex items-center justify-end gap-1">
                      <button className="admin-btn admin-btn-ghost" onClick={() => setEdit(o)}><Pencil className="size-4" /></button>
                      <button className="admin-btn admin-btn-danger" onClick={() => remove(o.id)}><Trash2 className="size-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {items.length === 0 && <tr><td colSpan={6} className="text-center text-admin-muted">Nenhuma oferta</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {edit && (
        <Modal title={edit.id ? "Editar oferta" : "Nova oferta"} onClose={() => setEdit(null)} onSave={save}>
          <Field label="Título"><input className="admin-input" value={edit.title ?? ""} onChange={(e) => setEdit({ ...edit, title: e.target.value })} /></Field>
          <Field label="Subtítulo"><input className="admin-input" value={edit.subtitle ?? ""} onChange={(e) => setEdit({ ...edit, subtitle: e.target.value })} /></Field>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field label="Preço"><input type="number" step="0.10" className="admin-input" value={edit.price ?? 0} onChange={(e) => setEdit({ ...edit, price: parseFloat(e.target.value) })} /></Field>
            <Field label="Preço antigo"><input type="number" step="0.10" className="admin-input" value={edit.old_price ?? ""} onChange={(e) => setEdit({ ...edit, old_price: e.target.value ? parseFloat(e.target.value) : undefined })} /></Field>
          </div>
          <Field label="Produto vinculado">
            <select className="admin-input" value={edit.product_id ?? ""} onChange={(e) => setEdit({ ...edit, product_id: e.target.value || null })}>
              <option value="">— nenhum —</option>
              {products.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </Field>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={edit.active ?? true} onChange={(e) => setEdit({ ...edit, active: e.target.checked })} /> Ativa</label>
        </Modal>
      )}
    </AdminLayout>
  );
}
