import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { AppShell } from "@/components/AppShell";
import { useCart, useProfile } from "@/store/cart";
import { brl } from "@/lib/format";
import { useStoreData } from "@/store/storeData";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Carrinho = () => {
  const itemsMap = useCart((s) => s.items);
  const items = Object.values(itemsMap);
  const total = items.reduce((sum, it) => sum + it.unitPrice * it.qty, 0);
  const note = useCart((s) => s.note);
  const setNote = useCart((s) => s.setNote);
  const payment = useCart((s) => s.payment);
  const setPayment = useCart((s) => s.setPayment);
  const inc = useCart((s) => s.increment);
  const dec = useCart((s) => s.decrement);
  const remove = useCart((s) => s.remove);
  const clear = useCart((s) => s.clear);
  const profile = useProfile();
  const addOrder = useProfile((s) => s.addOrder);

  const paymentLabel = {
    pix: "Pix",
    dinheiro: "Dinheiro",
    cartao: "Cartão na entrega",
  }[payment];

  const handleSend = () => {
    if (items.length === 0) return;

    const lines: string[] = [];
    items.forEach((it) => {
      lines.push(
        `\n*${it.qty}x ${it.product.name}* — ${brl(it.unitPrice * it.qty)}`
      );
      if (it.extras.length) {
        // Agrupa por groupTitle
        const byGroup = it.extras.reduce<Record<string, typeof it.extras>>(
          (acc, e) => {
            (acc[e.groupTitle] ||= []).push(e);
            return acc;
          },
          {}
        );
        Object.entries(byGroup).forEach(([gName, list]) => {
          lines.push(`  _${gName}:_`);
          list.forEach((e) => {
            const priceTxt =
              e.unitPrice > 0 ? ` (+${brl(e.unitPrice * e.qty)})` : "";
            const qtyTxt = e.qty > 1 ? ` x${e.qty}` : "";
            lines.push(`   • ${e.optionName}${qtyTxt}${priceTxt}`);
          });
        });
      }
      if (it.note) lines.push(`  _Obs.:_ ${it.note}`);
    });

    const msg = [
      `*Novo pedido — ${STORE.name}* 🍇`,
      ...lines,
      "",
      `*Total:* ${brl(total)}`,
      `*Pagamento:* ${paymentLabel}`,
      note ? `*Observação geral:* ${note}` : "",
      profile.name ? `\n*Cliente:* ${profile.name}` : "",
      profile.phone ? `*Telefone:* ${profile.phone}` : "",
      profile.address ? `*Endereço:* ${profile.address}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    addOrder({
      total,
      items: items.map((it) => `${it.qty}x ${it.product.name}`),
    });

    const url = `https://wa.me/${STORE.whatsapp}?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank");
    toast.success("Pedido enviado para o WhatsApp!");
    clear();
  };

  const totalQty = items.reduce((s, i) => s + i.qty, 0);

  return (
    <AppShell>
      <header className="safe-top px-5 pb-2 pt-4">
        <h1 className="font-display text-2xl font-extrabold">Carrinho</h1>
        <p className="mt-0.5 text-sm text-muted-foreground">
          {items.length === 0
            ? "Vazio por enquanto"
            : `${totalQty} ${totalQty === 1 ? "item" : "itens"}`}
        </p>
      </header>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center px-5 pt-24 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-card">
            <ShoppingBag className="h-9 w-9 text-muted-foreground" />
          </div>
          <h2 className="mt-5 font-display text-xl font-bold">
            Seu carrinho está vazio
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Que tal um açaí cremoso?
          </p>
          <Link
            to="/explorar"
            className="mt-6 rounded-full bg-gradient-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-glow"
          >
            Ver cardápio
          </Link>
        </div>
      ) : (
        <>
          <section className="mt-3 flex flex-col gap-3 px-5">
            <AnimatePresence>
              {items.map((it) => (
                <motion.div
                  key={it.lineId}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex gap-3 rounded-2xl bg-gradient-card p-3 shadow-card"
                >
                  <img
                    src={it.product.image}
                    alt={it.product.name}
                    className="h-20 w-20 rounded-xl object-cover"
                  />
                  <div className="flex flex-1 flex-col gap-2 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-display text-sm font-semibold leading-tight">
                        {it.product.name}
                      </h3>
                      <button
                        onClick={() => remove(it.lineId)}
                        aria-label="Remover"
                        className="flex-shrink-0 text-muted-foreground"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    {it.extras.length > 0 && (
                      <ul className="text-[11px] leading-snug text-muted-foreground">
                        {it.extras.map((e) => (
                          <li key={e.optionId}>
                            • {e.qty > 1 ? `${e.qty}x ` : ""}
                            {e.optionName}
                            {e.unitPrice > 0 && (
                              <span className="text-primary">
                                {" "}+ {brl(e.unitPrice * e.qty)}
                              </span>
                            )}
                          </li>
                        ))}
                      </ul>
                    )}
                    {it.note && (
                      <p className="text-[11px] italic text-muted-foreground">
                        “{it.note}”
                      </p>
                    )}

                    <div className="mt-auto flex items-center justify-between">
                      <span className="font-display text-sm font-bold text-primary">
                        {brl(it.unitPrice * it.qty)}
                      </span>
                      <div className="flex items-center gap-2 rounded-full bg-background px-1 py-1">
                        <button
                          onClick={() => dec(it.lineId)}
                          className="flex h-7 w-7 items-center justify-center rounded-full bg-card active:scale-90"
                          aria-label="Diminuir"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-5 text-center text-sm font-bold">
                          {it.qty}
                        </span>
                        <button
                          onClick={() => inc(it.lineId)}
                          className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-primary text-primary-foreground active:scale-90"
                          aria-label="Aumentar"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </section>

          <section className="mt-5 px-5">
            <label className="mb-2 block font-display text-sm font-semibold">
              Observação geral
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Ex: troco para R$ 50, deixar na portaria..."
              rows={2}
              className="w-full resize-none rounded-2xl bg-card p-4 text-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-primary"
            />
          </section>

          <section className="mt-5 px-5">
            <label className="mb-2 block font-display text-sm font-semibold">
              Pagamento
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(["pix", "dinheiro", "cartao"] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setPayment(p)}
                  className={`rounded-2xl py-3 text-xs font-semibold transition-all ${
                    payment === p
                      ? "bg-gradient-primary text-primary-foreground shadow-glow"
                      : "bg-card text-muted-foreground"
                  }`}
                >
                  {p === "pix" && "Pix"}
                  {p === "dinheiro" && "Dinheiro"}
                  {p === "cartao" && "Cartão"}
                </button>
              ))}
            </div>
          </section>

          <section className="mt-6 px-5">
            <div className="rounded-2xl bg-card p-4 shadow-card">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">{brl(total)}</span>
              </div>
              <div className="mt-1 flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Entrega</span>
                <span className="font-medium text-whatsapp">A combinar</span>
              </div>
              <div className="mt-3 flex items-baseline justify-between border-t border-border pt-3">
                <span className="font-display font-semibold">Total</span>
                <span className="font-display text-2xl font-extrabold">
                  {brl(total)}
                </span>
              </div>
            </div>

            <button
              onClick={handleSend}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-whatsapp py-4 font-display text-base font-bold text-whatsapp-foreground shadow-card transition-transform active:scale-[0.98]"
            >
              <WhatsAppIcon />
              Enviar pedido no WhatsApp
            </button>
            <p className="mt-2 text-center text-[11px] text-muted-foreground">
              Você será redirecionado ao WhatsApp da loja
            </p>
          </section>
        </>
      )}
    </AppShell>
  );
};

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

export default Carrinho;
