import auth from '@react-native-firebase/auth';
import { UserProduct } from '../utils/types';

// api.ts
export const URL = 'https://1d00-85-230-9-36.ngrok-free.app';

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

  const token = await auth()?.currentUser?.getIdToken();

  const completeUrl = `${URL}/products`;

  const response = await fetch(completeUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(backendProduct),
  });

  if (!response.ok) {
    console.log('response:', response);

    throw new Error(
      `HTTP error in createProduct! status: ${response.status}, error: ${response.statusText}`
    );
  }

  return response.json();
};

export const likeProducts = async (products: UserProduct[]) => {
  const token = await auth()?.currentUser?.getIdToken();

  const response = await fetch(`${URL}/products/likes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ productUrls: products.map((p) => p.url) }),
  });
  return response;
};

export const unlikeProducts = async (products: UserProduct[]) => {
  const token = await auth()?.currentUser?.getIdToken();
  const response = await fetch(`${URL}/products/likes`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
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
  const completeUrl = `${URL}/products/lists`;
  const token = await auth()?.currentUser?.getIdToken();
  const response = await fetch(completeUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      id: listId,
      productUrls: selectedProducts.map((product) => product.url),
    }),
  });

  if (!response.ok) {
    throw new Error(
      `HTTP error in createPlist! status: ${response.status}, error: ${response.statusText}`
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
      `HTTP error in deleteFromPlist! status: ${response.status}, error: ${response.statusText}`
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
      `HTTP error in addToPlist! status: ${response.status}, error: ${response.statusText}`
    );
  }

  return response;
};
