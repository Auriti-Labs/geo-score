"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { LogOut, LayoutDashboard, User } from "lucide-react";

interface UserMenuProps {
  email: string;
  avatarUrl?: string | null;
}

export function UserMenu({ email, avatarUrl }: UserMenuProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.refresh();
  }

  const initials = email.charAt(0).toUpperCase();

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground hover:opacity-80"
        aria-label="Menu utente"
      >
        {avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={avatarUrl}
            alt=""
            className="h-8 w-8 rounded-full"
          />
        ) : (
          initials
        )}
      </button>

      {open && (
        <>
          {/* Overlay per chiudere */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
          />
          <div className="absolute right-0 z-50 mt-2 w-56 rounded-md border bg-popover p-1 shadow-md">
            <p className="truncate px-3 py-2 text-xs text-muted-foreground">
              {email}
            </p>
            <div className="my-1 border-t" />
            <button
              onClick={() => {
                setOpen(false);
                router.push("/dashboard");
              }}
              className="flex w-full items-center gap-2 rounded-sm px-3 py-2 text-sm hover:bg-accent"
            >
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </button>
            <button
              onClick={() => {
                setOpen(false);
                router.push("/dashboard/settings");
              }}
              className="flex w-full items-center gap-2 rounded-sm px-3 py-2 text-sm hover:bg-accent"
            >
              <User className="h-4 w-4" />
              Impostazioni
            </button>
            <div className="my-1 border-t" />
            <button
              onClick={handleSignOut}
              className="flex w-full items-center gap-2 rounded-sm px-3 py-2 text-sm text-destructive hover:bg-accent"
            >
              <LogOut className="h-4 w-4" />
              Esci
            </button>
          </div>
        </>
      )}
    </div>
  );
}
