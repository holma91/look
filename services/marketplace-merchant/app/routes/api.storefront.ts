import { LoaderFunctionArgs, json } from "@remix-run/node";
import { log } from "node_modules/@shopify/shopify-api/lib/logger/log";
import db from "../db.server";

export async function getStorefrontAccessToken(domain: string) {
  const shop = await db.shop.findFirst({
    where: { domain },
  });

  return shop?.storefrontAccessToken;
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const domain = url.searchParams.get("domain");

  // given the store, retrieve access token
  const storefrontAccessToken = await getStorefrontAccessToken(domain!);

  return json({ storefrontAccessToken });
};
