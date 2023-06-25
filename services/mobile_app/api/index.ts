// api.ts
const URL = 'http://localhost:8004';

export const fetchWebsites = async (id: string) => {
  const completeUrl = `${URL}/websites/?user_id=${id}`;

  const response = await fetch(completeUrl);

  if (!response.ok) {
    throw new Error(
      `Network response was not ok. Status code: ${response.status}`
    );
  }
  return response.json();
};

export const unFavoriteWebsite = async (userId: string, domain: string) => {
  const response = await fetch(`${URL}/users/${userId}/favorites/${domain}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error(
      `Network response was not ok. Status code: ${response.status}`
    );
  }
};

export const favoriteWebsite = async (userId: string, domain: string) => {
  const response = await fetch(`${URL}/users/${userId}/favorites/${domain}`, {
    method: 'POST',
  });

  if (!response.ok) {
    throw new Error(
      `Network response was not ok. Status code: ${response.status}`
    );
  }

  const data = await response.json();
  return data;
};

export const fetchLikes = async (id: string) => {
  const completeUrl = `${URL}/users/${id}/likes`;
  const response = await fetch(completeUrl);

  if (!response.ok) {
    throw new Error(
      `Network response was not ok. Status code: ${response.status}`
    );
  }
  return response.json();
};

export const fetchHistory = async (id: string) => {
  const completeUrl = `${URL}/users/${id}/history`;
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
