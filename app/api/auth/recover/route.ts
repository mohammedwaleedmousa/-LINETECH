import { NextRequest, NextResponse } from "next/server";
import { authFetch } from "@/lib/supabase/auth-server";

export const runtime = "edge";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as { email?: string };
    const email = body.email?.trim().toLowerCase();
    if (email) {
      await authFetch("/recover", {
        method: "POST",
        body: JSON.stringify({
          email,
          redirect_to: new URL("/login?recovery=1", request.url).toString(),
        }),
      });
    }
  } catch {}
  return NextResponse.json({ ok: true });
}
