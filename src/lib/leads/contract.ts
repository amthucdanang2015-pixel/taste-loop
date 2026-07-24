export const LEAD_TYPES = [
  "taste-review",
  "first-loop",
  "product-loop",
  "newsletter",
  "contact",
  "service-inquiry",
  "reference",
  // Compatibility with retired forms and URLs. These values remain accepted
  // while their callers are migrated or redirected.
  "screen-rescue",
  "product-rescue",
  "vibe-audit",
  "sprint",
  "rescue",
  "retainer",
  "pro-waitlist",
] as const;

export type LeadType = (typeof LEAD_TYPES)[number];

export const PRIMARY_LEAD_TYPES = [
  "taste-review",
  "first-loop",
  "product-loop",
] as const satisfies readonly LeadType[];

export const LEAD_SOURCES = [
  "tasteloop-web",
  "tasteloop-prompt-gate",
  "tasteloop-e2e",
] as const;

export const MAX_LEAD_BODY_BYTES = 24 * 1024;
export const MAX_LEAD_FIELDS = 20;
export const MAX_LEAD_FIELD_LENGTH = 5_000;
export const MAX_LEAD_TOTAL_FIELD_LENGTH = 20_000;

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const EMAIL_PATTERN = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const FIELD_NAME_PATTERN = /^[a-z][a-z0-9-]{0,79}$/;
const primaryTypes = new Set<string>(PRIMARY_LEAD_TYPES);
const leadTypes = new Set<string>(LEAD_TYPES);
const leadSources = new Set<string>(LEAD_SOURCES);

const exactFields: Partial<Record<LeadType, readonly string[]>> = {
  "taste-review": ["decision", "name", "email", "engagement", "stage", "url", "context"],
  "first-loop": ["decision", "name", "email", "engagement", "stage", "url", "context"],
  "product-loop": ["decision", "name", "email", "engagement", "stage", "url", "context"],
  newsletter: ["email"],
};

const requiredFields: Partial<Record<LeadType, readonly string[]>> = {
  "taste-review": ["decision", "name", "email", "engagement", "stage"],
  "first-loop": ["decision", "name", "email", "engagement", "stage"],
  "product-loop": ["decision", "name", "email", "engagement", "stage"],
  newsletter: ["email"],
};

export interface LeadSubmission {
  submissionId: string;
  leadType: LeadType;
  fields: Record<string, string>;
  source: (typeof LEAD_SOURCES)[number];
}

export type LeadContractError =
  | "bad_body"
  | "invalid_submission_id"
  | "invalid_lead_type"
  | "invalid_source"
  | "invalid_fields"
  | "empty_submission"
  | "missing_required_field"
  | "invalid_email"
  | "invalid_url";

export type LeadContractResult =
  | { ok: true; spam: true }
  | { ok: true; spam: false; value: LeadSubmission }
  | { ok: false; error: LeadContractError; field?: string };

interface ParseLeadOptions {
  defaultSource?: LeadSubmission["source"];
  requireSubmissionId?: boolean;
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (value === null || typeof value !== "object" || Array.isArray(value)) return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

function normalizeValue(value: string) {
  return value.replace(/\r\n?/g, "\n").trim();
}

/**
 * Canonical intake validation shared by the Next adapter and the Lambda.
 *
 * This function is deliberately dependency-free so both boundaries can apply
 * the exact same normalization while still treating Lambda validation as
 * authoritative for direct requests.
 */
export function parseLeadSubmission(
  input: unknown,
  options: ParseLeadOptions = {},
): LeadContractResult {
  if (!isPlainObject(input)) return { ok: false, error: "bad_body" };

  if ("hp" in input && typeof input.hp !== "string") {
    return { ok: false, error: "bad_body" };
  }
  if (typeof input.hp === "string" && input.hp.trim()) {
    return { ok: true, spam: true };
  }

  const allowedTopLevel = new Set(["submissionId", "leadType", "fields", "source", "hp"]);
  if (Object.keys(input).some((key) => !allowedTopLevel.has(key))) {
    return { ok: false, error: "bad_body" };
  }

  const submissionId =
    typeof input.submissionId === "string" ? input.submissionId.trim() : "";
  if (
    (options.requireSubmissionId ?? true) &&
    !UUID_PATTERN.test(submissionId)
  ) {
    return { ok: false, error: "invalid_submission_id" };
  }
  if (submissionId && !UUID_PATTERN.test(submissionId)) {
    return { ok: false, error: "invalid_submission_id" };
  }

  const leadType =
    typeof input.leadType === "string" ? input.leadType.trim() : "";
  if (!leadTypes.has(leadType)) {
    return { ok: false, error: "invalid_lead_type" };
  }

  const sourceValue =
    typeof input.source === "string"
      ? input.source.trim()
      : options.defaultSource ?? "tasteloop-web";
  if (!leadSources.has(sourceValue)) {
    return { ok: false, error: "invalid_source" };
  }

  if (!isPlainObject(input.fields)) {
    return { ok: false, error: "invalid_fields" };
  }

  const entries = Object.entries(input.fields);
  if (entries.length === 0 || entries.length > MAX_LEAD_FIELDS) {
    return { ok: false, error: "invalid_fields" };
  }

  const allowedFields = exactFields[leadType as LeadType];
  const allowedFieldSet = allowedFields ? new Set(allowedFields) : null;
  let totalLength = 0;
  const fields: Record<string, string> = {};

  for (const [key, rawValue] of entries) {
    if (
      !FIELD_NAME_PATTERN.test(key) ||
      (allowedFieldSet && !allowedFieldSet.has(key)) ||
      typeof rawValue !== "string" ||
      rawValue.length > MAX_LEAD_FIELD_LENGTH
    ) {
      return { ok: false, error: "invalid_fields", field: key };
    }
    const value = normalizeValue(rawValue);
    totalLength += value.length;
    if (totalLength > MAX_LEAD_TOTAL_FIELD_LENGTH) {
      return { ok: false, error: "invalid_fields" };
    }
    fields[key] = value;
  }

  if (!Object.values(fields).some((value) => value.length > 1)) {
    return { ok: false, error: "empty_submission" };
  }

  for (const field of requiredFields[leadType as LeadType] ?? []) {
    if (!fields[field]) {
      return { ok: false, error: "missing_required_field", field };
    }
  }

  if (fields.email) {
    const email = fields.email.toLowerCase();
    if (
      email.length > 254 ||
      !EMAIL_PATTERN.test(email) ||
      /[\r\n]/.test(email)
    ) {
      return { ok: false, error: "invalid_email", field: "email" };
    }
    fields.email = email;
  }

  if (fields.url) {
    try {
      const url = new URL(fields.url);
      if (url.protocol !== "http:" && url.protocol !== "https:") {
        return { ok: false, error: "invalid_url", field: "url" };
      }
    } catch {
      return { ok: false, error: "invalid_url", field: "url" };
    }
  }

  if (primaryTypes.has(leadType) && fields.engagement !== leadType) {
    return { ok: false, error: "invalid_fields", field: "engagement" };
  }

  return {
    ok: true,
    spam: false,
    value: {
      submissionId,
      leadType: leadType as LeadType,
      fields,
      source: sourceValue as LeadSubmission["source"],
    },
  };
}

export function stableLeadPayload(submission: LeadSubmission) {
  const sortedFields = Object.fromEntries(
    Object.entries(submission.fields).sort(([left], [right]) =>
      left.localeCompare(right),
    ),
  );
  return JSON.stringify({
    leadType: submission.leadType,
    fields: sortedFields,
    source: submission.source,
  });
}
