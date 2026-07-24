import { NextResponse } from "next/server";
import {
  captureLead,
  isSameOriginRequest,
  readLeadJson,
} from "@/lib/leads/server";

/**
 * Compatibility adapter for the older prompt-gate email capture. New forms use
 * `/api/leads`; this URL stays honest and delegates to the same backend.
 */
export async function POST(request: Request) {
  if (!isSameOriginRequest(request)) {
    return NextResponse.json(
      { ok: false, error: "origin_rejected" },
      { status: 403, headers: { "Cache-Control": "no-store" } },
    );
  }

  const parsed = await readLeadJson(request);
  if (!parsed.ok) {
    return NextResponse.json(parsed.result.body, {
      status: parsed.result.status,
      headers: { "Cache-Control": "no-store" },
    });
  }

  const body = parsed.value;
  if (
    body === null ||
    typeof body !== "object" ||
    Array.isArray(body) ||
    typeof (body as Record<string, unknown>).email !== "string"
  ) {
    return NextResponse.json(
      { ok: false, error: "invalid_email" },
      { status: 422, headers: { "Cache-Control": "no-store" } },
    );
  }

  const result = await captureLead(
    {
      leadType: "newsletter",
      fields: { email: (body as Record<string, unknown>).email },
    },
    "tasteloop-prompt-gate",
  );
  return NextResponse.json(result.body, {
    status: result.status,
    headers: { "Cache-Control": "no-store" },
  });
}
