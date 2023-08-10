import { FilterType, UserProduct } from '../utils/types';

// api.ts
const URL = 'https://77f8-85-230-9-36.ngrok-free.app';

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

export const fetchProducts = async (
  id: string,
  filter: FilterType
): Promise<UserProduct[]> => {
  let completeUrl = '';
  try {
    const queryString = Object.entries(filter)
      .flatMap(([key, values]) =>
        values?.map(
          (value) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
        )
      )
      .join('&');
    completeUrl = `${URL}/users/${id}/products?${queryString}`;
  } catch (e) {
    console.log('error:', e);
  }

  const response = await fetch(completeUrl);

  if (!response.ok) {
    console.log('response:', response);

    throw new Error(
      `Network response was not ok. Status code: ${response.status}`
    );
  }
  return response.json();
};

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

export const addProductImages = async (
  userId: string,
  productUrl: string,
  imageUrls: string[]
) => {
  const imageProduct = {
    productUrl,
    imageUrls,
  };

  const response = await fetch(`${URL}/users/${userId}/products/images`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(imageProduct),
  });

  if (!response.ok) {
    if (response.status === 409) {
      console.log('Image already exists');
    } else {
      throw new Error(
        `HTTP error! status: ${response.status}, error: ${response.statusText}`
      );
    }
  }

  return response.json();
};

export const removeProductImages = async (
  userId: string,
  productUrl: string,
  imageUrls: string[]
) => {
  const imageProduct = {
    productUrl,
    imageUrls,
  };

  console.log('JSON.stringify(imageProduct)', JSON.stringify(imageProduct));

  const response = await fetch(`${URL}/users/${userId}/products/images`, {
    method: 'DELETE',
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

  return response;
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

export const fetchPlists = async (userId: string) => {
  const completeUrl = `${URL}/users/${userId}/plists`;
  const response = await fetch(completeUrl);

  if (!response.ok) {
    throw new Error(
      `Network response was not ok. Status code: ${response.status}`
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
