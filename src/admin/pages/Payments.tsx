import { useEffect, useState } from "react";
import { AdminLayout } from "../AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { StoreSettings } from "../lib/queries";
import { Save, Eye, EyeOff, ExternalLink, CreditCard } from "lucide-react";
import { toast } from "sonner";
import { Field } from "./Categories";

export default function AdminPayments() {
  const [s, setS] = useState<StoreSettings | null>(null);
  const [saving, setSaving] = useState(false);
  const [showToken, setShowToken] = useState(false);

  useEffect(() => {
    supabase.from("store_settings").select("*").limit(1).maybeSingle().then(({ data }) => setS(data as any));
  }, []);

  if (!s) return <AdminLayout title="Pagamentos"><p className="text-admin-muted">Carregando...</p></AdminLayout>;
  const set = (k: string, v: any) => setS({ ...s, [k]: v } as any);

  const save = async () => {
    setSaving(true);
    const { error } = await supabase.from("store_settings").update({
      mp_access_token: (s as any).mp_access_token || null,
      mp_public_key: (s as any).mp_public_key || null,
      mp_environment: (s as any).mp_environment || "sandbox",
    } as any).eq("id", s.id);
    setSaving(false);
    if (error) toast.error(error.message); else toast.success("Credenciais salvas");
  };

  return (
    <AdminLayout title="Pagamentos">
      <div className="grid gap-5">
          <div className="admin-card p-5">
          <div className="flex items-start gap-3">
            <div className="grid size-10 place-items-center rounded-xl bg-admin-primary/10 text-admin-primary flex-shrink-0">
              <CreditCard className="size-5" />
            </div>
            <div>
              <h3 className="font-semibold">Como funciona</h3>
              <p className="mt-1 text-sm text-admin-muted">
                No checkout o cliente escolhe a forma de pagamento:
              </p>
              <ul className="mt-2 space-y-1 text-sm text-admin-muted">
                <li>• <strong className="text-admin-fg">Pix</strong> ou <strong className="text-admin-fg">Cartão</strong> → pagamento online pelo Mercado Pago</li>
                <li>• <strong className="text-admin-fg">Dinheiro</strong> → pedido enviado pelo WhatsApp pra combinar troco</li>
              </ul>
            </div>
          </div>
        </div>

          <div className="admin-card space-y-4 p-5">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <h3 className="font-semibold">Credenciais do Mercado Pago</h3>
            <a href="https://www.mercadopago.com.br/developers/panel/app" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs font-medium text-admin-primary hover:underline">
              Onde pegar? <ExternalLink className="size-3" />
            </a>
          </div>
          <p className="text-sm text-admin-muted">
            Crie uma aplicação em <strong>mercadopago.com.br/developers</strong> → Suas integrações → Criar aplicação → copie as credenciais e cole abaixo.
          </p>

          <Field label="Ambiente">
            <select className="admin-input" value={(s as any).mp_environment || "sandbox"} onChange={(e) => set("mp_environment", e.target.value)}>
              <option value="sandbox">Teste (sandbox)</option>
              <option value="production">Produção (cobra de verdade)</option>
            </select>
          </Field>

          <Field label="Public Key">
            <input className="admin-input" value={(s as any).mp_public_key ?? ""} onChange={(e) => set("mp_public_key", e.target.value)} placeholder="APP_USR-xxxxxxxx-xxxx-xxxx..." />
          </Field>

          <Field label="Access Token (secreto)">
            <div className="relative">
              <input className="admin-input pr-10" type={showToken ? "text" : "password"} value={(s as any).mp_access_token ?? ""} onChange={(e) => set("mp_access_token", e.target.value)} placeholder="APP_USR-xxxxxxxx..." />
              <button type="button" onClick={() => setShowToken((v) => !v)} className="absolute right-2 top-1/2 -translate-y-1/2 text-admin-muted">
                {showToken ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </Field>

          <div className="rounded-lg border border-admin-border bg-admin-soft p-3 text-xs text-admin-fg">
            <strong>Webhook (configure no painel do Mercado Pago):</strong>
            <code className="mt-1 block break-all rounded bg-admin-card p-2 font-mono text-[11px] text-admin-fg">
              {import.meta.env.VITE_SUPABASE_URL}/functions/v1/mp-webhook
            </code>
            <p className="mt-2">No MP: Suas integrações → sua app → Webhooks → adicione a URL acima e marque o evento <strong>payment</strong>.</p>
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <button className="admin-btn admin-btn-success" onClick={save} disabled={saving}><Save className="size-4" />{saving ? "Salvando..." : "Salvar"}</button>
      </div>
    </AdminLayout>
  );
}
