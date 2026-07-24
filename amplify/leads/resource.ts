import {
  RemovalPolicy,
  Stack,
  Tags,
} from "aws-cdk-lib";
import {
  AccessLogFormat,
  ApiKey,
  ApiKeySourceType,
  EndpointType,
  JsonSchemaType,
  LambdaIntegration,
  LogGroupLogDestination,
  Period,
  RequestValidator,
  RestApi,
} from "aws-cdk-lib/aws-apigateway";
import {
  AttributeType,
  BillingMode,
  ProjectionType,
  Table,
  TableEncryption,
} from "aws-cdk-lib/aws-dynamodb";
import type { IFunction } from "aws-cdk-lib/aws-lambda";
import {
  LogGroup,
  RetentionDays,
} from "aws-cdk-lib/aws-logs";

export function defineLeadStore(stack: Stack) {
  const isBranchDeployment = Boolean(process.env.AWS_BRANCH);
  const removalPolicy = isBranchDeployment
    ? RemovalPolicy.RETAIN
    : RemovalPolicy.DESTROY;

  const table = new Table(stack, "LeadsTable", {
    partitionKey: { name: "PK", type: AttributeType.STRING },
    sortKey: { name: "SK", type: AttributeType.STRING },
    billingMode: BillingMode.PAY_PER_REQUEST,
    encryption: TableEncryption.AWS_MANAGED,
    deletionProtection: isBranchDeployment,
    pointInTimeRecoverySpecification: {
      pointInTimeRecoveryEnabled: isBranchDeployment,
      recoveryPeriodInDays: isBranchDeployment ? 35 : undefined,
    },
    removalPolicy,
  });

  table.addGlobalSecondaryIndex({
    indexName: "GSI1",
    partitionKey: { name: "GSI1PK", type: AttributeType.STRING },
    sortKey: { name: "GSI1SK", type: AttributeType.STRING },
    projectionType: ProjectionType.ALL,
  });

  Tags.of(table).add("Project", "TasteLoop");
  Tags.of(table).add("DataClassification", "CustomerProvided");
  Tags.of(stack).add("ManagedBy", "AmplifyGen2");

  return { table } as const;
}

export function defineLeadApi(
  stack: Stack,
  leadFunction: IFunction,
) {
  const isBranchDeployment = Boolean(process.env.AWS_BRANCH);
  const removalPolicy = isBranchDeployment
    ? RemovalPolicy.RETAIN
    : RemovalPolicy.DESTROY;
  const accessLogs = new LogGroup(stack, "LeadApiAccessLogs", {
    retention: RetentionDays.ONE_MONTH,
    removalPolicy,
  });

  const api = new RestApi(stack, "LeadRestApi", {
    restApiName: "vibetoreal-api",
    description: "TasteLoop lead intake REST API",
    apiKeySourceType: ApiKeySourceType.HEADER,
    endpointTypes: [EndpointType.REGIONAL],
    deployOptions: {
      stageName: "prod",
      accessLogDestination: new LogGroupLogDestination(accessLogs),
      accessLogFormat: AccessLogFormat.jsonWithStandardFields({
        ip: false,
        caller: false,
        user: false,
        requestTime: true,
        httpMethod: true,
        resourcePath: true,
        status: true,
        protocol: false,
        responseLength: true,
      }),
      dataTraceEnabled: false,
      metricsEnabled: true,
      throttlingBurstLimit: 5,
      throttlingRateLimit: 2,
      tracingEnabled: true,
    },
    cloudWatchRole: true,
    cloudWatchRoleRemovalPolicy: removalPolicy,
    retainDeployments: isBranchDeployment,
  });

  const requestModel = api.addModel("LeadRequestModel", {
    contentType: "application/json",
    description: "Bounded TasteLoop lead submission envelope",
    schema: {
      type: JsonSchemaType.OBJECT,
      additionalProperties: false,
      required: ["submissionId", "leadType", "fields", "source"],
      properties: {
        submissionId: {
          type: JsonSchemaType.STRING,
          minLength: 36,
          maxLength: 36,
        },
        leadType: {
          type: JsonSchemaType.STRING,
          minLength: 3,
          maxLength: 40,
        },
        source: {
          type: JsonSchemaType.STRING,
          minLength: 3,
          maxLength: 40,
        },
        hp: {
          type: JsonSchemaType.STRING,
          maxLength: 200,
        },
        fields: {
          type: JsonSchemaType.OBJECT,
          minProperties: 1,
          maxProperties: 20,
          additionalProperties: {
            type: JsonSchemaType.STRING,
            maxLength: 5_000,
          },
        },
      },
    },
  });
  const requestValidator = new RequestValidator(
    stack,
    "LeadRequestValidator",
    {
      restApi: api,
      validateRequestBody: true,
      validateRequestParameters: false,
    },
  );

  const integration = new LambdaIntegration(leadFunction, {
    allowTestInvoke: false,
    proxy: true,
  });
  const leads = api.root.addResource("leads");
  const post = leads.addMethod("POST", integration, {
    apiKeyRequired: true,
    requestModels: { "application/json": requestModel },
    requestValidator,
  });

  const apiKey = new ApiKey(stack, "LeadApiKey", {
    description: "Server-side TasteLoop intake key",
    enabled: true,
  });
  const usagePlan = api.addUsagePlan("LeadUsagePlan", {
    name: "TasteLoop lead intake",
    apiStages: [
      {
        api,
        stage: api.deploymentStage,
        throttle: [
          {
            method: post,
            throttle: { rateLimit: 2, burstLimit: 5 },
          },
        ],
      },
    ],
    quota: { limit: 500, period: Period.DAY },
    throttle: { rateLimit: 2, burstLimit: 5 },
  });
  usagePlan.addApiKey(apiKey);

  Tags.of(api).add("Project", "TasteLoop");
  Tags.of(apiKey).add("Project", "TasteLoop");
  Tags.of(stack).add("ManagedBy", "AmplifyGen2");

  return { api, apiKey } as const;
}
