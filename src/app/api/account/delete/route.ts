import { NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";

// GDPR Art. 17 — Diritto alla cancellazione
export async function POST() {
  try {
    // Verifica autenticazione
    const authClient = await createClient();
    const {
      data: { user },
    } = await authClient.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Non autenticato" },
        { status: 401 },
      );
    }

    const supabase = createServiceClient();
    const userId = user.id;

    // 1. Cancella usage_events collegati agli audit dell'utente
    const { data: userAudits } = await supabase
      .from("audits")
      .select("id")
      .eq("user_id", userId);

    if (userAudits && userAudits.length > 0) {
      const auditIds = userAudits.map((a) => a.id);
      await supabase
        .from("usage_events")
        .delete()
        .in("audit_id", auditIds);
    }

    // 2. Cancella audit dell'utente
    await supabase.from("audits").delete().eq("user_id", userId);

    // 3. Cancella email collegate
    await supabase.from("emails").delete().eq("email", user.email ?? "");

    // 4. Cancella subscription
    await supabase.from("subscriptions").delete().eq("user_id", userId);

    // 5. Cancella profilo
    await supabase.from("profiles").delete().eq("id", userId);

    // 6. Cancella utente da Supabase Auth (richiede service role)
    const { error: deleteError } = await supabase.auth.admin.deleteUser(userId);

    if (deleteError) {
      console.error("Errore cancellazione utente auth:", deleteError);
      return NextResponse.json(
        { error: "Errore nella cancellazione dell'account" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Account e dati personali cancellati",
    });
  } catch (error) {
    console.error("Errore API delete account:", error);
    return NextResponse.json(
      { error: "Errore interno del server" },
      { status: 500 },
    );
  }
}
