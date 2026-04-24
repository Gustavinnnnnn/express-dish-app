import { User, Phone, MapPin, Clock, CheckCircle2, Loader2, XCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { AppShell } from "@/components/AppShell";
import { useProfile } from "@/store/cart";
import { useStoreData } from "@/store/storeData";
import { brl } from "@/lib/format";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const Perfil = () => {
  const profile = useProfile();
  const setProfile = useProfile((s) => s.set);
  const { settings } = useStoreData();
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    if (!profile.phone) { setOrders([]); return; }
    const load = async () => {
      const { data } = await supabase.from("orders")
        .select("id, code, total, status, payment_status, created_at, items, estimated_minutes")
        .eq("customer_phone", profile.phone)
        .order("created_at", { ascending: false })
        .limit(20);
      setOrders(data ?? []);
    };
    load();
    const ch = supabase.channel(`orders-${profile.phone}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "orders", filter: `customer_phone=eq.${profile.phone}` }, load)
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [profile.phone]);

  return (
    <AppShell>
      <header className="safe-top px-5 pb-2 pt-4">
        <h1 className="font-display text-2xl font-extrabold">Perfil</h1>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Seus dados e pedidos
        </p>
      </header>

      <section className="mt-4 px-5">
        <div className="flex items-center gap-3 rounded-2xl bg-gradient-card p-4 shadow-card">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-primary shadow-glow">
            <User className="h-7 w-7 text-primary-foreground" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-display text-base font-bold">
              {profile.name || "Convidado"}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {profile.phone || "Adicione seus dados"}
            </p>
          </div>
        </div>
      </section>

      <section className="mt-5 flex flex-col gap-3 px-5">
        <Field icon={<User className="h-4 w-4" />} placeholder="Seu nome"
          value={profile.name} onChange={(v) => setProfile({ name: v })} />
        <Field icon={<Phone className="h-4 w-4" />} placeholder="Telefone (WhatsApp)"
          value={profile.phone} onChange={(v) => setProfile({ phone: v })} />
        <Field icon={<MapPin className="h-4 w-4" />} placeholder="Endereço de entrega"
          value={profile.address} onChange={(v) => setProfile({ address: v })} />
      </section>

      <section className="mt-7 px-5">
        <h2 className="font-display text-lg font-bold">Meus pedidos</h2>
        {orders.length === 0 ? (
          <p className="mt-3 rounded-2xl bg-card p-5 text-center text-sm text-muted-foreground">
            {profile.phone ? "Você ainda não fez pedidos." : "Adicione seu telefone para ver seus pedidos."}
          </p>
        ) : (
          <div className="mt-3 flex flex-col gap-3">
            {orders.map((order) => <OrderCard key={order.id} order={order} />)}
          </div>
        )}
      </section>

      <footer className="mt-8 px-5 pb-2 text-center text-xs text-muted-foreground">
        <p className="font-display font-semibold">{settings?.store_name}</p>
        <p className="mt-0.5">{settings?.address}</p>
      </footer>
    </AppShell>
  );
};

const STATUS_LABEL: Record<string, { label: string; color: string }> = {
  novo: { label: "Recebido", color: "bg-blue-500/15 text-blue-400" },
  preparo: { label: "Em preparo", color: "bg-amber-500/15 text-amber-400" },
  finalizado: { label: "Entregue", color: "bg-green-500/15 text-green-500" },
  cancelado: { label: "Cancelado", color: "bg-red-500/15 text-red-400" },
};

const OrderCard = ({ order }: { order: any }) => {
  const st = STATUS_LABEL[order.status] || STATUS_LABEL.novo;
  const paid = order.payment_status === "pago";
  const pendingPay = order.payment_status === "pendente";
  const failedPay = order.payment_status === "falhou";

  return (
    <div className="rounded-2xl bg-gradient-card p-4 shadow-card">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Clock className="h-3.5 w-3.5" />
          {new Date(order.created_at).toLocaleDateString("pt-BR", {
            day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit",
          })}
          <span className="ml-1 font-mono">{order.code}</span>
        </div>
        <span className="font-display text-sm font-bold">{brl(Number(order.total))}</span>
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-1.5">
        <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${st.color}`}>{st.label}</span>
        {paid && <span className="inline-flex items-center gap-1 rounded-full bg-green-500/15 px-2 py-0.5 text-[10px] font-bold text-green-500"><CheckCircle2 className="h-3 w-3" />PAGO</span>}
        {pendingPay && <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-bold text-amber-400"><Loader2 className="h-3 w-3 animate-spin" />Aguardando pagamento</span>}
        {failedPay && <span className="inline-flex items-center gap-1 rounded-full bg-red-500/15 px-2 py-0.5 text-[10px] font-bold text-red-400"><XCircle className="h-3 w-3" />Pagamento falhou</span>}
      </div>

      {(order.status === "novo" || order.status === "preparo") && paid && (
        <p className="mt-2 text-xs text-muted-foreground">
          ⏱️ Tempo estimado: <strong className="text-foreground">~{order.estimated_minutes ?? 40} min</strong>
        </p>
      )}

      <ul className="mt-2 space-y-0.5 text-sm text-foreground/80">
        {(order.items || []).slice(0, 4).map((it: any, i: number) => (
          <li key={i}>• {it.qty}x {it.name}</li>
        ))}
      </ul>

      <Link
        to="/explorar"
        className="mt-3 block w-full rounded-full bg-gradient-primary py-2 text-center text-xs font-semibold text-primary-foreground shadow-glow"
      >
        Pedir novamente
      </Link>
    </div>
  );
};

const Field = ({ icon, placeholder, value, onChange }: {
  icon: React.ReactNode; placeholder: string; value: string; onChange: (v: string) => void;
}) => (
  <div className="flex items-center gap-3 rounded-2xl bg-card px-4 py-3 shadow-soft">
    <span className="text-muted-foreground">{icon}</span>
    <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
      className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground" />
  </div>
);

export default Perfil;
