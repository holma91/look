import { useQueryClient, useMutation } from '@tanstack/react-query';
import { useUser } from '@clerk/clerk-expo';
import { removeProductImages } from '../../api';
import { UserProduct } from '../../utils/types';

type RemoveImagesMutationProps = {
  product: UserProduct;
  images: string[];
};

export const useRemoveImagesMutation = () => {
  const { user } = useUser();
  const queryClient = useQueryClient();

  const removeImagesMutation = useMutation({
    mutationFn: async ({ product, images }: RemoveImagesMutationProps) => {
      await removeProductImages(user!.id, product.url, images);
    },
    onError: (err, { product, images }) => {
      console.log('product', product);
      console.log('images', images);

      console.log('error removing images:', err, product.url);
    },
    onSettled: async (_, err, __, context) => {
      queryClient.invalidateQueries({
        queryKey: ['products', user?.id, { list: ['history'] }],
      });
    },
  });

  return removeImagesMutation;
};
