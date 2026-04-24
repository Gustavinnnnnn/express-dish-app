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

      {/* Ofertas em destaque */}
      {offers.length > 0 && active === "all" && !query && (
        <section className="mt-5 px-5">
          <div className="mb-2 flex items-center gap-1.5">
            <Tag className="h-4 w-4 text-primary" />
            <h3 className="font-display text-sm font-bold uppercase tracking-wide text-primary">Ofertas</h3>
          </div>
          <div className="no-scrollbar -mx-5 flex gap-3 overflow-x-auto px-5 pb-1">
            {offers.slice(0, 6).map((o) => (
              <Link
                key={o.id}
                to={o.product_id ? `/produto/${o.product_id}` : "/ofertas"}
                className="relative flex w-48 flex-shrink-0 flex-col overflow-hidden rounded-2xl bg-gradient-card shadow-card"
              >
                <div className="relative h-24 w-full bg-card">
                  {o.image_url ? (
                    <img src={o.image_url} alt={o.title} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-2xl">🏷️</div>
                  )}
                  <span className="absolute left-2 top-2 rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold uppercase text-primary-foreground shadow-glow">
                    Oferta
                  </span>
                </div>
                <div className="p-2.5">
                  <p className="font-display text-xs font-bold leading-tight line-clamp-1">{o.title}</p>
                  <div className="mt-1 flex items-baseline gap-1.5">
                    <span className="font-display text-sm font-extrabold text-primary">{brl(Number(o.price))}</span>
                    {o.old_price && Number(o.old_price) > Number(o.price) && (
                      <span className="text-[10px] text-muted-foreground line-through">{brl(Number(o.old_price))}</span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

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
