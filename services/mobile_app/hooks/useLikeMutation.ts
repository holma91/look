import { useQueryClient, useMutation } from '@tanstack/react-query';
import { useUser } from '@clerk/clerk-expo';
import { likeProduct, unlikeProduct } from '../api';
import { UserProduct } from '../utils/types';

export const useLikeMutation = () => {
  const { user } = useUser();
  const queryClient = useQueryClient();

  const likeMutation = useMutation({
    mutationFn: async (product: UserProduct) => {
      !product.liked
        ? await unlikeProduct(user!.id, product.url)
        : await likeProduct(user!.id, product.url);
      return product;
    },
    onMutate: async (product: UserProduct) => {
      product.liked = !product.liked; // this works, but maybe we should use setQueryData instead
      await queryClient.cancelQueries([
        'products',
        user?.id,
        { view: ['likes'] },
      ]);
      const previousProducts = queryClient.getQueryData([
        'products',
        user?.id,
        { view: ['likes'] },
      ]);

      return { previousProducts, product };
    },
    onError: (err, product, context) => {
      console.log('error', err, product, context);
      product.liked = !product.liked; // this works, but maybe we should use setQueryData instead
    },
    onSettled: async () => {
      queryClient.invalidateQueries({
        queryKey: ['products', user?.id, { view: ['likes'] }],
      });
    },
  });

  return likeMutation;
};
