import { defineBackend } from "@aws-amplify/backend";
import { Stack } from "aws-cdk-lib";
import { defineAssetDelivery } from "./assets/resource.ts";
import { leadIntake } from "./functions/lead-intake/resource.ts";
import { defineLeadApi, defineLeadStore } from "./leads/resource.ts";

/**
 * TasteLoop composes two deliberately narrow backend capabilities: immutable
 * Shipped media delivery and lead intake. The older auth/storage/catch-all API
 * sources remain dormant; importing them here would expose unfinished routes.
 */
const backend = defineBackend({ leadIntake });
const assets = defineAssetDelivery(backend.createStack("TasteLoopAssets"));
const leads = defineLeadStore(backend.createStack("TasteLoopLeadsData"));

backend.leadIntake.addEnvironment("VTR_TABLE_NAME", leads.table.tableName);
backend.leadIntake.addEnvironment(
  "LEAD_NOTIFICATION_EMAIL",
  process.env.LEAD_NOTIFICATION_EMAIL || "mailnamnv@gmail.com",
);
backend.leadIntake.addEnvironment(
  "RESEND_FROM_EMAIL",
  process.env.RESEND_FROM_EMAIL || "TasteLoop <onboarding@resend.dev>",
);
backend.leadIntake.resources.cfnResources.cfnFunction.reservedConcurrentExecutions = 5;
leads.table.grantReadWriteData(backend.leadIntake.resources.lambda);

const leadApi = defineLeadApi(
  backend.createStack("TasteLoopLeadsApi"),
  backend.leadIntake.resources.lambda,
);

backend.addOutput({
  custom: {
    assetsCdnUrl: `https://${assets.distribution.distributionDomainName}`,
    assetsBucketName: assets.bucket.bucketName,
    assetsDistributionId: assets.distribution.distributionId,
    assetsRegion: Stack.of(assets.bucket).region,
    leadApiUrl: leadApi.api.url,
    leadApiId: leadApi.api.restApiId,
    leadApiKeyId: leadApi.apiKey.keyId,
    leadApiName: leadApi.api.restApiName,
    leadFunctionName: backend.leadIntake.resources.lambda.functionName,
    leadsTableName: leads.table.tableName,
    leadsRegion: Stack.of(leads.table).region,
  },
});
