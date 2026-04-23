import { motion } from "framer-motion";
import { Sparkles, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { AppShell } from "@/components/AppShell";
import { ProductCard, ProductChip } from "@/components/ProductCard";
import { categories, products, STORE, heroAcai } from "@/data/menu";

const Index = () => {
  const popular = products.filter((p) => p.popular);
  const byCategory = (cat: string) => products.filter((p) => p.category === cat);

  return (
    <AppShell>
      {/* Header */}
      <header className="safe-top flex items-center justify-between px-5 pb-2 pt-4">
        <div>
          <p className="text-xs text-muted-foreground">Entregar em</p>
          <button className="mt-0.5 flex items-center gap-1 font-display text-sm font-semibold">
            <MapPin className="h-4 w-4 text-primary" />
            Centro, 123
          </button>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-primary shadow-glow">
          <Sparkles className="h-5 w-5 text-primary-foreground" />
        </div>
      </header>

      {/* Hero */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="px-5 pt-3"
      >
        <Link
          to="/ofertas"
          className="relative block overflow-hidden rounded-3xl shadow-card"
        >
          <img
            src={heroAcai}
            alt="Promoção do dia"
            className="h-56 w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-hero" />
          <div className="absolute inset-x-0 bottom-0 p-5">
            <span className="inline-block rounded-full bg-primary/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-primary-foreground">
              Oferta do dia
            </span>
            <h2 className="mt-2 font-display text-2xl font-extrabold leading-tight">
              Açaí 500ml + 2 extras<br />
              <span className="text-primary-glow">por R$ 24,90</span>
            </h2>
            <button className="mt-3 rounded-full bg-gradient-primary px-5 py-2 text-sm font-semibold text-primary-foreground shadow-glow">
              Pedir agora
            </button>
          </div>
        </Link>
      </motion.section>

      {/* Categorias */}
      <section className="mt-7">
        <div className="flex items-center justify-between px-5">
          <h3 className="font-display text-lg font-bold">Categorias</h3>
        </div>
        <div className="no-scrollbar mt-3 flex gap-3 overflow-x-auto px-5 pb-1">
          {categories.map((c) => (
            <Link
              key={c.id}
              to={`/explorar?cat=${c.id}`}
              className="flex w-20 flex-shrink-0 flex-col items-center gap-1.5 rounded-2xl bg-gradient-card py-3 shadow-card"
            >
              <span className="text-2xl">{c.emoji}</span>
              <span className="text-[11px] font-medium text-muted-foreground">
                {c.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Mais pedidos */}
      <section className="mt-7">
        <div className="flex items-center justify-between px-5">
          <h3 className="font-display text-lg font-bold">Mais pedidos 🔥</h3>
          <Link to="/explorar" className="text-xs font-medium text-primary">
            Ver tudo
          </Link>
        </div>
        <div className="no-scrollbar mt-3 flex gap-3 overflow-x-auto px-5 pb-2">
          {popular.map((p) => (
            <ProductChip key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* Por categoria */}
      {categories.map((cat) => {
        const list = byCategory(cat.id);
        if (!list.length) return null;
        return (
          <section key={cat.id} className="mt-7 px-5">
            <h3 className="font-display text-lg font-bold">
              {cat.emoji} {cat.name}
            </h3>
            <div className="mt-3 flex flex-col gap-3">
              {list.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        );
      })}

      <footer className="mt-10 px-5 text-center text-xs text-muted-foreground">
        <p className="font-display font-semibold">{STORE.name}</p>
        <p className="mt-0.5">{STORE.tagline}</p>
      </footer>
    </AppShell>
  );
};

export default Index;
