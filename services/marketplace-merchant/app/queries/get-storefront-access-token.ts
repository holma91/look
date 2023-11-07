const STOREFRONT_ACCESS_TOKENS = `
  {
    shop {
      storefrontAccessTokens(first: 1) {
        edges {
          node {
            accessToken
          }
        }
      }
    }
  }
`;

export const getStorefrontAccessToken = async (
  shop: string,
  token: string | undefined
) => {
  return "your-storefront-access-token";
};
