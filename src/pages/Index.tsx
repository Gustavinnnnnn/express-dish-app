import { motion } from "framer-motion";
import { Sparkles, MapPin, Tag } from "lucide-react";
import { Link } from "react-router-dom";
import { AppShell } from "@/components/AppShell";
import { ProductCard, ProductChip } from "@/components/ProductCard";
import { InstallAppButton } from "@/components/InstallAppButton";
import { useStoreData } from "@/store/storeData";
import { brl } from "@/lib/format";
import heroFallback from "@/assets/hero-acai.jpg";

const Index = () => {
  const { settings, categories, products, offers, loading } = useStoreData();

  if (loading) {
    return (
      <AppShell>
        <div className="flex min-h-[60vh] items-center justify-center">
          <p className="text-sm text-muted-foreground">Carregando...</p>
        </div>
      </AppShell>
    );
  }

  const popular = products.filter((p) => p.featured);
  const byCategory = (cat: string) => products.filter((p) => p.category_id === cat);
  const featuredOffer = offers[0];
  const heroImage = settings?.banner_url || featuredOffer?.image_url || heroFallback;
  const heroTitle = settings?.hero_title || "Açaí cremoso na sua porta";
  const heroSubtitle = settings?.hero_subtitle || "Monte do seu jeito";

  return (
    <AppShell>
      <InstallAppButton />
      {/* Header */}
      <header className="safe-top flex items-center justify-between px-5 pb-2 pt-4">
        <div>
          <p className="text-xs text-muted-foreground">Entregar em</p>
          <button className="mt-0.5 flex items-center gap-1 font-display text-sm font-semibold">
            <MapPin className="h-4 w-4 text-primary" />
            {settings?.address?.split("—")[0]?.trim() || "Centro"}
          </button>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-primary shadow-glow">
          {settings?.logo_url ? (
            <img src={settings.logo_url} alt={settings.store_name} className="h-full w-full rounded-full object-cover" />
          ) : (
            <Sparkles className="h-5 w-5 text-primary-foreground" />
          )}
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
          to={featuredOffer?.product_id ? `/produto/${featuredOffer.product_id}` : "/ofertas"}
          className="relative block h-72 overflow-hidden rounded-3xl shadow-card"
        >
          <img src={heroImage} alt={heroTitle} className="h-full w-full bg-card object-cover" />
          <div className="absolute inset-0 bg-gradient-hero" />
          <div className="absolute inset-x-0 bottom-0 p-5">
            <span className="inline-block rounded-full bg-primary/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-primary-foreground">
              {featuredOffer ? "Oferta do dia" : "Destaque"}
            </span>
            <h2 className="mt-2 font-display text-2xl font-extrabold leading-tight">
              {heroTitle}<br />
              <span className="text-primary-glow">{heroSubtitle}</span>
            </h2>
            <button className="mt-3 rounded-full bg-gradient-primary px-5 py-2 text-sm font-semibold text-primary-foreground shadow-glow">
              Pedir agora
            </button>
          </div>
        </Link>
      </motion.section>

      {/* Ofertas em destaque */}
      {offers.length > 0 && (
        <section className="mt-7">
          <div className="flex items-center justify-between px-5">
            <h3 className="flex items-center gap-1.5 font-display text-lg font-bold">
              <Tag className="h-4 w-4 text-primary" /> Ofertas
            </h3>
            <Link to="/ofertas" className="text-xs font-medium text-primary">Ver todas</Link>
          </div>
          <div className="no-scrollbar mt-3 flex gap-3 overflow-x-auto px-5 pb-2">
            {offers.slice(0, 6).map((o) => (
              <Link
                key={o.id}
                to={o.product_id ? `/produto/${o.product_id}` : "/ofertas"}
                className="relative flex w-56 flex-shrink-0 flex-col overflow-hidden rounded-2xl bg-gradient-card shadow-card"
              >
                <div className="relative h-28 w-full bg-card">
                  {o.image_url ? (
                    <img src={o.image_url} alt={o.title} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-3xl">🏷️</div>
                  )}
                  <span className="absolute left-2 top-2 rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary-foreground shadow-glow">
                    Oferta
                  </span>
                </div>
                <div className="p-3">
                  <p className="font-display text-sm font-bold leading-tight line-clamp-1">{o.title}</p>
                  {o.subtitle && <p className="mt-0.5 truncate text-[11px] text-muted-foreground">{o.subtitle}</p>}
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="font-display text-base font-extrabold text-primary">{brl(Number(o.price))}</span>
                    {o.old_price && Number(o.old_price) > Number(o.price) && (
                      <span className="text-xs text-muted-foreground line-through">{brl(Number(o.old_price))}</span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Categorias */}
      {categories.length > 0 && (
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
                <span className="text-2xl">{c.emoji ?? "🍽️"}</span>
                <span className="text-[11px] font-medium text-muted-foreground">{c.name}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Mais pedidos */}
      {popular.length > 0 && (
        <section className="mt-7">
          <div className="flex items-center justify-between px-5">
            <h3 className="font-display text-lg font-bold">Mais pedidos 🔥</h3>
            <Link to="/explorar" className="text-xs font-medium text-primary">Ver tudo</Link>
          </div>
          <div className="no-scrollbar mt-3 flex gap-3 overflow-x-auto px-5 pb-2">
            {popular.map((p) => <ProductChip key={p.id} product={p} />)}
          </div>
        </section>
      )}

      {/* Por categoria */}
      {categories.map((cat) => {
        const list = byCategory(cat.id);
        if (!list.length) return null;
        return (
          <section key={cat.id} className="mt-7 px-5">
            <h3 className="font-display text-lg font-bold">{cat.emoji} {cat.name}</h3>
            <div className="mt-3 flex flex-col gap-3">
              {list.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </section>
        );
      })}

      <footer className="mt-10 px-5 text-center text-xs text-muted-foreground">
        <p className="font-display font-semibold">{settings?.store_name}</p>
        <p className="mt-0.5">{settings?.tagline}</p>
      </footer>
    </AppShell>
  );
};

export default Index;
