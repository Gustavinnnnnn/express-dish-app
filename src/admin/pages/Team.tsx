import { useEffect, useState } from "react";
import { AdminLayout } from "../AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { TeamMember } from "../lib/queries";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Modal, Field } from "./Categories";

const ROLES = ["admin", "operador", "entregador"];

export default function AdminTeam() {
  const [items, setItems] = useState<TeamMember[]>([]);
  const [edit, setEdit] = useState<Partial<TeamMember> | null>(null);

  const load = async () => { const { data } = await supabase.from("team_members").select("*").order("created_at"); setItems((data as any) ?? []); };
  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!edit) return;
    const payload = { name: edit.name ?? "", email: edit.email ?? null, role: edit.role ?? "operador", active: edit.active ?? true };
    const res = edit.id ? await supabase.from("team_members").update(payload).eq("id", edit.id) : await supabase.from("team_members").insert(payload);
    if (res.error) toast.error(res.error.message); else { toast.success("Salvo"); setEdit(null); load(); }
  };
  const remove = async (id: string) => { if (!confirm("Remover usuário?")) return; await supabase.from("team_members").delete().eq("id", id); toast.success("Removido"); load(); };

  return (
    <AdminLayout title="Equipe">
      <div className="mb-5 flex justify-end">
        <button className="admin-btn admin-btn-primary" onClick={() => setEdit({ name: "", role: "operador", active: true })}><Plus className="size-4" /> Novo membro</button>
      </div>
      <div className="admin-card overflow-hidden">
        <table className="admin-table">
          <thead><tr><th>Nome</th><th>Email</th><th>Função</th><th>Status</th><th></th></tr></thead>
          <tbody>
            {items.map((m) => (
              <tr key={m.id}>
                <td className="font-medium">{m.name}</td>
                <td className="text-admin-muted">{m.email ?? "—"}</td>
                <td><span className="admin-badge capitalize" style={{ background: "hsl(var(--admin-primary) / 0.12)", color: "hsl(var(--admin-primary))" }}>{m.role}</span></td>
                <td>{m.active ? "Ativo" : "Inativo"}</td>
                <td>
                  <div className="flex justify-end gap-1">
                    <button className="admin-btn admin-btn-ghost" onClick={() => setEdit(m)}><Pencil className="size-4" /></button>
                    <button className="admin-btn admin-btn-ghost text-red-500" onClick={() => remove(m.id)}><Trash2 className="size-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
            {items.length === 0 && <tr><td colSpan={5} className="text-center text-admin-muted">Nenhum membro</td></tr>}
          </tbody>
        </table>
      </div>

      {edit && (
        <Modal title={edit.id ? "Editar membro" : "Novo membro"} onClose={() => setEdit(null)} onSave={save}>
          <Field label="Nome"><input className="admin-input" value={edit.name ?? ""} onChange={(e) => setEdit({ ...edit, name: e.target.value })} /></Field>
          <Field label="Email"><input type="email" className="admin-input" value={edit.email ?? ""} onChange={(e) => setEdit({ ...edit, email: e.target.value })} /></Field>
          <Field label="Função">
            <select className="admin-input" value={edit.role ?? "operador"} onChange={(e) => setEdit({ ...edit, role: e.target.value })}>
              {ROLES.map((r) => <option key={r} value={r} className="capitalize">{r}</option>)}
            </select>
          </Field>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={edit.active ?? true} onChange={(e) => setEdit({ ...edit, active: e.target.checked })} /> Ativo</label>
        </Modal>
      )}
    </AdminLayout>
  );
}
