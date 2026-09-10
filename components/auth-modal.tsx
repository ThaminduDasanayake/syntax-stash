"use client";

import { CircleNotchIcon } from "@phosphor-icons/react";
import Image from "next/image";
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
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <DialogTitle className="text-foreground text-lg font-bold tracking-tight">
            Sign in to Syntax Stash
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-sm leading-relaxed">
            Sign in with Google or GitHub to save resources and sync your personal stash
            automatically across all your devices.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-3 py-3">
          <Button
            variant="outline"
            size="default"
            disabled={loadingProvider !== null}
            onClick={() => handleSocialSignIn("github")}
            className="group rounded-full font-medium transition-all"
          >
            {loadingProvider === "github" ? (
              <CircleNotchIcon weight="bold" className="size-4.5 animate-spin" />
            ) : (
              <Image
                src="/github.svg"
                alt="GitHub"
                width={18}
                height={18}
                className="size-4.5 transition-all group-hover:scale-105"
              />
            )}
            <span>
              {loadingProvider === "github" ? "Connecting to GitHub..." : "Continue with GitHub"}
            </span>
          </Button>

          <Button
            variant="outline"
            size="default"
            disabled={loadingProvider !== null}
            onClick={() => handleSocialSignIn("google")}
            className="rounded-full font-medium transition-all"
          >
            {loadingProvider === "google" ? (
              <CircleNotchIcon weight="bold" className="size-4.5 animate-spin" />
            ) : (
              <Image
                src="/google.svg"
                alt="Google"
                width={18}
                height={18}
                className="size-4.5 transition-all"
              />
            )}
            <span>
              {loadingProvider === "google" ? "Connecting to Google..." : "Continue with Google"}
            </span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
