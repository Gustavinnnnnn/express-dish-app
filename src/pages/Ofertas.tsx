import { motion } from "framer-motion";
import { Flame } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { offers, products } from "@/data/menu";
import { brl } from "@/lib/format";
import { useCart } from "@/store/cart";
import { toast } from "sonner";

const Ofertas = () => {
  const add = useCart((s) => s.add);

  const handlePick = (offerId: string) => {
    // Simplificação: adiciona um produto representativo
    const map: Record<string, string> = {
      o1: "p2",
      o2: "p3",
      o3: "p1",
    };
    const prod = products.find((p) => p.id === map[offerId]);
    if (prod) {
      add(prod);
      toast.success("Adicionado ao carrinho!");
    }
  };

  return (
    <AppShell>
      <header className="safe-top px-5 pb-2 pt-4">
        <div className="flex items-center gap-2">
          <Flame className="h-6 w-6 text-primary" />
          <h1 className="font-display text-2xl font-extrabold">Ofertas</h1>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          Combos com até 25% off — só hoje
        </p>
      </header>

      <section className="mt-5 flex flex-col gap-4 px-5">
        {offers.map((o, i) => {
          const discount = Math.round(((o.oldPrice - o.price) / o.oldPrice) * 100);
          return (
            <motion.div
              key={o.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="relative overflow-hidden rounded-3xl bg-gradient-card shadow-card"
            >
              <div className="relative h-44 w-full overflow-hidden">
                <img
                  src={o.image}
                  alt={o.title}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-hero" />
                <span className="absolute left-3 top-3 rounded-full bg-primary px-2.5 py-1 text-[11px] font-bold text-primary-foreground shadow-glow">
                  -{discount}%
                </span>
              </div>
              <div className="flex items-center justify-between p-4">
                <div>
                  <h3 className="font-display text-lg font-bold leading-tight">
                    {o.title}
                  </h3>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {o.subtitle}
                  </p>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="font-display text-xl font-extrabold text-primary">
                      {brl(o.price)}
                    </span>
                    <span className="text-xs text-muted-foreground line-through">
                      {brl(o.oldPrice)}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => handlePick(o.id)}
                  className="rounded-full bg-gradient-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow active:scale-95"
                >
                  Pedir
                </button>
              </div>
            </motion.div>
          );
        })}
      </section>
    </AppShell>
  );
};

export default Ofertas;
