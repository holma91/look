import { useQueryClient, useMutation } from '@tanstack/react-query';
import auth from '@react-native-firebase/auth';
import { UserProduct } from '../../utils/types';
import { URL } from '../../api/index';
import { useFirebaseUser } from '../useFirebaseUser';

export async function removeProductImages(
  productUrl: string,
  imageUrls: string[]
) {
  const imageProduct = {
    productUrl,
    imageUrls,
  };

  const token = await auth()?.currentUser?.getIdToken();
  const response = await fetch(`${URL}/products/images`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(imageProduct),
  });

  if (!response.ok) {
    throw new Error(
      `HTTP error in useRemoveImagesMutation! status: ${response.status}, error: ${response.statusText}`
    );
  }

  return response;
}

type RemoveImagesMutationProps = {
  product: UserProduct;
  images: string[];
};

export const useRemoveImagesMutation = () => {
  const { user } = useFirebaseUser();
  const queryClient = useQueryClient();

  const removeImagesMutation = useMutation({
    mutationFn: async ({ product, images }: RemoveImagesMutationProps) => {
      await removeProductImages(product.url, images);
    },
    onMutate: async ({ product, images }: RemoveImagesMutationProps) => {
      await queryClient.cancelQueries(['product', product.url]);
      const previousProduct = queryClient.getQueryData([
        'product',
        product.url,
      ]);

      queryClient.setQueryData(
        ['product', product.url],
        (old: UserProduct | undefined) => {
          if (old) {
            old.images = old.images.filter((img) => !images.includes(img));
          }
          return old;
        }
      );

      return { previousProduct };
    },
    onError: (err, { product, images }, context) => {
      console.log('error removing images:', err, product.url);
      queryClient.setQueryData(
        ['product', product.url],
        context?.previousProduct
      );
    },
    onSettled: async (_, err, { product, images }, context) => {
      queryClient.invalidateQueries({
        queryKey: ['products', { list: ['history'] }],
      });
      queryClient.invalidateQueries({
        queryKey: ['product', product.url],
      });
    },
  });

  return removeImagesMutation;
};
