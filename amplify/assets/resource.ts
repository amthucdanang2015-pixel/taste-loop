import { fileURLToPath } from "node:url";
import {
  Duration,
  RemovalPolicy,
  Stack,
  Tags,
} from "aws-cdk-lib";
import {
  AllowedMethods,
  CachePolicy,
  CfnOriginAccessControl,
  Distribution,
  HttpVersion,
  PriceClass,
  ResponseHeadersPolicy,
  ViewerProtocolPolicy,
} from "aws-cdk-lib/aws-cloudfront";
import { S3BucketOrigin } from "aws-cdk-lib/aws-cloudfront-origins";
import {
  BlockPublicAccess,
  Bucket,
  BucketEncryption,
  CfnBucketPolicy,
  ObjectOwnership,
} from "aws-cdk-lib/aws-s3";
import {
  BucketDeployment,
  CacheControl,
  Source,
} from "aws-cdk-lib/aws-s3-deployment";

const sourcePath = fileURLToPath(new URL("../../public/assets/shipped/", import.meta.url));

export function defineAssetDelivery(stack: Stack) {
  const isBranchDeployment = Boolean(process.env.AWS_BRANCH);
  const removalPolicy = isBranchDeployment ? RemovalPolicy.RETAIN : RemovalPolicy.DESTROY;

  const bucket = new Bucket(stack, "AssetsBucket", {
    autoDeleteObjects: !isBranchDeployment,
    blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
    encryption: BucketEncryption.S3_MANAGED,
    enforceSSL: true,
    objectOwnership: ObjectOwnership.BUCKET_OWNER_ENFORCED,
    removalPolicy,
    versioned: true,
    lifecycleRules: [
      {
        abortIncompleteMultipartUploadAfter: Duration.days(7),
        noncurrentVersionExpiration: Duration.days(30),
      },
    ],
  });

  const distribution = new Distribution(stack, "AssetsDistribution", {
    comment: "TasteLoop shipped-product media",
    defaultBehavior: {
      allowedMethods: AllowedMethods.ALLOW_GET_HEAD,
      cachePolicy: CachePolicy.CACHING_OPTIMIZED,
      compress: true,
      origin: S3BucketOrigin.withOriginAccessControl(bucket, {
        originPath: "/site",
      }),
      responseHeadersPolicy: ResponseHeadersPolicy.CORS_ALLOW_ALL_ORIGINS_AND_SECURITY_HEADERS,
      viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
    },
    errorResponses: [403, 404].map((httpStatus) => ({
      httpStatus,
      ttl: Duration.minutes(1),
    })),
    httpVersion: HttpVersion.HTTP2_AND_3,
    priceClass: PriceClass.PRICE_CLASS_200,
  });
  distribution.applyRemovalPolicy(removalPolicy);

  // A retained private distribution also needs its origin access control and
  // bucket policy. Retaining only the bucket/distribution would leave an
  // unreachable CDN (or a stack deletion failure caused by the in-use OAC).
  if (isBranchDeployment) {
    for (const construct of stack.node.findAll()) {
      if (
        construct instanceof CfnOriginAccessControl ||
        construct instanceof CfnBucketPolicy
      ) {
        construct.applyRemovalPolicy(RemovalPolicy.RETAIN);
      }
    }
  }

  new BucketDeployment(stack, "DeployAssets", {
    cacheControl: [
      CacheControl.setPublic(),
      CacheControl.maxAge(Duration.hours(1)),
      CacheControl.sMaxAge(Duration.days(365)),
      CacheControl.staleWhileRevalidate(Duration.days(1)),
    ],
    destinationBucket: bucket,
    destinationKeyPrefix: "site/shipped",
    distribution,
    distributionPaths: ["/shipped/*"],
    outputObjectKeys: false,
    prune: true,
    retainOnDelete: isBranchDeployment,
    sources: [
      Source.asset(sourcePath, {
        exclude: [".DS_Store", "**/.DS_Store"],
      }),
    ],
    waitForDistributionInvalidation: true,
  });

  Tags.of(bucket).add("Project", "TasteLoop");
  Tags.of(distribution).add("Project", "TasteLoop");
  Tags.of(stack).add("ManagedBy", "AmplifyGen2");

  return { bucket, distribution } as const;
}
