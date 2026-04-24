import { useState } from "react";
import { Link } from "react-router-dom";
import { AdminLayout } from "../AdminLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Loader2, Eye, RotateCcw, Smartphone, Monitor, Sparkles, Check } from "lucide-react";
import { DEMO_PRESETS, DEFAULT_PRESET_ID, type DemoPreset } from "../lib/demoPresets";
import { applyDemoPreset } from "../lib/applyPreset";
import { cn } from "@/lib/utils";

const LS_KEY = "demo_active_preset";

export default function DemoMode() {
  const [applying, setApplying] = useState<string | null>(null);
  const [active, setActive] = useState<string | null>(() => localStorage.getItem(LS_KEY));
  const [previewMode, setPreviewMode] = useState<"mobile" | "desktop">("mobile");
  const [previewKey, setPreviewKey] = useState(0);

  const apply = async (preset: DemoPreset) => {
    setApplying(preset.id);
    try {
      await applyDemoPreset(preset);
      localStorage.setItem(LS_KEY, preset.id);
      setActive(preset.id);
      setPreviewKey((k) => k + 1); // reload iframe
      toast.success(`Layout aplicado: ${preset.label}`, {
        description: "O app foi atualizado em tempo real.",
        icon: <Check className="size-4" />,
      });
    } catch (e: any) {
      toast.error("Falha ao aplicar layout", { description: e?.message ?? String(e) });
    } finally {
      setApplying(null);
    }
  };

  const reset = async () => {
    const def = DEMO_PRESETS.find((p) => p.id === DEFAULT_PRESET_ID);
    if (!def) return;
    await apply(def);
  };

  return (
    <AdminLayout title="Modo Demonstração">
      <div className="space-y-6">
        {/* Hero */}
        <Card className="border-admin-border bg-gradient-to-br from-admin-primary/10 via-admin-soft to-transparent p-6">
          <div className="flex items-start gap-4">
            <div className="grid h-12 w-12 place-items-center rounded-xl bg-admin-primary text-white shadow-lg">
              <Sparkles className="size-6" />
            </div>
            <div className="flex-1">
              <h2 className="font-display text-xl font-bold">Demonstração comercial</h2>
              <p className="mt-1 text-sm text-admin-muted">
                Troque o visual e o conteúdo da loja com 1 clique. Ideal para apresentar a plataforma
                a clientes de qualquer segmento. As mudanças refletem no app instantaneamente.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={reset}
              disabled={!!applying}
              className="border-admin-border bg-white"
            >
              <RotateCcw className="size-4" />
              Resetar padrão
            </Button>
          </div>
        </Card>

        <div className="grid gap-6 lg:grid-cols-[1fr,420px]">
          {/* Presets */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg font-semibold">Escolha um layout</h3>
              <span className="text-xs text-admin-muted">{DEMO_PRESETS.length} presets disponíveis</span>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {DEMO_PRESETS.map((p) => {
                const isActive = active === p.id;
                const isLoading = applying === p.id;
                return (
                  <Card
                    key={p.id}
                    className={cn(
                      "group relative overflow-hidden border-admin-border bg-white p-5 transition-all",
                      "hover:-translate-y-0.5 hover:shadow-lg",
                      isActive && "ring-2 ring-admin-primary",
                    )}
                  >
                    {isActive && (
                      <Badge className="absolute right-3 top-3 bg-admin-primary text-white">
                        <Check className="size-3" /> Ativo
                      </Badge>
                    )}
                    <div className="flex items-center gap-3">
                      <div
                        className="grid h-14 w-14 place-items-center rounded-2xl text-3xl shadow-sm"
                        style={{ background: `hsl(${p.settings.primary_color} / 0.15)` }}
                      >
                        {p.emoji}
                      </div>
                      <div className="min-w-0">
                        <h4 className="truncate font-display text-base font-bold">{p.label}</h4>
                        <p className="truncate text-xs text-admin-muted">{p.settings.store_name}</p>
                      </div>
                    </div>
                    <p className="mt-3 text-sm text-admin-muted">{p.description}</p>

                    <div className="mt-3 flex items-center gap-2">
                      <div
                        className="h-6 w-6 rounded-full border border-admin-border"
                        style={{ background: `hsl(${p.settings.primary_color})` }}
                        title="Cor principal"
                      />
                      <span className="text-xs text-admin-muted">
                        {p.categories.length} categorias · {p.products.length} produtos
                      </span>
                    </div>

                    <div className="mt-4 flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => apply(p)}
                        disabled={!!applying}
                        className="flex-1 bg-admin-primary text-white hover:bg-admin-primary/90"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="size-4 animate-spin" /> Aplicando…
                          </>
                        ) : (
                          <>Aplicar layout</>
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        asChild
                        className="border-admin-border bg-white"
                      >
                        <Link to="/" target="_blank" rel="noreferrer">
                          <Eye className="size-4" />
                        </Link>
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Preview */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg font-semibold">Pré-visualização</h3>
              <div className="inline-flex rounded-lg border border-admin-border bg-white p-0.5">
                <button
                  onClick={() => setPreviewMode("mobile")}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                    previewMode === "mobile" ? "bg-admin-primary text-white" : "text-admin-muted hover:text-admin-fg",
                  )}
                >
                  <Smartphone className="size-3.5" /> Mobile
                </button>
                <button
                  onClick={() => setPreviewMode("desktop")}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                    previewMode === "desktop" ? "bg-admin-primary text-white" : "text-admin-muted hover:text-admin-fg",
                  )}
                >
                  <Monitor className="size-3.5" /> Desktop
                </button>
              </div>
            </div>

            <Card className="overflow-hidden border-admin-border bg-admin-soft p-3">
              <div
                className={cn(
                  "mx-auto overflow-hidden rounded-xl border border-admin-border bg-white shadow-sm transition-all",
                  previewMode === "mobile" ? "w-[360px] max-w-full" : "w-full",
                )}
                style={{ height: previewMode === "mobile" ? 640 : 520 }}
              >
                <iframe
                  key={previewKey}
                  src="/"
                  title="Preview da loja"
                  className="h-full w-full border-0"
                />
              </div>
              <p className="mt-3 text-center text-xs text-admin-muted">
                A pré-visualização atualiza automaticamente após cada aplicação.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
