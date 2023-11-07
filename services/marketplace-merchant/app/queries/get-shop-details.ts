import { Shopify } from "@shopify/shopify-api";

const SHOP_DETAILS = `
  {
    shop {
      name
      billingAddress {
        country
      }
    }
  }
`;

export const getShopDetails = async (
  shop: string,
  token: string | undefined
) => {
  return { name: "shop-name", country: "shop-country" };
};
