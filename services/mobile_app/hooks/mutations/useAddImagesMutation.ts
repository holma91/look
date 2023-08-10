import { useQueryClient, useMutation } from '@tanstack/react-query';
import { useUser } from '@clerk/clerk-expo';
import { addProductImages } from '../../api';
import { UserProduct } from '../../utils/types';

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
