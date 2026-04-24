import { useEffect, useState } from "react";
import { AdminLayout } from "../AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Order } from "../lib/queries";
import { fmtBRL } from "@/lib/format";
import { StatusBadge } from "./Dashboard";
import { toast } from "sonner";
import { X, CheckCircle2, Loader2, XCircle, MapPin } from "lucide-react";

const STATUS: Order["status"][] = ["novo", "preparo", "finalizado", "cancelado"];

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const [open, setOpen] = useState<Order | null>(null);

  const load = async () => {
    const { data } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
    setOrders((data as any) ?? []);
  };
  useEffect(() => { load(); }, []);

  // Realtime subscription
  useEffect(() => {
    const ch = supabase.channel("orders").on("postgres_changes", { event: "*", schema: "public", table: "orders" }, load).subscribe();
    return () => { supabase.removeChannel(ch); };
  }, []);

  const setStatus = async (id: string, status: Order["status"]) => {
    const { error } = await supabase.from("orders").update({ status }).eq("id", id);
    if (error) toast.error(error.message); else toast.success("Status atualizado");
  };

  const filtered = filter === "all" ? orders : orders.filter((o) => o.status === filter);

  return (
    <AdminLayout title="Pedidos">
      <div className="mb-4 flex flex-wrap gap-2">
        {[{ k: "all", l: "Todos" }, { k: "novo", l: "Novos" }, { k: "preparo", l: "Em preparo" }, { k: "finalizado", l: "Finalizados" }, { k: "cancelado", l: "Cancelados" }].map((t) => (
          <button key={t.k} onClick={() => setFilter(t.k)} className={`admin-btn ${filter === t.k ? "admin-btn-primary" : "admin-btn-outline"}`}>
            {t.l}
          </button>
        ))}
      </div>

      <div className="admin-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="admin-table">
            <thead><tr><th>Código</th><th>Cliente</th><th>Itens</th><th>Total</th><th>Status</th><th>Quando</th><th></th></tr></thead>
            <tbody>
              {filtered.length === 0 && <tr><td colSpan={7} className="text-center text-admin-muted">Sem pedidos</td></tr>}
              {filtered.map((o) => (
                <tr key={o.id} className="cursor-pointer" onClick={() => setOpen(o)}>
                  <td className="font-mono text-xs">{o.code}</td>
                  <td>{o.customer_name ?? "—"}<div className="text-xs text-admin-muted">{o.customer_phone}</div></td>
                  <td className="text-admin-muted">{(o.items ?? []).length} item(ns)</td>
                  <td className="font-semibold">
                    {fmtBRL(o.total)}
                    <PaymentBadge order={o} />
                  </td>
                  <td><StatusBadge status={o.status} /></td>
                  <td className="text-admin-muted text-xs">{new Date(o.created_at).toLocaleString("pt-BR")}</td>
                  <td onClick={(e) => e.stopPropagation()}>
                    <select className="admin-input h-8 text-xs" value={o.status} onChange={(e) => setStatus(o.id, e.target.value as any)}>
                      {STATUS.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40" onClick={() => setOpen(null)}>
          <div className="h-full w-full max-w-md overflow-y-auto bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold text-admin-fg">Pedido {open.code}</h2>
              <button onClick={() => setOpen(null)}><X className="size-5 text-admin-muted" /></button>
            </div>
            <div className="space-y-4 text-sm text-admin-fg">
              <div className="rounded-xl bg-admin-soft p-3">
                <p className="font-semibold">{open.customer_name}</p>
                <p className="text-admin-muted">{open.customer_phone}</p>
                {open.customer_address && (
                  <p className="mt-2 flex items-start gap-1.5 text-admin-muted">
                    <MapPin className="size-3.5 mt-0.5 flex-shrink-0" />
                    <span>{open.customer_address}</span>
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <PaymentBadge order={open} />
                {open.payment_method && <span className="text-xs text-admin-muted">via {open.payment_method}</span>}
              </div>
              <div>
                <p className="mb-2 text-xs font-semibold uppercase text-admin-muted">Itens</p>
                <ul className="space-y-2">
                  {(open.items ?? []).map((it: any, i: number) => (
                    <li key={i} className="flex justify-between rounded-lg border border-admin-border p-2">
                      <span>{it.qty}x {it.name}</span>
                      <span className="font-semibold">{fmtBRL((it.unitPrice ?? it.price) * (it.qty ?? 1))}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex justify-between border-t border-admin-border pt-3 font-semibold">
                <span>Total</span><span>{fmtBRL(open.total)}</span>
              </div>
              {open.notes && <p className="rounded-lg bg-admin-soft p-3 text-admin-muted">{open.notes}</p>}
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

function PaymentBadge({ order }: { order: any }) {
  const ps = order.payment_status;
  if (ps === "pago") {
    return <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-bold text-green-700"><CheckCircle2 className="size-3" />PAGO</span>;
  }
  if (ps === "pendente") {
    return <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-700"><Loader2 className="size-3 animate-spin" />Aguardando</span>;
  }
  if (ps === "falhou") {
    return <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-700"><XCircle className="size-3" />Falhou</span>;
  }
  return null;
}
