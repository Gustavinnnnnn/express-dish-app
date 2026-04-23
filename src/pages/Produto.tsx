import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { ArrowLeft, Minus, Plus, Check } from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import type { ExtraGroup, ExtraOption, Product } from "@/data/menu";
import { brl } from "@/lib/format";
import { useCart, computeUnitPrice, type SelectedExtra } from "@/store/cart";
import { toast } from "sonner";

type Selection = Record<string, Record<string, number>>;

const Produto = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const addLine = useCart((s) => s.addLine);

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selection, setSelection] = useState<Selection>({});
  const [qty, setQty] = useState(1);
  const [note, setNote] = useState("");

  useEffect(() => {
    if (!id) return;
    supabase.from("products").select("*").eq("id", id).maybeSingle().then(({ data }) => {
      if (data) {
        setProduct({
          id: data.id,
          name: data.name,
          description: data.description ?? "",
          price: Number(data.price),
          image: data.image_url || "/placeholder.svg",
          category: data.category_id ?? "",
          extras: (data.extras as any) || [],
        });
      }
      setLoading(false);
    });
  }, [id]);

  const selectedExtras: SelectedExtra[] = useMemo(() => {
    if (!product?.extras) return [];
    const list: SelectedExtra[] = [];
    for (const g of product.extras) {
      const sel = selection[g.id] ?? {};
      for (const opt of g.options) {
        const q = sel[opt.id] ?? 0;
        if (q > 0) {
          list.push({
            groupId: g.id, groupTitle: g.title,
            optionId: opt.id, optionName: opt.name,
            qty: q, unitPrice: opt.price,
          });
        }
      }
    }
    return list;
  }, [selection, product]);

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center"><p className="text-muted-foreground">Carregando...</p></div>;
  }

  if (!product) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6 text-center">
        <div>
          <p className="text-muted-foreground">Produto não encontrado.</p>
          <Link to="/explorar" className="mt-4 inline-block text-primary">Voltar ao cardápio</Link>
        </div>
      </div>
    );
  }

  const groupTotal = (groupId: string) =>
    Object.values(selection[groupId] ?? {}).reduce((s, n) => s + n, 0);

  const setOption = (group: ExtraGroup, opt: ExtraOption, qtyOpt: number) => {
    setSelection((prev) => {
      const next: Selection = { ...prev, [group.id]: { ...(prev[group.id] ?? {}) } };
      if (qtyOpt <= 0) delete next[group.id][opt.id];
      else next[group.id][opt.id] = qtyOpt;
      return next;
    });
  };

  const inc = (group: ExtraGroup, opt: ExtraOption) => {
    const current = selection[group.id]?.[opt.id] ?? 0;
    if (group.kind === "free") {
      const used = groupTotal(group.id);
      if (group.max && used >= group.max) {
        toast.error(`Máximo ${group.max} ${group.title.toLowerCase()}`);
        return;
      }
    }
    setOption(group, opt, current + 1);
  };

  const dec = (group: ExtraGroup, opt: ExtraOption) => {
    const current = selection[group.id]?.[opt.id] ?? 0;
    setOption(group, opt, Math.max(0, current - 1));
  };

  const pickSingle = (group: ExtraGroup, opt: ExtraOption) => {
    setSelection((prev) => ({ ...prev, [group.id]: { [opt.id]: 1 } }));
  };

  const unitPrice = computeUnitPrice(product, selectedExtras);
  const total = unitPrice * qty;

  const missingRequired = product.extras
    ? product.extras.filter((g) => g.required && groupTotal(g.id) === 0)
    : [];

  const handleAdd = () => {
    if (missingRequired.length > 0) {
      toast.error(`Escolha: ${missingRequired.map((g) => g.title).join(", ")}`);
      return;
    }
    addLine({ product, qty, extras: selectedExtras, note: note.trim() || undefined, unitPrice });
    toast.success("Adicionado ao carrinho!");
    navigate("/carrinho");
  };

  return (
    <div className="mx-auto min-h-screen max-w-md bg-background pb-40">
      <div className="relative bg-card">
        <img src={product.image} alt={product.name} className="max-h-[28rem] w-full object-contain" />
        <div className="absolute inset-0 bg-gradient-hero" />
        <button
          onClick={() => navigate(-1)}
          aria-label="Voltar"
          className="absolute left-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-background/70 backdrop-blur-md"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
      </div>

      <header className="px-5 pt-5">
        <h1 className="font-display text-2xl font-extrabold leading-tight">{product.name}</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">{product.description}</p>
        <p className="mt-3 font-display text-xl font-bold text-primary">{brl(product.price)}</p>
      </header>

      {product.extras?.map((group) => (
        <ExtraGroupSection
          key={group.id}
          group={group}
          selection={selection[group.id] ?? {}}
          onInc={(opt) => inc(group, opt)}
          onDec={(opt) => dec(group, opt)}
          onPickSingle={(opt) => pickSingle(group, opt)}
        />
      ))}

      <section className="mt-6 px-5">
        <h3 className="mb-2 font-display text-base font-bold">Observação</h3>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={2}
          placeholder="Ex: bem cremoso, sem casca..."
          className="w-full resize-none rounded-2xl bg-card p-4 text-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-primary"
        />
      </section>

      <section className="mt-6 flex items-center justify-between px-5">
        <span className="font-display text-base font-bold">Quantidade</span>
        <div className="flex items-center gap-3 rounded-full bg-card px-2 py-1.5">
          <button
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-background active:scale-90"
            aria-label="Diminuir"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="w-6 text-center font-display text-lg font-bold">{qty}</span>
          <button
            onClick={() => setQty((q) => q + 1)}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-primary text-primary-foreground active:scale-90"
            aria-label="Aumentar"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </section>

      <div className="fixed inset-x-0 bottom-0 z-40 safe-bottom px-3 pt-2">
        <div className="mx-auto max-w-md glass rounded-3xl p-3 shadow-card">
          <button
            onClick={handleAdd}
            className="flex w-full items-center justify-between rounded-2xl bg-gradient-primary px-5 py-4 font-display text-base font-bold text-primary-foreground shadow-glow active:scale-[0.98]"
          >
            <span>Adicionar ao carrinho</span>
            <span>{brl(total)}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

const ExtraGroupSection = ({
  group, selection, onInc, onDec, onPickSingle,
}: {
  group: ExtraGroup;
  selection: Record<string, number>;
  onInc: (opt: ExtraOption) => void;
  onDec: (opt: ExtraOption) => void;
  onPickSingle: (opt: ExtraOption) => void;
}) => {
  const used = Object.values(selection).reduce((s, n) => s + n, 0);
  const isFree = group.kind === "free";
  const isPaid = group.kind === "paid";
  const isSingle = group.kind === "single";
  const limitReached = isFree && group.max ? used >= group.max : false;

  return (
    <section className="mt-6 px-5">
      <div className="flex items-end justify-between">
        <div>
          <h3 className="font-display text-base font-bold">{group.title}</h3>
          {group.description && <p className="mt-0.5 text-xs text-muted-foreground">{group.description}</p>}
        </div>
        <div className="flex items-center gap-1.5">
          {group.required && (
            <span className="rounded-full bg-primary/20 px-2 py-0.5 text-[10px] font-bold uppercase text-primary">Obrigatório</span>
          )}
          {isFree && group.max && (
            <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
              limitReached ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            }`}>
              {used}/{group.max}
            </span>
          )}
        </div>
      </div>

      <ul className="mt-3 flex flex-col gap-2">
        {group.options.map((opt) => {
          const qty = selection[opt.id] ?? 0;
          const selected = qty > 0;
          const blocked = isFree && limitReached && qty === 0;

          return (
            <li
              key={opt.id}
              className={`flex items-center justify-between rounded-2xl bg-card p-3 transition-opacity ${blocked ? "opacity-40" : ""}`}
            >
              <div className="min-w-0 flex-1">
                <p className="font-medium text-sm">{opt.name}</p>
                {opt.price > 0 && <p className="mt-0.5 text-xs font-semibold text-primary">+ {brl(opt.price)}</p>}
                {isFree && opt.price === 0 && <p className="mt-0.5 text-xs text-muted-foreground">Grátis</p>}
              </div>

              {isSingle ? (
                <motion.button
                  whileTap={{ scale: 0.92 }}
                  onClick={() => onPickSingle(opt)}
                  className={`flex h-7 w-7 items-center justify-center rounded-full border-2 transition-colors ${
                    selected ? "border-primary bg-primary" : "border-border bg-transparent"
                  }`}
                  aria-label={`Escolher ${opt.name}`}
                >
                  {selected && <Check className="h-3.5 w-3.5 text-primary-foreground" strokeWidth={3} />}
                </motion.button>
              ) : isPaid || (isFree && qty > 0) ? (
                <div className="flex items-center gap-2 rounded-full bg-background px-1 py-1">
                  <button
                    onClick={() => onDec(opt)}
                    className="flex h-7 w-7 items-center justify-center rounded-full bg-card active:scale-90"
                    aria-label="Diminuir"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span className="w-5 text-center text-sm font-bold">{qty}</span>
                  <button
                    onClick={() => onInc(opt)}
                    disabled={blocked}
                    className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-primary text-primary-foreground active:scale-90 disabled:opacity-40"
                    aria-label="Aumentar"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
              ) : (
                <motion.button
                  whileTap={{ scale: 0.92 }}
                  onClick={() => onInc(opt)}
                  disabled={blocked}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-primary text-primary-foreground shadow-glow active:scale-90 disabled:opacity-40 disabled:shadow-none"
                  aria-label={`Adicionar ${opt.name}`}
                >
                  <Plus className="h-4 w-4" strokeWidth={2.6} />
                </motion.button>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
};

export default Produto;
