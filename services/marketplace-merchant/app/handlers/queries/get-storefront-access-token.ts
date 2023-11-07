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
  accessToken: string | undefined
) => {
  const endpoint = `https://${shop}/admin/api/graphql.json`;
  const headers = {
    "Content-Type": "application/json",
    "X-Shopify-Access-Token": accessToken ?? "",
  };

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: headers,
      body: JSON.stringify({
        query: STOREFRONT_ACCESS_TOKENS,
      }),
    });

    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.statusText}`);
    }

    const jsonResponse = await response.json();
    const { data, errors } = jsonResponse;

    if (errors) {
      console.error("GraphQL errors:", errors);
      throw new Error(`GraphQL errors occurred`);
    }

    const tokens = data.shop.storefrontAccessTokens.edges;
    if (tokens.length === 0) {
      return null;
    }

    return tokens[0].node.accessToken;
  } catch (error) {
    console.error("Error retrieving storefront access token:", error);
    throw error;
  }
};
