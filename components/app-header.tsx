"use client";

import { UserIcon } from "@phosphor-icons/react";
import { Suspense, useState } from "react";

import { AuthModal } from "@/components/auth-modal";
import { DesktopNav } from "@/components/header/desktop-nav";
import { HeaderLogo } from "@/components/header/header-logo";
import { MobileNavDropdown } from "@/components/header/mobile-nav-dropdown";
import { UserMenu } from "@/components/header/user-menu";
import { Button } from "@/components/ui/button";
import { useSession } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { HeaderProps } from "@/types";

function AppHeaderInner({
  isScrolled,
  onSearchOpenAction,
}: HeaderProps & { isScrolled?: boolean }) {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const { data: session } = useSession();

  return (
    <>
      <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />
      <header className={cn("site-nav", isScrolled && "site-nav--scrolled")}>
        <div className="nav-inner">
          <HeaderLogo />
          <DesktopNav onSearchOpenAction={onSearchOpenAction} />

          <div className="nav-mobile-actions">
            {!session ? (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setAuthModalOpen(true)}
                  className="border-ink/40 hidden font-mono text-xs font-bold tracking-wider md:inline-flex"
                >
                  <UserIcon weight="bold" /> Sign In
                </Button>
                <MobileNavDropdown
                  onSearchOpenAction={onSearchOpenAction}
                  onSignInAction={() => setAuthModalOpen(true)}
                />
              </>
            ) : (
              <UserMenu onSearchOpenAction={onSearchOpenAction} />
            )}
          </div>
        </div>
      </header>
    </>
  );
}

export default function AppHeader(props: HeaderProps & { isScrolled?: boolean }) {
  return (
    <Suspense>
      <AppHeaderInner {...props} />
    </Suspense>
  );
}
