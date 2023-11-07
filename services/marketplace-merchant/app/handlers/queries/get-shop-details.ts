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
      body: JSON.stringify({ query: SHOP_DETAILS }),
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

    const { name, billingAddress } = data.shop;
    return {
      name: name,
      country: billingAddress.country,
    };
  } catch (error) {
    console.error("Error fetching shop details:", error);
    throw error;
  }
};
