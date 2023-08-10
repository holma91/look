import { useQueryClient, useMutation } from '@tanstack/react-query';
import { useUser } from '@clerk/clerk-expo';
import { UserProduct } from '../../utils/types';

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
  const { user } = useUser();
  const queryClient = useQueryClient();

  const addImagesMutation = useMutation({
    mutationFn: async ({ product, images }: AddImagesMutationProps) => {
      await addProductImages(user!.id, product.url, images);
      return product;
    },
    onError: (err, { product, images }, context) => {
      console.log('error', err, product, context);
    },
    onSettled: async (_, err, products, context) => {
      queryClient.invalidateQueries({
        queryKey: ['products', user?.id, { list: ['history'] }],
      });
    },
  });

  return addImagesMutation;
};
