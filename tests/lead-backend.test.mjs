import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import path from "node:path";
import ts from "typescript";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (relative) => readFile(path.join(root, relative), "utf8");

async function loadContract() {
  const source = await read("src/lib/leads/contract.ts");
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.ES2022,
      target: ts.ScriptTarget.ES2022,
    },
    fileName: "contract.ts",
  });
  return import(`data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`);
}

const validWorkSubmission = {
  submissionId: "3a53763d-0ec2-4e8f-b364-b0c3885ee185",
  leadType: "first-loop",
  source: "tasteloop-web",
  fields: {
    decision: "  Should we narrow the audience?  ",
    name: "TasteLoop QA",
    email: "  QA@Example.com ",
    engagement: "first-loop",
    stage: "prototype",
    url: "https://example.com/product",
    context: "We have two plausible segments.",
  },
};

test("lead contract normalizes a complete Work submission", async () => {
  const { parseLeadSubmission } = await loadContract();
  const parsed = parseLeadSubmission(validWorkSubmission);
  assert.equal(parsed.ok, true);
  assert.equal(parsed.spam, false);
  assert.equal(parsed.value.fields.decision, "Should we narrow the audience?");
  assert.equal(parsed.value.fields.email, "qa@example.com");
});

test("lead contract accepts newsletter and prompt-gate compatibility", async () => {
  const { parseLeadSubmission } = await loadContract();
  for (const source of ["tasteloop-web", "tasteloop-prompt-gate"]) {
    const parsed = parseLeadSubmission({
      submissionId: "a39b6b74-f71e-49db-9c30-45fc9bf0a20c",
      leadType: "newsletter",
      source,
      fields: { email: "reader@example.com" },
    });
    assert.equal(parsed.ok, true);
  }
});

test("lead contract keeps retired Taste Review submissions compatible", async () => {
  const { parseLeadSubmission } = await loadContract();
  const legacy = structuredClone(validWorkSubmission);
  legacy.leadType = "taste-review";
  legacy.fields.engagement = "taste-review";
  const parsed = parseLeadSubmission(legacy);
  assert.equal(parsed.ok, true);
  assert.equal(parsed.spam, false);
});

test("lead contract rejects malformed and under-specified input", async () => {
  const { parseLeadSubmission } = await loadContract();
  for (const input of [null, [], "lead", 7]) {
    assert.deepEqual(parseLeadSubmission(input), { ok: false, error: "bad_body" });
  }

  const missingDecision = structuredClone(validWorkSubmission);
  delete missingDecision.fields.decision;
  assert.deepEqual(parseLeadSubmission(missingDecision), {
    ok: false,
    error: "missing_required_field",
    field: "decision",
  });

  const unknownField = structuredClone(validWorkSubmission);
  unknownField.fields.company = "Not in the canonical Work contract";
  assert.deepEqual(parseLeadSubmission(unknownField), {
    ok: false,
    error: "invalid_fields",
    field: "company",
  });
});

test("lead contract enforces email, engagement, URL protocol, and UUID", async () => {
  const { parseLeadSubmission } = await loadContract();
  const cases = [
    ["email", "not-an-email", "invalid_email"],
    ["engagement", "product-loop", "invalid_fields"],
    ["url", "javascript:alert(1)", "invalid_url"],
  ];

  for (const [field, value, error] of cases) {
    const submission = structuredClone(validWorkSubmission);
    submission.fields[field] = value;
    const parsed = parseLeadSubmission(submission);
    assert.equal(parsed.ok, false);
    assert.equal(parsed.error, error);
    assert.equal(parsed.field, field);
  }

  const invalidId = structuredClone(validWorkSubmission);
  invalidId.submissionId = "not-a-uuid";
  assert.deepEqual(parseLeadSubmission(invalidId), {
    ok: false,
    error: "invalid_submission_id",
  });
});

test("lead contract makes payload hashing input stable and discards honeypots", async () => {
  const { parseLeadSubmission, stableLeadPayload } = await loadContract();
  const parsed = parseLeadSubmission(validWorkSubmission);
  assert.equal(parsed.ok, true);
  const reordered = {
    ...parsed.value,
    fields: Object.fromEntries(Object.entries(parsed.value.fields).reverse()),
  };
  assert.equal(stableLeadPayload(parsed.value), stableLeadPayload(reordered));

  assert.deepEqual(
    parseLeadSubmission({ ...validWorkSubmission, hp: "spam.example" }),
    { ok: true, spam: true },
  );
});

test("active lead infrastructure stays narrow and secret-safe", async () => {
  const [backend, infrastructure, resource, handler, nextAdapter, form, packageJson] =
    await Promise.all([
      read("amplify/backend.ts"),
      read("amplify/leads/resource.ts"),
      read("amplify/functions/lead-intake/resource.ts"),
      read("amplify/functions/lead-intake/handler.ts"),
      read("src/lib/leads/server.ts"),
      read("src/components/LeadForm.tsx"),
      read("package.json"),
    ]);

  assert.match(backend, /defineBackend\(\{\s*leadIntake\s*\}\)/);
  assert.doesNotMatch(backend, /defineBackend\(\{[^}]*\b(?:auth|storage|apiFunction)\b/);
  assert.match(infrastructure, /BillingMode\.PAY_PER_REQUEST/);
  assert.match(infrastructure, /TableEncryption\.AWS_MANAGED/);
  assert.match(infrastructure, /pointInTimeRecoverySpecification/);
  assert.match(infrastructure, /apiKeyRequired:\s*true/);
  assert.match(infrastructure, /addMethod\("POST"/);
  assert.doesNotMatch(infrastructure, /defaultCorsPreflightOptions|Cors\.ALL_ORIGINS/);
  assert.match(resource, /runtime:\s*24/);
  assert.match(resource, /secret\("RESEND_API_KEY"\)/);
  assert.match(handler, /Idempotency-Key/);
  assert.match(handler, /ConditionExpression:\s*"attribute_not_exists\(PK\)"/);
  assert.doesNotMatch(`${backend}\n${infrastructure}\n${resource}\n${handler}`, /re_[A-Za-z0-9]{20,}/);
  assert.match(nextAdapter, /process\.env\.LEAD_API_KEY/);
  assert.doesNotMatch(nextAdapter, /NEXT_PUBLIC_/);
  assert.match(form, /crypto\.randomUUID\(\)/);
  assert.match(form, /url\.protocol !== "http:"/);
  assert.match(packageJson, /"@aws-sdk\/client-dynamodb"/);
  assert.match(packageJson, /"@aws-sdk\/lib-dynamodb"/);
});
