import "@shopify/shopify-app-remix/adapters/node";
import {
  AppDistribution,
  DeliveryMethod,
  shopifyApp,
  LATEST_API_VERSION,
} from "@shopify/shopify-app-remix/server";
import { PrismaSessionStorage } from "@shopify/shopify-app-session-storage-prisma";
import { restResources } from "@shopify/shopify-api/rest/admin/2023-10";
import prisma from "./db.server";
import { getShopDetails } from "./handlers/queries/get-shop-details";
import { getOrCreateStorefrontAccessToken } from "./handlers/helper";
import { Session } from "@shopify/shopify-api";

const shopify = shopifyApp({
  apiKey: process.env.SHOPIFY_API_KEY,
  apiSecretKey: process.env.SHOPIFY_API_SECRET || "",
  apiVersion: LATEST_API_VERSION,
  scopes: process.env.SCOPES?.split(","),
  appUrl: process.env.SHOPIFY_APP_URL || "",
  authPathPrefix: "/auth",
  sessionStorage: new PrismaSessionStorage(prisma), // when merchant installs the app
  distribution: AppDistribution.AppStore,
  restResources,
  webhooks: {
    APP_UNINSTALLED: {
      deliveryMethod: DeliveryMethod.Http,
      callbackUrl: "/webhooks",
    },
  },
  hooks: {
    afterAuth: afterAuthHook,
  },
  future: {
    v3_webhookAdminContext: true,
    v3_authenticatePublic: true,
  },
  ...(process.env.SHOP_CUSTOM_DOMAIN
    ? { customShopDomains: [process.env.SHOP_CUSTOM_DOMAIN] }
    : {}),
});

export default shopify;
export const apiVersion = LATEST_API_VERSION;
export const addDocumentResponseHeaders = shopify.addDocumentResponseHeaders;
export const authenticate = shopify.authenticate;
export const unauthenticated = shopify.unauthenticated;
export const login = shopify.login;
export const registerWebhooks = shopify.registerWebhooks;
export const sessionStorage = shopify.sessionStorage;

async function afterAuthHook({ session }: { session: Session }) {
  const { id, shop, accessToken } = session;
  const { name, country } = await getShopDetails(shop, accessToken as string);
  const storefrontAccessToken = await getOrCreateStorefrontAccessToken(
    shop,
    accessToken as string
  );

  const shopData = {
    domain: shop,
    storefrontAccessToken,
    name,
    country,
  };

  try {
    await prisma.shop.upsert({
      where: { domain: shop },
      update: shopData,
      create: shopData,
    });
    console.log(`Shop data for ${shop} upserted successfully.`);
  } catch (error) {
    console.log("Failed to add shop to db:", error);
  }

  shopify.registerWebhooks({ session });
}
