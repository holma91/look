import { Filters, UserProduct } from '../utils/types';

// api.ts
const URL = 'https://ad0e-83-255-121-67.ngrok-free.app';

export const fetchWebsites = async (id: string) => {
  const completeUrl = `${URL}/users/${id}/websites`;
  const response = await fetch(completeUrl);

  if (!response.ok) {
    throw new Error(
      `Network response was not ok. Status code: ${response.status}`
    );
  }
  return response.json();
};

export const fetchCompanies = async (id: string) => {
  const completeUrl = `${URL}/users/${id}/companies`;
  const response = await fetch(completeUrl);

  if (!response.ok) {
    throw new Error(
      `Network response was not ok. Status code: ${response.status}`
    );
  }
  return response.json();
};

export const fetchBrands = async (id: string) => {
  const completeUrl = `${URL}/users/${id}/brands`;
  const response = await fetch(completeUrl);

  if (!response.ok) {
    throw new Error(
      `Network response was not ok. Status code: ${response.status}`
    );
  }
  return response.json();
};

export const fetchFavorites = async (id: string) => {
  const completeUrl = `${URL}/users/${id}/favorites`;
  const response = await fetch(completeUrl);

  if (!response.ok) {
    throw new Error(
      `Network response was not ok. Status code: ${response.status}`
    );
  }
  return response.json();
};

export const favoriteCompany = async (userId: string, company: string) => {
  const response = await fetch(`${URL}/users/${userId}/favorites`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id: company }),
  });
  return response;
};

export const unFavoriteCompany = async (userId: string, company: string) => {
  const response = await fetch(`${URL}/users/${userId}/favorites`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id: company }),
  });
  return response;
};

export const fetchLikes = async (
  id: string,
  filters: Filters
): Promise<UserProduct[]> => {
  console.log('filters:', filters);
  let completeUrl = '';
  try {
    const queryString = Object.entries(filters)
      .flatMap(([key, values]) =>
        values?.map(
          (value) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
        )
      )
      .join('&');
    completeUrl = `${URL}/users/${id}/likes?${queryString}`;
  } catch (e) {
    console.log('error:', e);
  }

  console.log('completeUrl:', completeUrl);

  const response = await fetch(completeUrl);

  if (!response.ok) {
    throw new Error(
      `Network response was not ok. Status code: ${response.status}`
    );
  }
  return response.json();
};

export const fetchHistory = async (id: string): Promise<UserProduct[]> => {
  const completeUrl = `${URL}/users/${id}/history`;
  const response = await fetch(completeUrl);

  if (!response.ok) {
    throw new Error(
      `Network response was not ok. Status code: ${response.status}`
    );
  }
  return response.json();
};

export const fetchPurchased = async (id: string): Promise<UserProduct[]> => {
  const completeUrl = `${URL}/users/${id}/purchased`;
  const response = await fetch(completeUrl);

  if (!response.ok) {
    throw new Error(
      `Network response was not ok. Status code: ${response.status}`
    );
  }
  return response.json();
};

type Product = {
  url: string;
  name: string;
  brand: string;
  price: string;
  currency: string;
  updated_at?: string;
  images: string[];
};

export const createProduct = async (
  userId: string,
  product: Product,
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

export const addProductImages = async (
  userId: string,
  productUrl: string,
  imageUrl: string
) => {
  const imageProduct = {
    product_url: productUrl,
    image_url: imageUrl,
  };

  const response = await fetch(`${URL}/users/${userId}/products/images`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(imageProduct),
  });

  if (!response.ok) {
    throw new Error(
      `HTTP error! status: ${response.status}, error: ${response.statusText}`
    );
  }

  return response.json();
};

export const likeProduct = async (userId: string, productUrl: string) => {
  const response = await fetch(`${URL}/users/${userId}/likes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ product_url: productUrl }),
  });
  return response;
};

export const unlikeProduct = async (userId: string, productUrl: string) => {
  const response = await fetch(`${URL}/users/${userId}/likes`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ product_url: productUrl }),
  });
  return response;
};
