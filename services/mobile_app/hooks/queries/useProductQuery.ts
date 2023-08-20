import { useQuery } from '@tanstack/react-query';
import auth from '@react-native-firebase/auth';
import { UserProduct } from '../../utils/types';
import { URL } from '../../api/index';
import { useFirebaseUser } from '../useFirebaseUser';

async function fetchProduct(url: string) {
  const completeUrl = `${URL}/products/product?product_url=${url}`;
  const token = await auth()?.currentUser?.getIdToken();

  const response = await fetch(completeUrl, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(
      `HTTP error in useProductQuery!. Status code: ${response.status}`
    );
  }
  return response.json();
}

export const useProductQuery = (initialProduct: UserProduct) => {
  const { user } = useFirebaseUser();

  const productQuery = useQuery({
    queryKey: ['product', initialProduct.url],
    queryFn: () => fetchProduct(initialProduct.url),
    initialData: initialProduct,
    enabled: !!user?.uid && initialProduct.images.length > 0,
    onError: (err) => {
      console.log('error fetching individual product:', err);
    },
  });

  return productQuery;
};
