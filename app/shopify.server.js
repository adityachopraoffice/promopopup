import "@shopify/shopify-app-remix/adapters/node";
import {
  AppDistribution,
  shopifyApp,
  BillingInterval,
} from "@shopify/shopify-app-remix/server";
import { PrismaSessionStorage } from "@shopify/shopify-app-session-storage-prisma";
import prisma from "./db.server";

const shopify = shopifyApp({
  apiKey: process.env.SHOPIFY_API_KEY,
  apiSecretKey: process.env.SHOPIFY_API_SECRET || "",
  apiVersion: "2024-01",
  scopes: ["read_products", "write_products"],
  appUrl: process.env.SHOPIFY_APP_URL || process.env.HOST || "",
  authPathPrefix: "/auth",
  sessionStorage: new PrismaSessionStorage(prisma),
  distribution: AppDistribution.AppStore,
  isEmbeddedApp: true,
  useOnlineTokens: true,
  future: {
    unstable_newEmbeddedAuthStrategy: true,
    expiringOfflineAccessTokens: true,
  },
  billing: {
    basic: {
      lineItems: [
        {
          amount: 4.99,
          currencyCode: "USD",
          interval: BillingInterval.Every30Days,
        },
      ],
    },
    pro: {
      lineItems: [
        {
          amount: 9.99,
          currencyCode: "USD",
          interval: BillingInterval.Every30Days,
        },
      ],
    },
  },
});

export default shopify;
export const authenticate = shopify.authenticate;
export const unauthenticated = shopify.unauthenticated;
export const login = shopify.login;
export const registerWebhooks = shopify.registerWebhooks;
export const sessionStorage = shopify.sessionStorage;
export const addDocumentResponseHeaders = shopify.addDocumentResponseHeaders;
