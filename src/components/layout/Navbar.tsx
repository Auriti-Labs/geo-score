import Link from "next/link";
import { Logo } from "@/components/shared/Logo";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { UserMenu } from "@/components/auth/UserMenu";
import { createClient } from "@/lib/supabase/server";

export async function Navbar() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <Logo />
        <nav className="flex items-center gap-4">
          <Link
            href="/pricing"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Pricing
          </Link>
          {user ? (
            <UserMenu
              email={user.email ?? ""}
              avatarUrl={user.user_metadata?.avatar_url}
            />
          ) : (
            <Link
              href="/login"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Accedi
            </Link>
          )}
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
