import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Phone, MapPin, LogOut, LogIn, Save, Pencil } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { useAuth } from "@/hooks/useAuth";
import { useStoreData } from "@/store/storeData";

const Perfil = () => {
  const { user, profile, loading, updateProfile, signOut } = useAuth();
  const { settings } = useStoreData();
  const nav = useNavigate();

  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setName(profile.name ?? "");
      setPhone(profile.phone ?? "");
      setAddress(profile.address ?? "");
    }
  }, [profile]);

  const handleSave = async () => {
    setSaving(true);
    const { error } = await updateProfile({ name, phone, address });
    setSaving(false);
    if (error) toast.error(error.message);
    else { toast.success("Perfil atualizado"); setEditing(false); }
  };

  const handleSignOut = async () => {
    await signOut();
    toast.success("Saiu da conta");
    nav("/");
  };

  if (loading) {
    return <AppShell><div className="flex min-h-[60vh] items-center justify-center"><p className="text-sm text-muted-foreground">Carregando...</p></div></AppShell>;
  }

  // Convidado
  if (!user) {
    return (
      <AppShell>
        <header className="safe-top px-5 pb-2 pt-4">
          <h1 className="font-display text-2xl font-extrabold">Perfil</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">Acesse sua conta</p>
        </header>

        <section className="mt-6 px-5">
          <div className="rounded-3xl bg-gradient-card p-6 text-center shadow-card">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-primary shadow-glow">
              <User className="h-8 w-8 text-primary-foreground" />
            </div>
            <h2 className="mt-4 font-display text-lg font-bold">Entre na sua conta</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Salve endereço, acompanhe pedidos e peça mais rápido.
            </p>
            <Link
              to="/auth"
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-gradient-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-glow"
            >
              <LogIn className="h-4 w-4" />
              Entrar ou criar conta
            </Link>
          </div>
        </section>

        <footer className="mt-8 px-5 pb-2 text-center text-xs text-muted-foreground">
          <p className="font-display font-semibold">{settings?.store_name}</p>
          <p className="mt-0.5">{settings?.address}</p>
        </footer>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <header className="safe-top flex items-start justify-between px-5 pb-2 pt-4">
        <div>
          <h1 className="font-display text-2xl font-extrabold">Perfil</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">Seus dados</p>
        </div>
        <button
          onClick={handleSignOut}
          className="flex h-10 items-center gap-1.5 rounded-full bg-card px-3 text-xs font-semibold text-muted-foreground"
        >
          <LogOut className="h-3.5 w-3.5" />
          Sair
        </button>
      </header>

      <section className="mt-4 px-5">
        <div className="flex items-center gap-3 rounded-2xl bg-gradient-card p-4 shadow-card">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-primary shadow-glow">
            {profile?.avatar_url ? (
              <img src={profile.avatar_url} alt="" className="h-full w-full rounded-full object-cover" />
            ) : (
              <User className="h-7 w-7 text-primary-foreground" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-display text-base font-bold truncate">
              {name || user.email?.split("@")[0]}
            </p>
            <p className="truncate text-xs text-muted-foreground">{user.email}</p>
          </div>
        </div>
      </section>

      <section className="mt-5 px-5">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="font-display text-sm font-semibold">Dados de entrega</h2>
          {!editing ? (
            <button onClick={() => setEditing(true)} className="flex items-center gap-1 text-xs font-semibold text-primary">
              <Pencil className="h-3 w-3" /> Editar
            </button>
          ) : (
            <button onClick={handleSave} disabled={saving} className="flex items-center gap-1 rounded-full bg-gradient-primary px-3 py-1 text-xs font-semibold text-primary-foreground shadow-glow disabled:opacity-60">
              <Save className="h-3 w-3" /> {saving ? "..." : "Salvar"}
            </button>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Field icon={<User className="h-4 w-4" />} label="Nome" value={name} onChange={setName} editing={editing} />
          <Field icon={<Phone className="h-4 w-4" />} label="Telefone" value={phone} onChange={setPhone} editing={editing} placeholder="(00) 00000-0000" />
          <Field icon={<MapPin className="h-4 w-4" />} label="Endereço" value={address} onChange={setAddress} editing={editing} placeholder="Rua, número, bairro" />
        </div>

        <p className="mt-3 px-2 text-[11px] text-muted-foreground">
          Esses dados são usados automaticamente quando você finaliza um pedido.
        </p>
      </section>

      <section className="mt-6 px-5">
        <Link
          to="/pedidos"
          className="block rounded-2xl bg-card p-4 text-center text-sm font-semibold shadow-soft"
        >
          Ver meus pedidos →
        </Link>
      </section>

      <footer className="mt-8 px-5 pb-2 text-center text-xs text-muted-foreground">
        <p className="font-display font-semibold">{settings?.store_name}</p>
        <p className="mt-0.5">{settings?.address}</p>
      </footer>
    </AppShell>
  );
};

const Field = ({ icon, label, value, onChange, editing, placeholder }: {
  icon: React.ReactNode; label: string; value: string;
  onChange: (v: string) => void; editing: boolean; placeholder?: string;
}) => (
  <div className="flex items-center gap-3 rounded-2xl bg-card px-4 py-3 shadow-soft">
    <span className="text-muted-foreground">{icon}</span>
    <div className="min-w-0 flex-1">
      <p className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</p>
      {editing ? (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-transparent text-sm font-medium outline-none placeholder:text-muted-foreground"
        />
      ) : (
        <p className="truncate text-sm font-medium">
          {value || <span className="text-muted-foreground">—</span>}
        </p>
      )}
    </div>
  </div>
);

export default Perfil;
