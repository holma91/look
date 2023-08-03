import { useQueryClient, useMutation } from '@tanstack/react-query';
import { useUser } from '@clerk/clerk-expo';
import { likeProduct, unlikeProduct } from '../api';
import { FilterType, UserProduct } from '../utils/types';

export const useLikeProductMutation = (filter: FilterType) => {
  const { user } = useUser();
  const queryClient = useQueryClient();

  const likeProductMutation = useMutation({
    mutationFn: async (product: UserProduct) => {
      console.log('product.liked', product.liked);

      !product.liked
        ? await unlikeProduct(user!.id, product.url)
        : await likeProduct(user!.id, product.url);
      return product;
    },
    onMutate: async (product: UserProduct) => {
      await queryClient.cancelQueries(['products', user?.id, filter]);
      const previousProducts = queryClient.getQueryData([
        'products',
        user?.id,
        filter,
      ]);

      // optimistically update the cache
      queryClient.setQueryData(
        ['products', user?.id, filter],
        (old: UserProduct[] | undefined) => {
          return old?.map((p) => {
            if (p.url === product.url) {
              p.liked = !p.liked;
            }
            return p;
          });
        }
      );

      return { previousProducts };
    },
    onError: (err, product, context) => {
      console.log('error', err, product, context);
      queryClient.setQueryData(
        ['products', user?.id, filter],
        context?.previousProducts
      );
    },
    onSettled: async () => {
      queryClient.invalidateQueries({
        queryKey: ['products', user?.id, filter],
      });
    },
  });

  return likeProductMutation;
};
