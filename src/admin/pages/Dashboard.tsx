import { useEffect, useState } from "react";
import { AdminLayout } from "../AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { ShoppingBag, DollarSign, Package, TrendingUp } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { fmtBRL } from "@/lib/format";
import { Link } from "react-router-dom";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ today: 0, revenue: 0, products: 0, total: 0 });
  const [chart, setChart] = useState<{ day: string; pedidos: number }[]>([]);
  const [recent, setRecent] = useState<any[]>([]);
  const [top, setTop] = useState<{ name: string; qty: number }[]>([]);

  useEffect(() => {
    (async () => {
      const today = new Date(); today.setHours(0,0,0,0);
      const { data: orders } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
      const { count: pCount } = await supabase.from("products").select("*", { count: "exact", head: true });
      const todays = (orders ?? []).filter((o) => new Date(o.created_at) >= today);
      const revenue = todays.reduce((s, o) => s + Number(o.total), 0);
      setStats({ today: todays.length, revenue, products: pCount ?? 0, total: orders?.length ?? 0 });
      setRecent((orders ?? []).slice(0, 5));

      // chart by day - last 7 days
      const days: { day: string; pedidos: number }[] = [];
      for (let i = 6; i >= 0; i--) {
        const d = new Date(); d.setHours(0,0,0,0); d.setDate(d.getDate() - i);
        const next = new Date(d); next.setDate(d.getDate() + 1);
        const c = (orders ?? []).filter((o) => { const t = new Date(o.created_at); return t >= d && t < next; }).length;
        days.push({ day: d.toLocaleDateString("pt-BR", { weekday: "short" }), pedidos: c });
      }
      setChart(days);

      // top products
      const counts: Record<string, number> = {};
      (orders ?? []).forEach((o: any) => (o.items ?? []).forEach((it: any) => {
        counts[it.name] = (counts[it.name] ?? 0) + (it.qty ?? 1);
      }));
      setTop(Object.entries(counts).map(([name, qty]) => ({ name, qty })).sort((a,b) => b.qty - a.qty).slice(0, 5));
    })();
  }, []);

  const cards = [
    { label: "Pedidos hoje", value: stats.today, icon: ShoppingBag, tone: "hsl(var(--admin-primary))" },
    { label: "Faturamento hoje", value: fmtBRL(stats.revenue), icon: DollarSign, tone: "hsl(var(--admin-success))" },
    { label: "Produtos ativos", value: stats.products, icon: Package, tone: "hsl(38 92% 55%)" },
    { label: "Pedidos totais", value: stats.total, icon: TrendingUp, tone: "hsl(220 80% 60%)" },
  ];

  return (
    <AdminLayout title="Dashboard">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-5">
        {cards.map((c) => (
          <div key={c.label} className="admin-card p-4 lg:p-5">
            <div className="flex items-center gap-3">
              <div className="grid size-10 place-items-center rounded-xl" style={{ background: `${c.tone.replace(")", " / 0.12)")}`, color: c.tone }}>
                <c.icon className="size-5" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-xs text-admin-muted">{c.label}</p>
                <p className="truncate font-display text-xl font-semibold lg:text-2xl">{c.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-3">
        <div className="admin-card p-5 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold">Pedidos nos últimos 7 dias</h3>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chart}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--admin-border))" />
                <XAxis dataKey="day" stroke="hsl(var(--admin-muted))" fontSize={12} />
                <YAxis stroke="hsl(var(--admin-muted))" fontSize={12} allowDecimals={false} />
                <Tooltip contentStyle={{ background: "white", border: "1px solid hsl(var(--admin-border))", borderRadius: 10 }} />
                <Line type="monotone" dataKey="pedidos" stroke="hsl(var(--admin-primary))" strokeWidth={2.5} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="admin-card p-5">
          <h3 className="mb-4 font-semibold">Mais vendidos</h3>
          {top.length === 0 ? (
            <p className="text-sm text-admin-muted">Nenhuma venda ainda.</p>
          ) : (
            <ul className="space-y-3">
              {top.map((t, i) => (
                <li key={t.name} className="flex items-center gap-3">
                  <span className="grid size-7 place-items-center rounded-md bg-admin-soft text-xs font-semibold">{i + 1}</span>
                  <span className="flex-1 truncate text-sm">{t.name}</span>
                  <span className="text-sm font-semibold text-admin-primary">{t.qty}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="admin-card mt-6 overflow-hidden">
        <div className="flex items-center justify-between p-5">
          <h3 className="font-semibold">Pedidos recentes</h3>
          <Link to="/admin/pedidos" className="text-sm font-medium text-admin-primary hover:underline">Ver todos</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="admin-table">
            <thead>
              <tr><th>Código</th><th>Cliente</th><th>Total</th><th>Status</th><th>Quando</th></tr>
            </thead>
            <tbody>
              {recent.length === 0 && (
                <tr><td colSpan={5} className="text-center text-admin-muted">Sem pedidos ainda</td></tr>
              )}
              {recent.map((o) => (
                <tr key={o.id}>
                  <td className="font-mono text-xs">{o.code}</td>
                  <td>{o.customer_name ?? "—"}</td>
                  <td className="font-semibold">{fmtBRL(o.total)}</td>
                  <td><StatusBadge status={o.status} /></td>
                  <td className="text-admin-muted">{new Date(o.created_at).toLocaleString("pt-BR")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { bg: string; fg: string; label: string }> = {
    novo: { bg: "hsl(220 80% 60% / 0.12)", fg: "hsl(220 80% 45%)", label: "Novo" },
    preparo: { bg: "hsl(38 92% 55% / 0.15)", fg: "hsl(38 92% 40%)", label: "Em preparo" },
    finalizado: { bg: "hsl(142 70% 42% / 0.15)", fg: "hsl(142 70% 32%)", label: "Finalizado" },
    cancelado: { bg: "hsl(0 75% 55% / 0.12)", fg: "hsl(0 75% 45%)", label: "Cancelado" },
  };
  const s = map[status] ?? map.novo;
  return <span className="admin-badge" style={{ background: s.bg, color: s.fg }}>{s.label}</span>;
}
