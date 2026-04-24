import { useEffect, useState } from "react";
import { AdminLayout } from "../AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Category } from "../lib/queries";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function AdminCategories() {
  const [items, setItems] = useState<Category[]>([]);
  const load = async () => {
    const { data } = await supabase.from("categories").select("*").order("position");
    setItems((data as any) ?? []);
  };
  useEffect(() => { load(); }, []);

  const save = async (c: Partial<Category>) => {
    const payload = { name: c.name!, emoji: c.emoji ?? null, position: c.position ?? 0, active: c.active ?? true };
    const res = c.id ? await supabase.from("categories").update(payload).eq("id", c.id) : await supabase.from("categories").insert(payload);
    if (res.error) toast.error(res.error.message); else { toast.success("Salvo"); load(); }
  };
  const remove = async (id: string) => {
    if (!confirm("Excluir categoria?")) return;
    const { error } = await supabase.from("categories").delete().eq("id", id);
    if (error) toast.error(error.message); else { toast.success("Excluída"); load(); }
  };

  const [edit, setEdit] = useState<Partial<Category> | null>(null);

  return (
    <AdminLayout title="Categorias">
      <div className="mb-5 flex justify-end">
        <button className="admin-btn admin-btn-primary" onClick={() => setEdit({ name: "", emoji: "🍴", position: items.length + 1, active: true })}>
          <Plus className="size-4" /> Nova categoria
        </button>
      </div>

      <div className="admin-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="admin-table">
            <thead><tr><th>Ordem</th><th>Categoria</th><th>Status</th><th></th></tr></thead>
            <tbody>
              {items.map((c) => (
                <tr key={c.id}>
                  <td className="text-admin-muted">{c.position}</td>
                  <td><span className="mr-2 text-2xl">{c.emoji}</span>{c.name}</td>
                  <td>{c.active ? "Ativa" : "Inativa"}</td>
                  <td>
                    <div className="flex items-center justify-end gap-1">
                      <button className="admin-btn admin-btn-ghost" onClick={() => setEdit(c)}><Pencil className="size-4" /></button>
                      <button className="admin-btn admin-btn-danger" onClick={() => remove(c.id)}><Trash2 className="size-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {items.length === 0 && <tr><td colSpan={4} className="text-center text-admin-muted">Nenhuma categoria</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {edit && (
        <Modal title={edit.id ? "Editar categoria" : "Nova categoria"} onClose={() => setEdit(null)} onSave={() => { save(edit); setEdit(null); }}>
          <Field label="Nome"><input className="admin-input" value={edit.name ?? ""} onChange={(e) => setEdit({ ...edit, name: e.target.value })} /></Field>
          <Field label="Emoji"><input className="admin-input" value={edit.emoji ?? ""} onChange={(e) => setEdit({ ...edit, emoji: e.target.value })} /></Field>
          <Field label="Ordem de exibição"><input type="number" className="admin-input" value={edit.position ?? 0} onChange={(e) => setEdit({ ...edit, position: parseInt(e.target.value) })} /></Field>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={edit.active ?? true} onChange={(e) => setEdit({ ...edit, active: e.target.checked })} /> Ativa</label>
        </Modal>
      )}
    </AdminLayout>
  );
}

export function Modal({ title, children, onClose, onSave }: { title: string; children: React.ReactNode; onClose: () => void; onSave: () => void }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4" onClick={onClose}>
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <h3 className="mb-4 font-display text-lg font-semibold text-admin-fg">{title}</h3>
        <div className="space-y-3">{children}</div>
        <div className="mt-5 flex gap-2">
          <button className="admin-btn admin-btn-outline flex-1" onClick={onClose}>Cancelar</button>
          <button className="admin-btn admin-btn-success flex-1" onClick={onSave}>Salvar</button>
        </div>
      </div>
    </div>
  );
}

export function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block"><span className="mb-1.5 block text-xs font-medium text-admin-muted">{label}</span>{children}</label>;
}
