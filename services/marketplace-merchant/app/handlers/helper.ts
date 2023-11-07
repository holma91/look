import { createStorefrontAccessToken } from "./mutations/create-storefront-access-token";
import { getStorefrontAccessToken } from "./queries/get-storefront-access-token";

export async function getOrCreateStorefrontAccessToken(
  shop: string,
  accessToken: string | undefined
) {
  const storefrontAccessToken = await getStorefrontAccessToken(
    shop,
    accessToken
  );

  return (
    storefrontAccessToken ||
    (await createStorefrontAccessToken(shop, accessToken))
  );
}
