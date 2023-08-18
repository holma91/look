import { useQueryClient, useMutation } from '@tanstack/react-query';
import auth from '@react-native-firebase/auth';
import { UserProduct } from '../../utils/types';
import { URL } from '../../api/index';
import { useFirebaseUser } from '../useFirebaseUser';

export async function addProductImages(
  productUrl: string,
  imageUrls: string[]
) {
  const imageProduct = {
    productUrl,
    imageUrls,
  };
  const token = await auth()?.currentUser?.getIdToken();

  const response = await fetch(`${URL}/products/images`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(imageProduct),
  });

  if (!response.ok) {
    if (response.status === 409) {
      console.log('Image already exists');
    } else {
      throw new Error(
        `HTTP error in useAddImagesMutation! status: ${response.status}, error: ${response.statusText}`
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
      await addProductImages(product.url, images);
      return product;
    },
    onMutate: async ({ product, images }: AddImagesMutationProps) => {
      const previousProduct = queryClient.getQueryData([
        'product',
        product.url,
      ]);

      queryClient.setQueryData(
        ['product', product.url],
        (old: UserProduct | undefined) => {
          if (!old) {
            return;
          }
          return { ...old, images: old?.images.concat(images) };
        }
      );

      return { previousProduct };
    },
    onError: (err, { product, images }, context) => {
      console.log('error', err, product, context);
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

  return addImagesMutation;
};
