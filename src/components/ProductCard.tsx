import { Plus } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import type { Product } from "@/data/menu";
import { brl } from "@/lib/format";

export const ProductCard = ({ product }: { product: Product }) => {
  return (
    <motion.div whileTap={{ scale: 0.98 }}>
      <Link
        to={`/produto/${product.id}`}
        className="flex gap-3 rounded-2xl bg-gradient-card p-3 shadow-card"
      >
        <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl bg-background">
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
            <span
              aria-label={`Personalizar ${product.name}`}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-primary shadow-glow"
            >
              <Plus className="h-5 w-5 text-primary-foreground" strokeWidth={2.6} />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export const ProductChip = ({ product }: { product: Product }) => {
  return (
    <Link
      to={`/produto/${product.id}`}
      className="group relative flex w-40 flex-shrink-0 flex-col gap-2 rounded-2xl bg-gradient-card p-2 shadow-card"
    >
      <div className="relative h-28 w-full overflow-hidden rounded-xl bg-background">
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
    </Link>
  );
};
