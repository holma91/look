import { useQuery } from '@tanstack/react-query';
import auth from '@react-native-firebase/auth';
import { UserProduct } from '../../utils/types';
import { URL } from '../../api/index';
import { useFirebaseUser } from '../useFirebaseUser';

async function fetchProduct(user: any, url: string) {
  // const completeUrl = `${URL}/users/${id}/product?product_url=${url}`;
  const completeUrl = `${URL}/products/product?product_url=${url}`;
  const token = await auth()?.currentUser?.getIdToken();

  const response = await fetch(completeUrl, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(
      `Network response was not ok. Status code: ${response.status}`
    );
  }
  return response.json();
}

export const useProductQuery = (initialProduct: UserProduct) => {
  const { user } = useFirebaseUser();

  const productQuery = useQuery({
    queryKey: ['product', initialProduct.url],
    queryFn: () => fetchProduct(user, initialProduct.url),
    initialData: initialProduct,
    enabled: !!user?.uid,
    onError: (err) => {
      console.log('error fetching individual product:', err);
    },
  });

  return productQuery;
};
