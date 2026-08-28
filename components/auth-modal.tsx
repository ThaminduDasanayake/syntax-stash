"use client";

import { CircleNotchIcon, GithubLogoIcon, GoogleLogoIcon } from "@phosphor-icons/react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { signIn } from "@/lib/auth-client";

interface AuthModalProps {
  onOpenChange: (open: boolean) => void;
  open: boolean;
}

export function AuthModal({ onOpenChange, open }: AuthModalProps) {
  const [loadingProvider, setLoadingProvider] = useState<"github" | "google" | null>(null);

  const handleSocialSignIn = async (provider: "github" | "google") => {
    setLoadingProvider(provider);
    try {
      await signIn.social({
        callbackURL: "/saved",
        provider,
      });
    } catch {
      setLoadingProvider(null);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setLoadingProvider(null);
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="border-ink border-2 sm:max-w-md">
        <DialogHeader className="text-center">
          <DialogTitle className="font-mono text-base font-extrabold uppercase tracking-wide">
            SIGN IN TO SYNTAX STASH
          </DialogTitle>
          <DialogDescription className="font-mono text-xs leading-relaxed opacity-80">
            Sign in with Google or GitHub to save resources and sync your personal stash automatically across all your devices.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-3 py-3">
          <Button
            variant="outline"
            size="default"
            disabled={loadingProvider !== null}
            onClick={() => handleSocialSignIn("github")}
            className="border-ink/40 font-mono text-xs font-bold tracking-wider uppercase transition-all hover:bg-ink hover:text-paper"
          >
            {loadingProvider === "github" ? (
              <CircleNotchIcon weight="bold" className="size-4.5 animate-spin" />
            ) : (
              <GithubLogoIcon weight="bold" className="size-4.5" />
            )}
            <span>{loadingProvider === "github" ? "Connecting to GitHub..." : "Continue with GitHub"}</span>
          </Button>

          <Button
            variant="outline"
            size="default"
            disabled={loadingProvider !== null}
            onClick={() => handleSocialSignIn("google")}
            className="border-ink/40 font-mono text-xs font-bold tracking-wider uppercase transition-all hover:bg-ink hover:text-paper"
          >
            {loadingProvider === "google" ? (
              <CircleNotchIcon weight="bold" className="size-4.5 animate-spin" />
            ) : (
              <GoogleLogoIcon weight="bold" className="size-4.5" />
            )}
            <span>{loadingProvider === "google" ? "Connecting to Google..." : "Continue with Google"}</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
