import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Clock, CheckCircle2, Loader2, XCircle, ShoppingBag } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/store/cart";
import { useStoreData } from "@/store/storeData";
import { brl } from "@/lib/format";
import { supabase } from "@/integrations/supabase/client";

const Pedidos = () => {
  const { user, profile } = useAuth();
  const guest = useProfile();
  const { settings } = useStoreData();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // procura pedidos por user_id (logado) ou por phone (convidado)
  const phone = profile?.phone || guest.phone;

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      let query = supabase.from("orders")
        .select("id, code, total, status, payment_status, created_at, items, estimated_minutes, user_id, customer_phone")
        .order("created_at", { ascending: false })
        .limit(30);

      if (user) {
        // pedidos do usuário OU pedidos antigos com mesmo telefone
        const phones = phone ? `,customer_phone.eq.${phone}` : "";
        query = query.or(`user_id.eq.${user.id}${phones}`);
      } else if (phone) {
        query = query.eq("customer_phone", phone);
      } else {
        if (mounted) { setOrders([]); setLoading(false); }
        return;
      }

      const { data } = await query;
      if (mounted) {
        setOrders(data ?? []);
        setLoading(false);
      }
    };
    load();

    const filter = user ? `user_id=eq.${user.id}` : phone ? `customer_phone=eq.${phone}` : null;
    if (!filter) return;
    const ch = supabase.channel(`my-orders`)
      .on("postgres_changes", { event: "*", schema: "public", table: "orders", filter }, load)
      .subscribe();
    return () => { mounted = false; supabase.removeChannel(ch); };
  }, [user?.id, phone]);

  return (
    <AppShell>
      <header className="safe-top px-5 pb-2 pt-4">
        <h1 className="font-display text-2xl font-extrabold">Meus pedidos</h1>
        <p className="mt-0.5 text-sm text-muted-foreground">
          {orders.length > 0 ? `${orders.length} pedido${orders.length > 1 ? "s" : ""}` : "Acompanhe em tempo real"}
        </p>
      </header>

      <main className="mt-4 px-5">
        {loading ? (
          <p className="py-10 text-center text-sm text-muted-foreground">Carregando...</p>
        ) : orders.length === 0 ? (
          <EmptyState hasIdentity={!!(user || phone)} />
        ) : (
          <div className="flex flex-col gap-3">
            {orders.map((o) => <OrderCard key={o.id} order={o} />)}
          </div>
        )}
      </main>

      <footer className="mt-8 px-5 pb-2 text-center text-xs text-muted-foreground">
        <p className="font-display font-semibold">{settings?.store_name}</p>
      </footer>
    </AppShell>
  );
};

const EmptyState = ({ hasIdentity }: { hasIdentity: boolean }) => (
  <div className="flex flex-col items-center justify-center pt-16 text-center">
    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-card">
      <ShoppingBag className="h-9 w-9 text-muted-foreground" />
    </div>
    <h2 className="mt-5 font-display text-xl font-bold">Nenhum pedido ainda</h2>
    <p className="mt-1 text-sm text-muted-foreground">
      {hasIdentity ? "Seus próximos pedidos aparecerão aqui." : "Faça login ou seu primeiro pedido para acompanhar."}
    </p>
    <div className="mt-6 flex gap-2">
      <Link to="/explorar" className="rounded-full bg-gradient-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-glow">
        Ver cardápio
      </Link>
      {!hasIdentity && (
        <Link to="/auth" className="rounded-full bg-card px-6 py-3 text-sm font-semibold">
          Entrar
        </Link>
      )}
    </div>
  </div>
);

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

export default Pedidos;
