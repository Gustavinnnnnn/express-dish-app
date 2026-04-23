import { useEffect, useState } from "react";
import { AdminLayout } from "../AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Customer } from "../lib/queries";

export default function AdminCustomers() {
  const [items, setItems] = useState<Customer[]>([]);
  const [counts, setCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("customers").select("*").order("created_at", { ascending: false });
      setItems((data as any) ?? []);
      const { data: orders } = await supabase.from("orders").select("customer_id");
      const map: Record<string, number> = {};
      (orders ?? []).forEach((o: any) => { if (o.customer_id) map[o.customer_id] = (map[o.customer_id] ?? 0) + 1; });
      setCounts(map);
    })();
  }, []);

  return (
    <AdminLayout title="Clientes">
      <div className="admin-card overflow-hidden">
        <table className="admin-table">
          <thead><tr><th>Nome</th><th>Telefone</th><th>Endereço</th><th>Pedidos</th><th>Cadastrado</th></tr></thead>
          <tbody>
            {items.length === 0 && <tr><td colSpan={5} className="text-center text-admin-muted">Nenhum cliente cadastrado ainda</td></tr>}
            {items.map((c) => (
              <tr key={c.id}>
                <td className="font-medium">{c.name}</td>
                <td>{c.phone ?? "—"}</td>
                <td className="text-admin-muted">{c.address ?? "—"}</td>
                <td><span className="admin-badge" style={{ background: "hsl(var(--admin-primary) / 0.12)", color: "hsl(var(--admin-primary))" }}>{counts[c.id] ?? 0}</span></td>
                <td className="text-admin-muted text-xs">{new Date(c.created_at).toLocaleDateString("pt-BR")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
