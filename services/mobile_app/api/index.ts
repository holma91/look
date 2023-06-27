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

export const favoriteWebsite = async (userId: string, domain: string) => {
  const response = await fetch(`${URL}/users/${userId}/favorites`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ domain: domain }),
  });
  return response;
};

export const unFavoriteWebsite = async (userId: string, domain: string) => {
  const response = await fetch(`${URL}/users/${userId}/favorites`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ domain: domain }),
  });
  return response;
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
