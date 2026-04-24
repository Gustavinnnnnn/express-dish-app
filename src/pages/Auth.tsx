import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Mail, Lock, User as UserIcon } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";

const Auth = () => {
  const nav = useNavigate();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) nav("/perfil", { replace: true });
    });
  }, [nav]);

  const handleEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin,
            data: { name },
          },
        });
        if (error) throw error;
        toast.success("Conta criada! Verifique seu email para confirmar.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Bem-vindo de volta!");
        nav("/perfil");
      }
    } catch (err: any) {
      toast.error(err?.message || "Erro ao autenticar");
    } finally {
      setBusy(false);
    }
  };

  const handleGoogle = async () => {
    setBusy(true);
    try {
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.origin + "/perfil",
      });
      if (result.error) throw result.error;
      if (result.redirected) return;
      nav("/perfil");
    } catch (err: any) {
      toast.error(err?.message || "Erro ao entrar com Google");
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col bg-background">
      <header className="safe-top flex items-center gap-3 px-5 pb-2 pt-4">
        <Link to="/" className="flex h-10 w-10 items-center justify-center rounded-full bg-card">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="font-display text-2xl font-extrabold">
            {mode === "login" ? "Entrar" : "Criar conta"}
          </h1>
          <p className="text-xs text-muted-foreground">
            {mode === "login" ? "Acesse seus pedidos e dados" : "Faça pedidos mais rápido"}
          </p>
        </div>
      </header>

      <main className="flex-1 px-5 pt-6">
        <button
          onClick={handleGoogle}
          disabled={busy}
          className="flex w-full items-center justify-center gap-3 rounded-2xl bg-card py-4 font-semibold shadow-card transition-transform active:scale-[0.98] disabled:opacity-60"
        >
          <GoogleIcon />
          Continuar com Google
        </button>

        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-border" />
          <span className="text-xs text-muted-foreground">ou com email</span>
          <div className="h-px flex-1 bg-border" />
        </div>

        <form onSubmit={handleEmail} className="flex flex-col gap-3">
          {mode === "signup" && (
            <Field icon={<UserIcon className="h-4 w-4" />} type="text" placeholder="Nome" value={name} onChange={setName} required />
          )}
          <Field icon={<Mail className="h-4 w-4" />} type="email" placeholder="Email" value={email} onChange={setEmail} required />
          <Field icon={<Lock className="h-4 w-4" />} type="password" placeholder="Senha (mín. 6)" value={password} onChange={setPassword} required minLength={6} />

          <button
            type="submit"
            disabled={busy}
            className="mt-2 rounded-2xl bg-gradient-primary py-4 font-display font-bold text-primary-foreground shadow-glow transition-transform active:scale-[0.98] disabled:opacity-60"
          >
            {busy ? "..." : mode === "login" ? "Entrar" : "Criar conta"}
          </button>
        </form>

        <button
          onClick={() => setMode(mode === "login" ? "signup" : "login")}
          className="mt-5 w-full text-center text-sm text-muted-foreground"
        >
          {mode === "login" ? (
            <>Não tem conta? <span className="font-semibold text-primary">Criar agora</span></>
          ) : (
            <>Já tem conta? <span className="font-semibold text-primary">Entrar</span></>
          )}
        </button>

        <Link to="/" className="mt-6 block text-center text-xs text-muted-foreground underline">
          Continuar como convidado
        </Link>
      </main>
    </div>
  );
};

const Field = ({ icon, type, placeholder, value, onChange, required, minLength }: any) => (
  <div className="flex items-center gap-3 rounded-2xl bg-card px-4 py-3 shadow-soft">
    <span className="text-muted-foreground">{icon}</span>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      required={required}
      minLength={minLength}
      className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
    />
  </div>
);

const GoogleIcon = () => (
  <svg className="h-5 w-5" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);

export default Auth;
