import assert from "node:assert/strict";
import {
  readBackendOutputs,
  runAws,
} from "./backend-runtime.mjs";

const outputs = await readBackendOutputs();
const regionArgs = ["--region", outputs.leadsRegion];

const table = runAws([
  "dynamodb",
  "describe-table",
  "--table-name",
  outputs.leadsTableName,
  ...regionArgs,
]);
assert.equal(
  table.Table?.BillingModeSummary?.BillingMode,
  "PAY_PER_REQUEST",
  "Lead table must use on-demand billing",
);
assert.deepEqual(table.Table?.KeySchema, [
  { AttributeName: "PK", KeyType: "HASH" },
  { AttributeName: "SK", KeyType: "RANGE" },
]);
assert.ok(
  table.Table?.GlobalSecondaryIndexes?.some(
    (index) => index.IndexName === "GSI1",
  ),
  "Lead table is missing GSI1",
);

const lambda = runAws([
  "lambda",
  "get-function-configuration",
  "--function-name",
  outputs.leadFunctionName,
  "--query",
  "{FunctionName:FunctionName,Runtime:Runtime,EnvironmentKeys:keys(Environment.Variables)}",
  ...regionArgs,
]);
assert.equal(lambda.Runtime, "nodejs24.x");
for (const key of [
  "RESEND_API_KEY",
  "VTR_TABLE_NAME",
  "LEAD_NOTIFICATION_EMAIL",
  "RESEND_FROM_EMAIL",
]) {
  assert.ok(
    lambda.EnvironmentKeys?.includes(key),
    `Lead Lambda is missing environment key ${key}`,
  );
}

const concurrency = runAws([
  "lambda",
  "get-function-concurrency",
  "--function-name",
  outputs.leadFunctionName,
  ...regionArgs,
]);
assert.equal(concurrency.ReservedConcurrentExecutions, 5);

const resources = runAws([
  "apigateway",
  "get-resources",
  "--rest-api-id",
  outputs.leadApiId,
  ...regionArgs,
]);
const rootResource = resources.items?.find((resource) => resource.path === "/");
const leadsResource = resources.items?.find(
  (resource) => resource.path === "/leads",
);
assert.ok(rootResource, "Lead API root resource is missing");
assert.ok(leadsResource, "Lead API /leads resource is missing");
assert.deepEqual(
  Object.keys(leadsResource.resourceMethods ?? {}).sort(),
  ["POST"],
  "Lead API must expose only POST /leads",
);
assert.equal(
  resources.items?.length,
  2,
  "Lead API contains an unexpected public resource",
);

const method = runAws([
  "apigateway",
  "get-method",
  "--rest-api-id",
  outputs.leadApiId,
  "--resource-id",
  leadsResource.id,
  "--http-method",
  "POST",
  ...regionArgs,
]);
assert.equal(method.apiKeyRequired, true);
assert.equal(method.authorizationType, "NONE");

const apiKey = runAws([
  "apigateway",
  "get-api-key",
  "--api-key",
  outputs.leadApiKeyId,
  "--query",
  "{enabled:enabled}",
  ...regionArgs,
]);
assert.equal(apiKey.enabled, true);

console.log(
  JSON.stringify(
    {
      ok: true,
      api: {
        name: outputs.leadApiName,
        route: "POST /leads",
        apiKeyRequired: true,
      },
      lambda: {
        runtime: lambda.Runtime,
        reservedConcurrency: concurrency.ReservedConcurrentExecutions,
      },
      table: {
        name: outputs.leadsTableName,
        billingMode: table.Table.BillingModeSummary.BillingMode,
        index: "GSI1",
      },
    },
    null,
    2,
  ),
);
