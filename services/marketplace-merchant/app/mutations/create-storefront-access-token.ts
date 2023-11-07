const STOREFRONT_ACCESS_TOKEN_CREATE = `
  mutation storefrontAccessTokenCreate($input: StorefrontAccessTokenInput!) {
    storefrontAccessTokenCreate(input: $input) {
      storefrontAccessToken {
        accessToken
      }
    }
  }
`;

export const createStorefrontAccessToken = async (
  shop: string,
  token: string | undefined
) => {
  const input = {
    title: "your-storefront-access-token-name",
  };

  return "your-storefront-access-token";
};
