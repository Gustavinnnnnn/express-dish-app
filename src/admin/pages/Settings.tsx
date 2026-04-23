import { useEffect, useState } from "react";
import { AdminLayout } from "../AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { StoreSettings } from "../lib/queries";
import { Save } from "lucide-react";
import { toast } from "sonner";
import { Field } from "./Categories";

const DAYS = [["seg","Segunda"],["ter","Terça"],["qua","Quarta"],["qui","Quinta"],["sex","Sexta"],["sab","Sábado"],["dom","Domingo"]];
const PAYMENTS = [{ k: "pix", l: "Pix" }, { k: "dinheiro", l: "Dinheiro" }, { k: "cartao", l: "Cartão" }];

export default function AdminSettings() {
  const [s, setS] = useState<StoreSettings | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    supabase.from("store_settings").select("*").limit(1).maybeSingle().then(({ data }) => setS(data as any));
  }, []);

  if (!s) return <AdminLayout title="Configurações"><p className="text-admin-muted">Carregando...</p></AdminLayout>;
  const set = (k: keyof StoreSettings, v: any) => setS({ ...s, [k]: v });

  const togglePay = (k: string) => {
    const cur = new Set(s.payment_methods ?? []);
    cur.has(k) ? cur.delete(k) : cur.add(k);
    set("payment_methods", Array.from(cur));
  };

  const save = async () => {
    setSaving(true);
    const { error } = await supabase.from("store_settings").update({
      whatsapp: s.whatsapp, default_message: s.default_message, address: s.address,
      hours: s.hours, payment_methods: s.payment_methods,
    }).eq("id", s.id);
    setSaving(false);
    if (error) toast.error(error.message); else toast.success("Configurações salvas");
  };

  return (
    <AdminLayout title="Configurações">
      <div className="grid gap-5 lg:grid-cols-2">
        <div className="admin-card space-y-4 p-5">
          <h3 className="font-semibold">Contato e pedido</h3>
          <Field label="WhatsApp (com DDI)"><input className="admin-input" value={s.whatsapp ?? ""} onChange={(e) => set("whatsapp", e.target.value)} placeholder="5551999999999" /></Field>
          <Field label="Endereço"><input className="admin-input" value={s.address ?? ""} onChange={(e) => set("address", e.target.value)} /></Field>
          <Field label="Mensagem padrão de pedido"><textarea className="admin-textarea" value={s.default_message ?? ""} onChange={(e) => set("default_message", e.target.value)} /></Field>
        </div>

        <div className="admin-card space-y-4 p-5">
          <h3 className="font-semibold">Métodos de pagamento</h3>
          <div className="space-y-2">
            {PAYMENTS.map((p) => (
              <label key={p.k} className="flex items-center gap-3 rounded-lg border border-admin-border p-3">
                <input type="checkbox" checked={(s.payment_methods ?? []).includes(p.k)} onChange={() => togglePay(p.k)} />
                <span className="font-medium">{p.l}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="admin-card space-y-3 p-5 lg:col-span-2">
          <h3 className="font-semibold">Horários de funcionamento</h3>
          <div className="grid gap-2 sm:grid-cols-2">
            {DAYS.map(([k, l]) => (
              <Field key={k} label={l}>
                <input className="admin-input" value={s.hours?.[k] ?? ""} onChange={(e) => set("hours", { ...s.hours, [k]: e.target.value })} placeholder="18:00-23:00 ou Fechado" />
              </Field>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <button className="admin-btn admin-btn-success" onClick={save} disabled={saving}><Save className="size-4" />{saving ? "Salvando..." : "Salvar"}</button>
      </div>
    </AdminLayout>
  );
}
