import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Callback OAuth (Google, GitHub, etc.)
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Errore → torna al login
  return NextResponse.redirect(`${origin}/login?error=auth`);
}
