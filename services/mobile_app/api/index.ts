import { UserProduct } from '../utils/types';

// api.ts
export const URL = 'https://77f8-85-230-9-36.ngrok-free.app';

export const createProduct = async (
  userId: string,
  product: UserProduct,
  domain: string
) => {
  // fix the brand name here
  const backendProduct = {
    ...product,
    domain: domain,
  };

  const response = await fetch(`${URL}/users/${userId}/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(backendProduct),
  });

  if (!response.ok) {
    throw new Error(
      `HTTP error! status: ${response.status}, error: ${response.statusText}`
    );
  }

  return response.json();
};

export const likeProducts = async (userId: string, products: UserProduct[]) => {
  const response = await fetch(`${URL}/users/${userId}/likes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ productUrls: products.map((p) => p.url) }),
  });
  return response;
};

export const unlikeProducts = async (
  userId: string,
  products: UserProduct[]
) => {
  const response = await fetch(`${URL}/users/${userId}/likes`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ productUrls: products.map((p) => p.url) }),
  });
  return response;
};

/*** P LIST STUFF ***/
export const createPlist = async (
  userId: string,
  listId: string,
  selectedProducts: UserProduct[]
) => {
  // Create plist
  const response = await fetch(`${URL}/users/${userId}/plists`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      id: listId,
      productUrls: selectedProducts.map((product) => product.url),
    }),
  });

  if (!response.ok) {
    throw new Error(
      `HTTP error! status: ${response.status}, error: ${response.statusText}`
    );
  }

  return response.json();
};

export const deleteFromPlist = async (
  userId: string,
  listId: string,
  products: UserProduct[]
) => {
  const response = await fetch(
    `${URL}/users/${userId}/plists/${listId}/products`,
    {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: listId,
        productUrls: products.map((p) => p.url),
      }),
    }
  );

  if (!response.ok) {
    throw new Error(
      `HTTP error! status: ${response.status}, error: ${response.statusText}`
    );
  }

  return response;
};

export const addToPlist = async (
  userId: string,
  listId: string,
  products: UserProduct[]
) => {
  const response = await fetch(
    `${URL}/users/${userId}/plists/${listId}/products`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: listId,
        productUrls: products.map((p) => p.url),
      }),
    }
  );

  if (!response.ok) {
    throw new Error(
      `HTTP error! status: ${response.status}, error: ${response.statusText}`
    );
  }

  return response;
};
