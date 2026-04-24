import { motion } from "framer-motion";
import { Download, Plus, Share, Smartphone, X } from "lucide-react";
import { useEffect, useState, type MouseEvent } from "react";
import { useLocation } from "react-router-dom";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

export const InstallAppButton = () => {
  const location = useLocation();
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isSecureInstallContext, setIsSecureInstallContext] = useState(false);

  useEffect(() => {
    const ua = window.navigator.userAgent;
    const iosDevice =
      /iPad|iPhone|iPod/.test(ua) ||
      (window.navigator.platform === "MacIntel" && window.navigator.maxTouchPoints > 1);

    setIsIOS(iosDevice);
    setIsSecureInstallContext(
      window.isSecureContext || window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1",
    );

    const isStandalone =
      window.matchMedia?.("(display-mode: standalone)").matches ||
      // @ts-expect-error iOS Safari
      window.navigator.standalone === true;
    if (isStandalone) {
      setInstalled(true);
      return;
    }

    const onBip = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };
    const onInstalled = () => {
      setInstalled(true);
      setDeferredPrompt(null);
      setShowHelp(false);
    };

    window.addEventListener("beforeinstallprompt", onBip);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onBip);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  const hideOnRoute = location.pathname.startsWith("/admin") || location.pathname === "/auth";

  const canShowNativeInstall = Boolean(deferredPrompt) && !isIOS && isSecureInstallContext;
  const canShowIosFallback = isIOS && isSecureInstallContext;

  if (hideOnRoute || installed || dismissed || (!canShowNativeInstall && !canShowIosFallback)) return null;

  const handleClick = async () => {
    if (!deferredPrompt) return;

    try {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;

      if (choice.outcome === "accepted") {
        setInstalled(true);
      } else {
        setDismissed(true);
      }
    } finally {
      setDeferredPrompt(null);
    }
  };

  const dismiss = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setDismissed(true);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.32 }}
        className="safe-top sticky top-0 z-30 px-4 pt-2"
      >
        <div className="mx-auto flex max-w-md items-center gap-3 rounded-2xl border border-border/60 bg-card/95 px-4 py-3 shadow-card backdrop-blur-xl">
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-primary shadow-glow">
            {canShowNativeInstall ? (
              <Download className="h-5 w-5 text-primary-foreground" />
            ) : (
              <Smartphone className="h-5 w-5 text-primary-foreground" />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-foreground">Instale nosso app</p>
            <p className="text-xs text-muted-foreground">
              {canShowNativeInstall ? "Abra mais rápido e peça com um toque." : "Adicione na tela inicial do seu iPhone."}
            </p>
          </div>

          <button
            id={canShowNativeInstall ? "installBtn" : undefined}
            onClick={canShowNativeInstall ? handleClick : () => setShowHelp(true)}
            className="shrink-0 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-glow transition-transform duration-200 hover:scale-[1.02]"
          >
            {canShowNativeInstall ? "Instalar agora" : "Ver como"}
          </button>

          <button
            onClick={dismiss}
            aria-label="Dispensar"
            className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-secondary text-secondary-foreground transition-colors hover:bg-secondary/80"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </motion.div>

      {showHelp && canShowIosFallback && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-background/80 p-4 backdrop-blur-sm sm:items-center"
          onClick={() => setShowHelp(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-3xl border border-border/60 bg-card p-5 shadow-card"
          >
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-display text-lg font-bold">Adicionar ao iPhone</h3>
              <button
                onClick={() => setShowHelp(false)}
                className="grid h-8 w-8 place-items-center rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/80"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="mb-4 text-sm text-muted-foreground">No iPhone a instalação é feita pelo Safari, então deixei o atalho rápido aqui.</p>
            <ol className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-3 rounded-2xl bg-secondary/70 px-3 py-3">
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-primary text-xs font-bold text-primary-foreground">1</span>
                <span>
                  Toque em <Share className="inline h-4 w-4 align-text-bottom" /> <b>Compartilhar</b> no Safari.
                </span>
              </li>
              <li className="flex items-start gap-3 rounded-2xl bg-secondary/70 px-3 py-3">
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-primary text-xs font-bold text-primary-foreground">2</span>
                <span>
                  Escolha <Plus className="inline h-4 w-4 align-text-bottom" /> <b>Adicionar à Tela de Início</b>.
                </span>
              </li>
              <li className="flex items-start gap-3 rounded-2xl bg-secondary/70 px-3 py-3">
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-primary text-xs font-bold text-primary-foreground">3</span>
                <span>Confirme em <b>Adicionar</b> para finalizar.</span>
              </li>
            </ol>
          </div>
        </div>
      )}
    </>
  );
};
