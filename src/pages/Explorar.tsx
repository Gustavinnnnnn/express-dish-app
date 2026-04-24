import { useMemo, useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Search, Tag } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { ProductCard } from "@/components/ProductCard";
import { useStoreData } from "@/store/storeData";
import { brl } from "@/lib/format";

const Explorar = () => {
  const { categories, products, offers, loading } = useStoreData();
  const [params, setParams] = useSearchParams();
  const initialCat = params.get("cat") ?? "all";
  const [active, setActive] = useState<string>(initialCat);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const next = new URLSearchParams(params);
    if (active === "all") next.delete("cat");
    else next.set("cat", active);
    setParams(next, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  const list = useMemo(() => {
    return products.filter((p) => {
      const inCat = active === "all" || p.category_id === active;
      const inQuery =
        !query ||
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        (p.description ?? "").toLowerCase().includes(query.toLowerCase());
      return inCat && inQuery;
    });
  }, [active, query, products]);

  return (
    <AppShell>
      <header className="safe-top px-5 pb-2 pt-4">
        <h1 className="font-display text-2xl font-extrabold">Explorar</h1>
        <p className="mt-0.5 text-sm text-muted-foreground">Cardápio completo</p>

        <div className="mt-4 flex items-center gap-2 rounded-2xl bg-card px-4 py-3 shadow-soft">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar no cardápio..."
            className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>
      </header>

      <div className="no-scrollbar mt-4 flex gap-2 overflow-x-auto px-5 pb-1">
        <CategoryPill label="Tudo" active={active === "all"} onClick={() => setActive("all")} />
        {categories.map((c) => (
          <CategoryPill
            key={c.id}
            label={`${c.emoji ?? ""} ${c.name}`}
            active={active === c.id}
            onClick={() => setActive(c.id)}
          />
        ))}
      </div>

      <section className="mt-5 flex flex-col gap-3 px-5">
        {loading && <p className="py-10 text-center text-sm text-muted-foreground">Carregando...</p>}
        {!loading && list.length === 0 && (
          <p className="py-10 text-center text-sm text-muted-foreground">Nada encontrado.</p>
        )}
        {list.map((p) => <ProductCard key={p.id} product={p} />)}
      </section>
    </AppShell>
  );
};

const CategoryPill = ({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) => (
  <button
    onClick={onClick}
    className={`flex-shrink-0 rounded-full px-4 py-2 text-xs font-semibold transition-all ${
      active ? "bg-gradient-primary text-primary-foreground shadow-glow" : "bg-card text-muted-foreground"
    }`}
  >
    {label}
  </button>
);

export default Explorar;
