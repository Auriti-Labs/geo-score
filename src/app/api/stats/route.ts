import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = createServiceClient();

    const { count, error } = await supabase
      .from("audits")
      .select("*", { count: "exact", head: true });

    if (error) {
      return NextResponse.json({ totalAudits: 0 }, { status: 200 });
    }

    return NextResponse.json(
      { totalAudits: count ?? 0 },
      {
        headers: {
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=60",
        },
      },
    );
  } catch {
    return NextResponse.json({ totalAudits: 0 }, { status: 200 });
  }
}
