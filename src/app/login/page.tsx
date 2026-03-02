import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Accedi",
  description: "Accedi a GEO Score per la tua dashboard e gli audit salvati.",
};

export default async function LoginPage() {
  // Se l'utente è già autenticato, redirect alla dashboard
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <div className="container mx-auto flex max-w-sm flex-col items-center px-4 py-20">
      <h1 className="mb-2 font-heading text-2xl font-bold">Accedi</h1>
      <p className="mb-8 text-center text-sm text-muted-foreground">
        Accedi per salvare i tuoi audit e accedere alla dashboard.
      </p>
      <div className="w-full">
        <LoginForm />
      </div>
    </div>
  );
}
