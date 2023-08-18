import auth from '@react-native-firebase/auth';
import { UserProduct } from '../utils/types';

// api.ts
export const URL = 'https://1d00-85-230-9-36.ngrok-free.app';

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
