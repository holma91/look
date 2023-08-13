import { useQueryClient, useMutation } from '@tanstack/react-query';
import { UserProduct } from '../../utils/types';
import { useFirebaseUser } from '../useFirebaseUser';

export async function addProductImages(
  userId: string,
  productUrl: string,
  imageUrls: string[]
) {
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
}

type AddImagesMutationProps = {
  product: UserProduct;
  images: string[];
};

export const useAddImagesMutation = () => {
  const { user } = useFirebaseUser();
  const queryClient = useQueryClient();

  const addImagesMutation = useMutation({
    mutationFn: async ({ product, images }: AddImagesMutationProps) => {
      await addProductImages(user!.uid, product.url, images);
      return product;
    },
    onError: (err, { product, images }, context) => {
      console.log('error', err, product, context);
    },
    onSettled: async (_, err, products, context) => {
      queryClient.invalidateQueries({
        queryKey: ['products', user?.uid, { list: ['history'] }],
      });
    },
  });

  return addImagesMutation;
};
