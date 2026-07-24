import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import {
  readBackendOutputs,
  readLeadApiKey,
  runAws,
} from "./backend-runtime.mjs";

const outputs = await readBackendOutputs();
const apiKey = readLeadApiKey(
  outputs.leadApiKeyId,
  outputs.leadsRegion,
);
const endpoint = outputs.leadApiUrl.replace(/\/$/, "");
const submissionId = randomUUID();
const marker = new Date().toISOString();
const payload = {
  submissionId,
  leadType: "first-loop",
  source: "tasteloop-e2e",
  fields: {
    decision: `[E2E] Verify the TasteLoop lead pipeline · ${marker}`,
    name: "TasteLoop QA",
    email: "mailnamnv@gmail.com",
    engagement: "first-loop",
    stage: "prototype",
    url: "https://example.com/tasteloop-e2e",
    context: "Automated sandbox verification. This record may be removed after review.",
  },
};

async function post(body) {
  const response = await fetch(`${endpoint}/leads`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(15_000),
  });
  const result = await response.json().catch(() => ({}));
  return { status: response.status, result };
}

const first = await post(payload);
assert.equal(first.status, 201, `Initial lead failed: ${first.result.error ?? first.status}`);
assert.equal(first.result.ok, true);
assert.equal(first.result.id, submissionId);

await new Promise((resolve) => setTimeout(resolve, 650));
const duplicate = await post(payload);
assert.equal(duplicate.status, 200);
assert.equal(duplicate.result.ok, true);
assert.equal(duplicate.result.duplicate, true);

await new Promise((resolve) => setTimeout(resolve, 650));
const conflict = await post({
  ...payload,
  fields: { ...payload.fields, decision: `${payload.fields.decision} changed` },
});
assert.equal(conflict.status, 409);
assert.equal(conflict.result.error, "idempotency_conflict");

const item = runAws([
  "dynamodb",
  "get-item",
  "--table-name",
  outputs.leadsTableName,
  "--key",
  JSON.stringify({
    PK: { S: `LEAD#${submissionId}` },
    SK: { S: "META" },
  }),
  "--projection-expression",
  "PK, SK, leadType, createdAt, notificationStatus, resendEmailId, notificationAttempts",
  "--consistent-read",
  "--region",
  outputs.leadsRegion,
]);
assert.equal(item.Item?.notificationStatus?.S, "accepted");
assert.ok(item.Item?.resendEmailId?.S, "Stored lead has no Resend email ID");
assert.equal(item.Item?.notificationAttempts?.N, "1");

await new Promise((resolve) => setTimeout(resolve, 650));
const spamId = randomUUID();
const spam = await post({ ...payload, submissionId: spamId, hp: "robot.example" });
assert.equal(spam.status, 200);
assert.equal(spam.result.ok, true);
const spamItem = runAws([
  "dynamodb",
  "get-item",
  "--table-name",
  outputs.leadsTableName,
  "--key",
  JSON.stringify({
    PK: { S: `LEAD#${spamId}` },
    SK: { S: "META" },
  }),
  "--projection-expression",
  "PK",
  "--consistent-read",
  "--region",
  outputs.leadsRegion,
]);
assert.equal(spamItem.Item, undefined, "Honeypot submission was persisted");

await new Promise((resolve) => setTimeout(resolve, 650));
const invalidId = randomUUID();
const invalid = await post({
  ...payload,
  submissionId: invalidId,
  fields: { ...payload.fields, url: "javascript:alert(1)" },
});
assert.equal(invalid.status, 422);
assert.equal(invalid.result.error, "invalid_url");

console.log(
  JSON.stringify(
    {
      ok: true,
      submissionId,
      tableName: outputs.leadsTableName,
      notificationStatus: item.Item.notificationStatus.S,
      resendEmailId: item.Item.resendEmailId.S,
      duplicateVerified: true,
      idempotencyConflictVerified: true,
      honeypotVerified: true,
      validationVerified: true,
      inboxConfirmation: "manual",
    },
    null,
    2,
  ),
);
