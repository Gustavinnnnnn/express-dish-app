import { Download, X, Share, Plus } from "lucide-react";
import { useEffect, useState } from "react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

const DISMISS_KEY = "pwa-install-dismissed";

export const InstallAppButton = () => {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    const ua = window.navigator.userAgent;
    setIsIOS(/iPad|iPhone|iPod/.test(ua) && !(window as any).MSStream);

    const isStandalone =
      window.matchMedia?.("(display-mode: standalone)").matches ||
      // @ts-expect-error iOS Safari
      window.navigator.standalone === true;
    if (isStandalone) {
      setInstalled(true);
      return;
    }

    const d = localStorage.getItem(DISMISS_KEY);
    if (d && Date.now() - Number(d) < 7 * 24 * 60 * 60 * 1000) {
      setDismissed(true);
    }

    const onBip = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
    };
    const onInstalled = () => setInstalled(true);

    window.addEventListener("beforeinstallprompt", onBip);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onBip);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  if (installed || dismissed) return null;

  const handleClick = async () => {
    if (deferred) {
      try {
        await deferred.prompt();
        const choice = await deferred.userChoice;
        if (choice.outcome === "dismissed") {
          localStorage.setItem(DISMISS_KEY, String(Date.now()));
          setDismissed(true);
        }
      } finally {
        setDeferred(null);
      }
      return;
    }
    // Sem prompt nativo (iOS Safari, desktop sem suporte ou já dispensado pelo browser)
    setShowHelp(true);
  };

  const dismiss = (e: React.MouseEvent) => {
    e.stopPropagation();
    localStorage.setItem(DISMISS_KEY, String(Date.now()));
    setDismissed(true);
  };

  return (
    <>
      <div className="safe-top sticky top-0 z-30 bg-gradient-primary px-4 py-2 text-primary-foreground shadow-glow">
        <div className="mx-auto flex max-w-md items-center gap-3">
          <Download className="h-4 w-4 shrink-0" />
          <button onClick={handleClick} className="flex-1 text-left text-sm font-semibold">
            Baixe nosso aplicativo
            <span className="ml-1 font-normal opacity-90">— acesso rápido na tela inicial</span>
          </button>
          <button
            onClick={dismiss}
            aria-label="Dispensar"
            className="grid h-7 w-7 place-items-center rounded-full bg-black/20 hover:bg-black/30"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {showHelp && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-4 sm:items-center"
          onClick={() => setShowHelp(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-2xl bg-card p-5 shadow-card"
          >
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-display text-lg font-bold">Instalar aplicativo</h3>
              <button
                onClick={() => setShowHelp(false)}
                className="grid h-8 w-8 place-items-center rounded-full bg-muted hover:bg-muted/70"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            {isIOS ? (
              <ol className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="font-bold text-foreground">1.</span>
                  <span>
                    Toque em <Share className="inline h-4 w-4 align-text-bottom" /> <b>Compartilhar</b> na barra do Safari.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-foreground">2.</span>
                  <span>
                    Escolha <Plus className="inline h-4 w-4 align-text-bottom" /> <b>Adicionar à Tela de Início</b>.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-foreground">3.</span>
                  <span>Confirme em <b>Adicionar</b> — pronto, vira app!</span>
                </li>
              </ol>
            ) : (
              <ol className="space-y-2 text-sm text-muted-foreground">
                <li>• No Chrome/Edge: abra o menu (⋮) e toque em <b>Instalar aplicativo</b>.</li>
                <li>• Se não aparecer, navegue um pouco pelo site e tente de novo.</li>
                <li>• Em desktop: ícone de instalar na barra de endereço.</li>
              </ol>
            )}
          </div>
        </div>
      )}
    </>
  );
};
