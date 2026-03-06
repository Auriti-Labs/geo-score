import { NextResponse } from "next/server";
import { z } from "zod/v4";

const ContactSchema = z.object({
  name: z.string().min(1, "Nome obbligatorio").max(100),
  email: z.email("Email non valida"),
  message: z.string().min(10, "Messaggio troppo breve").max(2000),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = ContactSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Dati non validi" },
        { status: 400 },
      );
    }

    const data = parsed.data;

    // Invio email tramite Resend (se configurato)
    const resendKey = process.env.RESEND_API_KEY;
    if (resendKey) {
      const { Resend } = await import("resend");
      const resend = new Resend(resendKey);

      const { error: sendError } = await resend.emails.send({
        from:
          process.env.RESEND_FROM_EMAIL ?? "GEO Score <noreply@geoscore.dev>",
        to: "juancamilo.auriti@gmail.com",
        subject: `[GEO Score] Contatto da ${data.name}`,
        text: `Nome: ${data.name}\nEmail: ${data.email}\n\nMessaggio:\n${data.message}`,
        replyTo: data.email,
      });

      if (sendError) {
        console.error("Errore invio email contatto:", sendError);
        return NextResponse.json(
          { error: "Errore nell'invio del messaggio. Riprova." },
          { status: 502 },
        );
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Errore API contatto:", error);
    return NextResponse.json(
      { error: "Errore interno del server" },
      { status: 500 },
    );
  }
}
