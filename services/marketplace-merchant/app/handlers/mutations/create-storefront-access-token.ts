const STOREFRONT_ACCESS_TOKEN_CREATE = `
  mutation storefrontAccessTokenCreate($input: StorefrontAccessTokenInput!) {
    storefrontAccessTokenCreate(input: $input) {
      storefrontAccessToken {
        accessToken
      }
      userErrors {
        field
        message
      }
    }
  }
`;

export const createStorefrontAccessToken = async (
  shop: string,
  accessToken: string | undefined
) => {
  const endpoint = `https://${shop}/admin/api/graphql.json`;
  const headers = {
    "Content-Type": "application/json",
    "X-Shopify-Access-Token": accessToken ?? "",
  };
  const input = {
    title: "your-storefront-access-token-name", // Replace with a meaningful title for your token
  };

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: headers,
      body: JSON.stringify({
        query: STOREFRONT_ACCESS_TOKEN_CREATE,
        variables: { input },
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

    if (data.storefrontAccessTokenCreate.userErrors.length > 0) {
      // Handle user errors here
      console.error(
        "User errors:",
        data.storefrontAccessTokenCreate.userErrors
      );
      throw new Error("User errors occurred with storefrontAccessTokenCreate");
    }

    return data.storefrontAccessTokenCreate.storefrontAccessToken.accessToken;
  } catch (error) {
    console.error("Error creating storefront access token:", error);
    throw error;
  }
};
