import { User, Phone, MapPin, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { AppShell } from "@/components/AppShell";
import { useProfile } from "@/store/cart";
import { STORE } from "@/data/menu";
import { brl } from "@/lib/format";

const Perfil = () => {
  const profile = useProfile();
  const setProfile = useProfile((s) => s.set);

  return (
    <AppShell>
      <header className="safe-top px-5 pb-2 pt-4">
        <h1 className="font-display text-2xl font-extrabold">Perfil</h1>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Seus dados e pedidos
        </p>
      </header>

      <section className="mt-4 px-5">
        <div className="flex items-center gap-3 rounded-2xl bg-gradient-card p-4 shadow-card">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-primary shadow-glow">
            <User className="h-7 w-7 text-primary-foreground" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-display text-base font-bold">
              {profile.name || "Convidado"}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {profile.phone || "Adicione seus dados"}
            </p>
          </div>
        </div>
      </section>

      <section className="mt-5 flex flex-col gap-3 px-5">
        <Field icon={<User className="h-4 w-4" />} placeholder="Seu nome"
          value={profile.name} onChange={(v) => setProfile({ name: v })} />
        <Field icon={<Phone className="h-4 w-4" />} placeholder="Telefone (WhatsApp)"
          value={profile.phone} onChange={(v) => setProfile({ phone: v })} />
        <Field icon={<MapPin className="h-4 w-4" />} placeholder="Endereço de entrega"
          value={profile.address} onChange={(v) => setProfile({ address: v })} />
      </section>

      <section className="mt-7 px-5">
        <h2 className="font-display text-lg font-bold">Histórico</h2>
        {profile.history.length === 0 ? (
          <p className="mt-3 rounded-2xl bg-card p-5 text-center text-sm text-muted-foreground">
            Você ainda não fez pedidos.
          </p>
        ) : (
          <div className="mt-3 flex flex-col gap-3">
            {profile.history.map((order) => (
              <div key={order.id} className="rounded-2xl bg-gradient-card p-4 shadow-card">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" />
                    {new Date(order.date).toLocaleDateString("pt-BR", {
                      day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit",
                    })}
                  </div>
                  <span className="font-display text-sm font-bold">{brl(order.total)}</span>
                </div>
                <ul className="mt-2 space-y-0.5 text-sm text-foreground/80">
                  {order.items.map((it, i) => <li key={i}>• {it}</li>)}
                </ul>
                <Link
                  to="/explorar"
                  className="mt-3 block w-full rounded-full bg-gradient-primary py-2 text-center text-xs font-semibold text-primary-foreground shadow-glow"
                >
                  Pedir novamente
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>

      <footer className="mt-8 px-5 pb-2 text-center text-xs text-muted-foreground">
        <p className="font-display font-semibold">{STORE.name}</p>
        <p className="mt-0.5">{STORE.address}</p>
      </footer>
    </AppShell>
  );
};

const Field = ({ icon, placeholder, value, onChange }: {
  icon: React.ReactNode; placeholder: string; value: string; onChange: (v: string) => void;
}) => (
  <div className="flex items-center gap-3 rounded-2xl bg-card px-4 py-3 shadow-soft">
    <span className="text-muted-foreground">{icon}</span>
    <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
      className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground" />
  </div>
);

export default Perfil;
