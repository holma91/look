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
        queryKey: ['products', user?.id, { list: ['history'] }],
      });
      queryClient.invalidateQueries({
        queryKey: ['product', product.url],
      });
    },
  });

  return removeImagesMutation;
};
