import { useQueryClient, useMutation } from '@tanstack/react-query';
import { useUser } from '@clerk/clerk-expo';
import {
  addProductImages,
  addToPlist,
  createProduct,
  deleteFromPlist,
} from '../../api';
import { FilterType, UserProduct } from '../../utils/types';
import { getDomain } from '../../utils/helpers';

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
    onError: (err, images, context) => {
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
