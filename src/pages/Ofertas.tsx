import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { AppShell } from "@/components/AppShell";
import { useStoreData } from "@/store/storeData";
import { brl } from "@/lib/format";

const Ofertas = () => {
  const { offers, loading } = useStoreData();

  return (
    <AppShell>
      <header className="safe-top px-5 pb-2 pt-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-primary" />
          <h1 className="font-display text-2xl font-extrabold">Ofertas</h1>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">Combos especiais — só hoje</p>
      </header>

      <section className="mt-5 flex flex-col gap-4 px-5">
        {loading && <p className="py-10 text-center text-sm text-muted-foreground">Carregando...</p>}
        {!loading && offers.length === 0 && (
          <p className="py-10 text-center text-sm text-muted-foreground">Nenhuma oferta no momento.</p>
        )}
        {offers.map((o, i) => {
          const discount = o.old_price ? Math.round(((o.old_price - o.price) / o.old_price) * 100) : 0;
          return (
            <motion.div
              key={o.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="relative overflow-hidden rounded-3xl bg-gradient-card shadow-card"
            >
              <div className="relative w-full overflow-hidden bg-card">
                <img
                  src={o.image_url || "/placeholder.svg"}
                  alt={o.title}
                  loading="lazy"
                  className="max-h-72 w-full object-contain"
                />
                <div className="absolute inset-0 bg-gradient-hero" />
                {discount > 0 && (
                  <span className="absolute left-3 top-3 rounded-full bg-primary px-2.5 py-1 text-[11px] font-bold text-primary-foreground shadow-glow">
                    -{discount}%
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between p-4">
                <div>
                  <h3 className="font-display text-lg font-bold leading-tight">{o.title}</h3>
                  {o.subtitle && <p className="mt-0.5 text-xs text-muted-foreground">{o.subtitle}</p>}
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="font-display text-xl font-extrabold text-primary">{brl(o.price)}</span>
                    {o.old_price && (
                      <span className="text-xs text-muted-foreground line-through">{brl(o.old_price)}</span>
                    )}
                  </div>
                </div>
                {o.product_id && (
                  <Link
                    to={`/produto/${o.product_id}`}
                    className="rounded-full bg-gradient-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow active:scale-95"
                  >
                    Montar
                  </Link>
                )}
              </div>
            </motion.div>
          );
        })}
      </section>
    </AppShell>
  );
};

export default Ofertas;
