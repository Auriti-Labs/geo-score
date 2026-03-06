"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { LogOut, LayoutDashboard, User } from "lucide-react";

interface UserMenuProps {
  email: string;
  avatarUrl?: string | null;
}

export function UserMenu({ email, avatarUrl }: UserMenuProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.refresh();
  }

  // Chiudi con Escape e click esterno
  useEffect(() => {
    if (!open) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    }

    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  const initials = email.charAt(0).toUpperCase();

  return (
    <div className="relative" ref={menuRef}>
      <button
        ref={triggerRef}
        onClick={() => setOpen(!open)}
        className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground hover:opacity-80"
        aria-label="Menu utente"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        {avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={avatarUrl}
            alt=""
            className="h-9 w-9 rounded-full"
          />
        ) : (
          initials
        )}
      </button>

      {open && (
        <div
          role="menu"
          aria-label="Menu utente"
          className="absolute right-0 z-50 mt-2 w-56 rounded-md border bg-popover p-1 shadow-md"
        >
          <p className="truncate px-3 py-2 text-xs text-muted-foreground">
            {email}
          </p>
          <div className="my-1 border-t" role="separator" />
          <button
            role="menuitem"
            onClick={() => {
              setOpen(false);
              router.push("/dashboard");
            }}
            className="flex w-full items-center gap-2 rounded-sm px-3 py-2 text-sm hover:bg-accent"
          >
            <LayoutDashboard className="h-4 w-4" aria-hidden="true" />
            Dashboard
          </button>
          <button
            role="menuitem"
            onClick={() => {
              setOpen(false);
              router.push("/dashboard/settings");
            }}
            className="flex w-full items-center gap-2 rounded-sm px-3 py-2 text-sm hover:bg-accent"
          >
            <User className="h-4 w-4" aria-hidden="true" />
            Impostazioni
          </button>
          <div className="my-1 border-t" role="separator" />
          <button
            role="menuitem"
            onClick={handleSignOut}
            className="flex w-full items-center gap-2 rounded-sm px-3 py-2 text-sm text-destructive hover:bg-accent"
          >
            <LogOut className="h-4 w-4" aria-hidden="true" />
            Esci
          </button>
        </div>
      )}
    </div>
  );
}
