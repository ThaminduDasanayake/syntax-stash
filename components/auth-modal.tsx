"use client";

import { GithubLogoIcon, GoogleLogoIcon } from "@phosphor-icons/react";

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
  const handleSocialSignIn = (provider: "github" | "google") => {
    signIn.social({
      callbackURL: "/saved",
      provider,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
            onClick={() => handleSocialSignIn("github")}
            className="border-ink/40 font-mono text-xs font-bold tracking-wider uppercase transition-all hover:bg-ink hover:text-paper"
          >
            <GithubLogoIcon weight="bold" className="size-4.5" /> Continue with GitHub
          </Button>

          <Button
            variant="outline"
            size="default"
            onClick={() => handleSocialSignIn("google")}
            className="border-ink/40 font-mono text-xs font-bold tracking-wider uppercase transition-all hover:bg-ink hover:text-paper"
          >
            <GoogleLogoIcon weight="bold" className="size-4.5" /> Continue with Google
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
