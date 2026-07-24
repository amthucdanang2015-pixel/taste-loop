import { createHash } from "node:crypto";
import {
  DynamoDBClient,
} from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import type {
  APIGatewayProxyHandler,
  APIGatewayProxyResult,
} from "aws-lambda";
import {
  MAX_LEAD_BODY_BYTES,
  parseLeadSubmission,
  stableLeadPayload,
  type LeadSubmission,
} from "../../../src/lib/leads/contract";

const documentClient = DynamoDBDocumentClient.from(new DynamoDBClient({}), {
  marshallOptions: { removeUndefinedValues: true },
});

const RESPONSE_HEADERS = {
  "Cache-Control": "no-store",
  "Content-Type": "application/json; charset=utf-8",
  "X-Content-Type-Options": "nosniff",
} as const;

interface StoredLead {
  PK: string;
  SK: "META";
  payloadHash: string;
  notificationStatus?: "pending" | "accepted" | "failed";
  resendEmailId?: string;
}

interface NotificationResult {
  ok: boolean;
  emailId?: string;
  errorCode?: string;
  attempts: number;
}

function requiredEnvironment(name: string) {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`missing_environment:${name}`);
  return value;
}

function response(
  statusCode: number,
  body: Record<string, unknown>,
): APIGatewayProxyResult {
  return {
    statusCode,
    headers: RESPONSE_HEADERS,
    body: JSON.stringify(body),
  };
}

function log(
  level: "info" | "warn" | "error",
  event: string,
  values: Record<string, unknown>,
) {
  const entry = JSON.stringify({ event, ...values });
  if (level === "error") console.error(entry);
  else if (level === "warn") console.warn(entry);
  else console.info(entry);
}

function isObject(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function decodeBody(
  body: string | null,
  isBase64Encoded: boolean | undefined,
) {
  if (body === null) return "";
  return isBase64Encoded
    ? Buffer.from(body, "base64").toString("utf8")
    : body;
}

function fieldLabel(name: string) {
  const known: Record<string, string> = {
    decision: "Decision",
    name: "Name",
    email: "Email",
    engagement: "Closest loop",
    stage: "What exists today",
    url: "Product URL",
    context: "Why this decision is hard",
  };
  return known[name] ?? name.replace(/-/g, " ");
}

function notificationText(
  submission: LeadSubmission,
  createdAt: string,
) {
  const fieldLines = Object.entries(submission.fields)
    .filter(([, value]) => value)
    .map(([key, value]) => `${fieldLabel(key)}:\n${value}`)
    .join("\n\n");

  return [
    "A new decision was submitted to TasteLoop.",
    "",
    `Loop: ${submission.leadType}`,
    `Received: ${createdAt}`,
    `Submission ID: ${submission.submissionId}`,
    "",
    fieldLines,
  ].join("\n");
}

function resendErrorCode(status: number) {
  if (status === 429) return "resend_rate_limited";
  if (status >= 500) return "resend_server_error";
  if (status === 401 || status === 403) return "resend_authorization";
  if (status >= 400) return "resend_rejected";
  return "resend_invalid_response";
}

function isRetryableStatus(status: number) {
  return status === 429 || status >= 500;
}

async function wait(milliseconds: number) {
  await new Promise((resolve) => setTimeout(resolve, milliseconds));
}

async function sendNotification(
  submission: LeadSubmission,
  createdAt: string,
): Promise<NotificationResult> {
  const apiKey = requiredEnvironment("RESEND_API_KEY");
  const recipient = requiredEnvironment("LEAD_NOTIFICATION_EMAIL");
  const from = requiredEnvironment("RESEND_FROM_EMAIL");
  const payload = {
    from,
    to: [recipient],
    subject: `New TasteLoop decision · ${submission.leadType}`,
    text: notificationText(submission, createdAt),
    ...(submission.fields.email
      ? { reply_to: submission.fields.email }
      : {}),
    tags: [{ name: "lead_type", value: submission.leadType }],
  };

  let lastErrorCode = "resend_unavailable";
  for (let attempt = 1; attempt <= 2; attempt += 1) {
    try {
      const resendResponse = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "Idempotency-Key": `lead-notification/${submission.submissionId}`,
        },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(7_000),
      });

      if (resendResponse.ok) {
        const result: unknown = await resendResponse.json().catch(() => null);
        const emailId =
          isObject(result) && typeof result.id === "string"
            ? result.id
            : undefined;
        if (emailId) return { ok: true, emailId, attempts: attempt };
        return {
          ok: false,
          errorCode: "resend_invalid_response",
          attempts: attempt,
        };
      }

      lastErrorCode = resendErrorCode(resendResponse.status);
      if (!isRetryableStatus(resendResponse.status) || attempt === 2) {
        return { ok: false, errorCode: lastErrorCode, attempts: attempt };
      }
    } catch (error) {
      lastErrorCode =
        error instanceof Error && error.name === "TimeoutError"
          ? "resend_timeout"
          : "resend_unavailable";
      if (attempt === 2) {
        return { ok: false, errorCode: lastErrorCode, attempts: attempt };
      }
    }
    await wait(250 * attempt);
  }

  return { ok: false, errorCode: lastErrorCode, attempts: 2 };
}

async function loadExistingLead(
  tableName: string,
  submissionId: string,
) {
  const result = await documentClient.send(
    new GetCommand({
      TableName: tableName,
      Key: { PK: `LEAD#${submissionId}`, SK: "META" },
      ConsistentRead: true,
    }),
  );
  return result.Item as StoredLead | undefined;
}

async function createOrLoadLead(
  tableName: string,
  submission: LeadSubmission,
  payloadHash: string,
  createdAt: string,
) {
  const item = {
    PK: `LEAD#${submission.submissionId}`,
    SK: "META",
    GSI1PK: `LEADTYPE#${submission.leadType}`,
    GSI1SK: `${createdAt}#${submission.submissionId}`,
    id: submission.submissionId,
    schemaVersion: 1,
    entityType: "LEAD",
    type: "LEAD",
    leadType: submission.leadType,
    status: "new",
    fields: submission.fields,
    source: submission.source,
    payloadHash,
    notificationStatus: "pending",
    notificationAttempts: 0,
    createdAt,
    updatedAt: createdAt,
  };

  try {
    await documentClient.send(
      new PutCommand({
        TableName: tableName,
        Item: item,
        ConditionExpression: "attribute_not_exists(PK)",
      }),
    );
    return { item: item as StoredLead, duplicate: false };
  } catch (error) {
    if (
      !(error instanceof Error) ||
      error.name !== "ConditionalCheckFailedException"
    ) {
      throw error;
    }
    const existing = await loadExistingLead(
      tableName,
      submission.submissionId,
    );
    if (!existing) throw new Error("idempotency_record_missing");
    return { item: existing, duplicate: true };
  }
}

async function recordNotification(
  tableName: string,
  submission: LeadSubmission,
  payloadHash: string,
  result: NotificationResult,
) {
  const updatedAt = new Date().toISOString();
  if (result.ok && result.emailId) {
    await documentClient.send(
      new UpdateCommand({
        TableName: tableName,
        Key: { PK: `LEAD#${submission.submissionId}`, SK: "META" },
        ConditionExpression: "payloadHash = :payloadHash",
        UpdateExpression:
          "SET notificationStatus = :status, resendEmailId = :emailId, lastNotificationAttemptAt = :updatedAt, updatedAt = :updatedAt REMOVE notificationErrorCode ADD notificationAttempts :attempts",
        ExpressionAttributeValues: {
          ":payloadHash": payloadHash,
          ":status": "accepted",
          ":emailId": result.emailId,
          ":updatedAt": updatedAt,
          ":attempts": result.attempts,
        },
      }),
    );
    return;
  }

  await documentClient.send(
    new UpdateCommand({
      TableName: tableName,
      Key: { PK: `LEAD#${submission.submissionId}`, SK: "META" },
      ConditionExpression: "payloadHash = :payloadHash",
      UpdateExpression:
        "SET notificationStatus = :status, notificationErrorCode = :errorCode, lastNotificationAttemptAt = :updatedAt, updatedAt = :updatedAt ADD notificationAttempts :attempts",
      ExpressionAttributeValues: {
        ":payloadHash": payloadHash,
        ":status": "failed",
        ":errorCode": result.errorCode ?? "resend_unavailable",
        ":updatedAt": updatedAt,
        ":attempts": result.attempts,
      },
    }),
  );
}

export const handler: APIGatewayProxyHandler = async (event) => {
  const requestId = event.requestContext.requestId;

  if (event.httpMethod !== "POST" || event.path !== "/leads") {
    return response(404, { ok: false, error: "not_found" });
  }

  const contentType =
    event.headers["content-type"] ?? event.headers["Content-Type"] ?? "";
  if (!contentType.toLowerCase().includes("application/json")) {
    return response(415, { ok: false, error: "unsupported_media_type" });
  }

  const rawBody = decodeBody(event.body, event.isBase64Encoded);
  if (Buffer.byteLength(rawBody, "utf8") > MAX_LEAD_BODY_BYTES) {
    return response(413, { ok: false, error: "payload_too_large" });
  }

  let input: unknown;
  try {
    input = JSON.parse(rawBody);
  } catch {
    return response(400, { ok: false, error: "bad_json" });
  }

  const parsed = parseLeadSubmission(input, { requireSubmissionId: true });
  if (!parsed.ok) {
    log("warn", "lead.validation_rejected", {
      requestId,
      error: parsed.error,
      field: parsed.field,
    });
    return response(422, {
      ok: false,
      error: parsed.error,
      field: parsed.field,
    });
  }
  if (parsed.spam) {
    log("info", "lead.spam_discarded", { requestId });
    return response(200, { ok: true });
  }

  const submission = parsed.value;
  const tableName = requiredEnvironment("VTR_TABLE_NAME");
  const payloadHash = createHash("sha256")
    .update(stableLeadPayload(submission))
    .digest("hex");
  const createdAt = new Date().toISOString();

  try {
    const stored = await createOrLoadLead(
      tableName,
      submission,
      payloadHash,
      createdAt,
    );

    if (stored.item.payloadHash !== payloadHash) {
      log("warn", "lead.idempotency_conflict", {
        requestId,
        submissionId: submission.submissionId,
        leadType: submission.leadType,
      });
      return response(409, {
        ok: false,
        error: "idempotency_conflict",
      });
    }

    if (
      stored.item.notificationStatus === "accepted" &&
      stored.item.resendEmailId
    ) {
      log("info", "lead.duplicate_accepted", {
        requestId,
        submissionId: submission.submissionId,
        leadType: submission.leadType,
      });
      return response(200, {
        ok: true,
        id: submission.submissionId,
        duplicate: true,
        notificationStatus: "accepted",
      });
    }

    const notification = await sendNotification(submission, createdAt);
    await recordNotification(
      tableName,
      submission,
      payloadHash,
      notification,
    );

    if (!notification.ok) {
      log("error", "lead.notification_failed", {
        requestId,
        submissionId: submission.submissionId,
        leadType: submission.leadType,
        error: notification.errorCode,
      });
      return response(503, {
        ok: false,
        error: "notification_failed",
        id: submission.submissionId,
        persisted: true,
      });
    }

    log("info", "lead.accepted", {
      requestId,
      submissionId: submission.submissionId,
      leadType: submission.leadType,
      duplicate: stored.duplicate,
      resendEmailId: notification.emailId,
    });
    return response(stored.duplicate ? 200 : 201, {
      ok: true,
      id: submission.submissionId,
      duplicate: stored.duplicate,
      notificationStatus: "accepted",
    });
  } catch (error) {
    log("error", "lead.internal_error", {
      requestId,
      submissionId: submission.submissionId,
      leadType: submission.leadType,
      error:
        error instanceof Error ? error.name : "UnknownError",
    });
    return response(500, { ok: false, error: "internal_error" });
  }
};
