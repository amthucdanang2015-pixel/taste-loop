import { randomUUID } from "node:crypto";
import {
  MAX_LEAD_BODY_BYTES,
  parseLeadSubmission,
  type LeadSubmission,
} from "./contract";

type LeadSource = LeadSubmission["source"];

export interface LeadCaptureResult {
  status: number;
  body: {
    ok: boolean;
    error?: string;
    field?: string;
    id?: string;
    persisted?: boolean;
  };
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

export function isSameOriginRequest(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return true;

  const forwardedHost = request.headers.get("x-forwarded-host")?.split(",")[0]?.trim();
  const host = forwardedHost || request.headers.get("host");
  if (!host) return false;

  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

export async function readLeadJson(request: Request) {
  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.toLowerCase().includes("application/json")) {
    return {
      ok: false as const,
      result: {
        status: 415,
        body: { ok: false, error: "unsupported_media_type" },
      } satisfies LeadCaptureResult,
    };
  }

  const declaredLength = Number(request.headers.get("content-length"));
  if (
    Number.isFinite(declaredLength) &&
    declaredLength > MAX_LEAD_BODY_BYTES
  ) {
    return {
      ok: false as const,
      result: {
        status: 413,
        body: { ok: false, error: "payload_too_large" },
      } satisfies LeadCaptureResult,
    };
  }

  const raw = await request.text();
  if (new TextEncoder().encode(raw).byteLength > MAX_LEAD_BODY_BYTES) {
    return {
      ok: false as const,
      result: {
        status: 413,
        body: { ok: false, error: "payload_too_large" },
      } satisfies LeadCaptureResult,
    };
  }

  try {
    return { ok: true as const, value: JSON.parse(raw) as unknown };
  } catch {
    return {
      ok: false as const,
      result: {
        status: 400,
        body: { ok: false, error: "bad_json" },
      } satisfies LeadCaptureResult,
    };
  }
}

export async function captureLead(
  input: unknown,
  source: LeadSource = "tasteloop-web",
): Promise<LeadCaptureResult> {
  let envelope: unknown = input;
  if (isPlainObject(input)) {
    envelope = {
      ...input,
      submissionId:
        "submissionId" in input ? input.submissionId : randomUUID(),
      source,
    };
  }

  const parsed = parseLeadSubmission(envelope, {
    defaultSource: source,
    requireSubmissionId: true,
  });
  if (!parsed.ok) {
    return {
      status: 422,
      body: {
        ok: false,
        error: parsed.error,
        field: parsed.field,
      },
    };
  }
  if (parsed.spam) return { status: 200, body: { ok: true } };

  const endpoint = process.env.API_BASE_URL?.replace(/\/$/, "");
  const apiKey = process.env.LEAD_API_KEY?.trim();
  if (!endpoint || !apiKey) {
    return {
      status: 503,
      body: { ok: false, error: "lead_capture_unconfigured" },
    };
  }

  try {
    const upstream = await fetch(`${endpoint}/leads`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
      },
      body: JSON.stringify(parsed.value),
      signal: AbortSignal.timeout(12_000),
      cache: "no-store",
    });
    const result: unknown = await upstream.json().catch(() => null);
    const upstreamBody = isPlainObject(result) ? result : {};

    if (upstream.ok && upstreamBody.ok === true) {
      return {
        status: upstream.status === 200 ? 200 : 201,
        body: {
          ok: true,
          id:
            typeof upstreamBody.id === "string"
              ? upstreamBody.id
              : parsed.value.submissionId,
        },
      };
    }

    if (upstream.status === 409) {
      return {
        status: 409,
        body: { ok: false, error: "idempotency_conflict" },
      };
    }

    if (upstreamBody.persisted === true) {
      return {
        status: 503,
        body: {
          ok: false,
          error: "lead_notification_failed",
          id:
            typeof upstreamBody.id === "string"
              ? upstreamBody.id
              : parsed.value.submissionId,
          persisted: true,
        },
      };
    }

    if (upstream.status === 429) {
      return {
        status: 429,
        body: { ok: false, error: "lead_rate_limited" },
      };
    }

    return {
      status: 502,
      body: { ok: false, error: "lead_backend_rejected" },
    };
  } catch {
    return {
      status: 502,
      body: { ok: false, error: "lead_backend_unavailable" },
    };
  }
}
