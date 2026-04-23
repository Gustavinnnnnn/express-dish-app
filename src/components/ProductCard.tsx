import { Plus, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import type { Product } from "@/data/menu";
import { useCart } from "@/store/cart";
import { brl } from "@/lib/format";

export const ProductCard = ({ product }: { product: Product }) => {
  const add = useCart((s) => s.add);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    add(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 900);
  };

  return (
    <motion.article
      whileTap={{ scale: 0.98 }}
      className="flex gap-3 rounded-2xl bg-gradient-card p-3 shadow-card"
    >
      <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover"
        />
        {product.tag && (
          <span className="absolute left-1 top-1 rounded-full bg-primary px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-primary-foreground">
            {product.tag}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col justify-between min-w-0">
        <div>
          <h3 className="font-display text-sm font-semibold leading-tight">
            {product.name}
          </h3>
          <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
            {product.description}
          </p>
        </div>
        <div className="flex items-end justify-between">
          <span className="font-display text-base font-bold text-foreground">
            {brl(product.price)}
          </span>
          <button
            onClick={handleAdd}
            aria-label={`Adicionar ${product.name}`}
            className="relative flex h-9 w-9 items-center justify-center rounded-full bg-gradient-primary shadow-glow transition-transform active:scale-90"
          >
            <AnimatePresence mode="wait">
              {added ? (
                <motion.span
                  key="check"
                  initial={{ scale: 0, rotate: -90 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0 }}
                >
                  <Check className="h-4 w-4 text-primary-foreground" strokeWidth={3} />
                </motion.span>
              ) : (
                <motion.span
                  key="plus"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                >
                  <Plus className="h-5 w-5 text-primary-foreground" strokeWidth={2.6} />
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </div>
    </motion.article>
  );
};

export const ProductChip = ({ product }: { product: Product }) => {
  const add = useCart((s) => s.add);
  return (
    <motion.button
      whileTap={{ scale: 0.96 }}
      onClick={() => add(product)}
      className="group relative flex w-40 flex-shrink-0 flex-col gap-2 rounded-2xl bg-gradient-card p-2 text-left shadow-card"
    >
      <div className="relative h-28 w-full overflow-hidden rounded-xl">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform group-hover:scale-105"
        />
      </div>
      <div className="flex flex-col gap-1 px-1 pb-1">
        <h4 className="line-clamp-1 font-display text-sm font-semibold">
          {product.name}
        </h4>
        <div className="flex items-center justify-between">
          <span className="font-display text-sm font-bold">
            {brl(product.price)}
          </span>
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-primary shadow-glow">
            <Plus className="h-4 w-4 text-primary-foreground" strokeWidth={2.6} />
          </span>
        </div>
      </div>
    </motion.button>
  );
};
