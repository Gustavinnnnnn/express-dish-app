import { useEffect, useState } from "react";
import { AdminLayout } from "../AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { StoreSettings } from "../lib/queries";
import { Save, CreditCard, MessageCircle, Eye, EyeOff, ExternalLink } from "lucide-react";
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
  const mode = (s as any).payment_mode || "whatsapp";

  const save = async () => {
    setSaving(true);
    const { error } = await supabase.from("store_settings").update({
      payment_mode: mode,
      mp_access_token: (s as any).mp_access_token || null,
      mp_public_key: (s as any).mp_public_key || null,
      mp_environment: (s as any).mp_environment || "sandbox",
    } as any).eq("id", s.id);
    setSaving(false);
    if (error) toast.error(error.message); else toast.success("Configuração de pagamento salva");
  };

  return (
    <AdminLayout title="Pagamentos">
      <div className="grid gap-5 lg:grid-cols-2">
        <div className="admin-card p-5 lg:col-span-2">
          <h3 className="font-semibold">Como o cliente vai pagar?</h3>
          <p className="mt-1 text-sm text-admin-muted">Escolha o fluxo de finalização do pedido no app.</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <button
              onClick={() => set("payment_mode", "whatsapp")}
              className={`flex items-start gap-3 rounded-xl border p-4 text-left transition-all ${
                mode === "whatsapp" ? "border-admin-primary bg-admin-primary/5 ring-2 ring-admin-primary" : "border-admin-border hover:border-admin-primary/40"
              }`}
            >
              <MessageCircle className="size-6 text-green-600 flex-shrink-0" />
              <div>
                <p className="font-semibold text-admin-fg">Enviar pelo WhatsApp</p>
                <p className="mt-1 text-xs text-admin-muted">Cliente clica e o pedido vai pro seu WhatsApp. Pagamento combinado direto com você.</p>
              </div>
            </button>
            <button
              onClick={() => set("payment_mode", "online")}
              className={`flex items-start gap-3 rounded-xl border p-4 text-left transition-all ${
                mode === "online" ? "border-admin-primary bg-admin-primary/5 ring-2 ring-admin-primary" : "border-admin-border hover:border-admin-primary/40"
              }`}
            >
              <CreditCard className="size-6 text-admin-primary flex-shrink-0" />
              <div>
                <p className="font-semibold text-admin-fg">Pagar no app (Mercado Pago)</p>
                <p className="mt-1 text-xs text-admin-muted">Cliente paga no checkout (Pix, cartão, boleto). Pedido aparece como PAGO automaticamente.</p>
              </div>
            </button>
          </div>
        </div>

        {mode === "online" && (
          <div className="admin-card space-y-4 p-5 lg:col-span-2">
            <div className="flex items-center justify-between">
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

            <div className="rounded-lg bg-amber-50 border border-amber-200 p-3 text-xs text-amber-900">
              <strong>Webhook (configure no painel do Mercado Pago):</strong>
              <code className="mt-1 block break-all rounded bg-white/60 p-2 font-mono text-[11px]">
                {import.meta.env.VITE_SUPABASE_URL}/functions/v1/mp-webhook
              </code>
              <p className="mt-2">No MP: Suas integrações → sua app → Webhooks → adicione a URL acima e marque o evento <strong>payment</strong>.</p>
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 flex justify-end">
        <button className="admin-btn admin-btn-success" onClick={save} disabled={saving}><Save className="size-4" />{saving ? "Salvando..." : "Salvar"}</button>
      </div>
    </AdminLayout>
  );
}