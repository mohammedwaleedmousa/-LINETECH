import { NextRequest, NextResponse } from "next/server";
import { accessTokenFrom, dataFetch, safeJson } from "@/lib/supabase/data-server";

export const runtime = "edge";

export async function POST(request: NextRequest) {
  const accessToken = accessTokenFrom(request);
  if (!accessToken) {
    return NextResponse.json({ ok: false, authRequired: true }, { status: 401 });
  }

  try {
    const body = await request.json() as {
      name?: string;
      company?: string;
      contact?: string;
      preferredContact?: string;
      service?: string;
      stage?: string;
      goal?: string;
      audience?: string;
      idea?: string;
      features?: string;
      references?: string;
      budget?: string;
      timing?: string;
      notes?: string;
    };

    const required = [
      body.name,
      body.contact,
      body.preferredContact,
      body.service,
      body.stage,
      body.goal,
      body.idea,
    ];

    if (required.some(value => !String(value || "").trim())) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    const response = await dataFetch("/rpc/submit_project_request", accessToken, {
      method: "POST",
      headers: { Prefer: "return=representation" },
      body: JSON.stringify({
        p_name: String(body.name).trim(),
        p_company: String(body.company || "").trim(),
        p_contact: String(body.contact).trim(),
        p_preferred_contact: String(body.preferredContact).trim(),
        p_service: String(body.service).trim(),
        p_stage: String(body.stage).trim(),
        p_goal: String(body.goal).trim(),
        p_audience: String(body.audience || "").trim(),
        p_idea: String(body.idea).trim(),
        p_features: String(body.features || "").trim(),
        p_reference_links: String(body.references || "").trim(),
        p_budget: String(body.budget || "").trim(),
        p_timing: String(body.timing || "").trim(),
        p_notes: String(body.notes || "").trim(),
      }),
    });

    const payload = await safeJson(response);
    if (!response.ok) {
      return NextResponse.json({ ok: false }, { status: response.status });
    }

    return NextResponse.json({ ok: true, data: payload });
  } catch {
    return NextResponse.json({ ok: false }, { status: 503 });
  }
}
