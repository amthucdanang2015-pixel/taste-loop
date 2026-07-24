import { NextResponse } from "next/server";
import {
  captureLead,
  isSameOriginRequest,
  readLeadJson,
} from "@/lib/leads/server";

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

  const result = await captureLead(parsed.value);
  return NextResponse.json(result.body, {
    status: result.status,
    headers: { "Cache-Control": "no-store" },
  });
}
