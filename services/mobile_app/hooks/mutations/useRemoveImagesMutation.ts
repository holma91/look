import { useQueryClient, useMutation } from '@tanstack/react-query';
import { UserProduct } from '../../utils/types';
import { URL } from '../../api/index';
import { useFirebaseUser } from '../useFirebaseUser';

export async function removeProductImages(
  userId: string,
  productUrl: string,
  imageUrls: string[]
) {
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
      await removeProductImages(user!.uid, product.url, images);
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
        queryKey: ['products', user?.uid, { list: ['history'] }],
      });
      queryClient.invalidateQueries({
        queryKey: ['product', product.url],
      });
    },
  });

  return removeImagesMutation;
};
