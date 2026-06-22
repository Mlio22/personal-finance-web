"use client";

import { useEffect, useState } from "react";
import { Download, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const DISMISS_KEY = "moneyiq-pwa-install-dismissed";

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (window.localStorage.getItem(DISMISS_KEY) === "true") {
      return;
    }

    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
      setIsVisible(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt,
      );
    };
  }, []);

  const dismiss = () => {
    window.localStorage.setItem(DISMISS_KEY, "true");
    setIsVisible(false);
    setDeferredPrompt(null);
  };

  const install = async () => {
    if (!deferredPrompt) {
      return;
    }

    await deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    dismiss();
  };

  if (!isVisible || !deferredPrompt) {
    return null;
  }

  return (
    <div
      role="status"
      className="border-b border-border/60 bg-card px-4 py-3"
    >
      <div className="mx-auto flex max-w-lg items-start gap-3">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-positive/15">
          <Download className="size-4 text-positive" aria-hidden="true" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium">Install MoneyIQ</p>
          <p className="text-xs text-muted-foreground">
            Add the app to your home screen for quick access and offline use.
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <Button type="button" size="sm" onClick={install}>
            Install
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={dismiss}
            aria-label="Dismiss install prompt"
          >
            <X className="size-4" aria-hidden="true" />
          </Button>
        </div>
      </div>
    </div>
  );
}
