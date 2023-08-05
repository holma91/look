import { useQueryClient, useMutation } from '@tanstack/react-query';
import { useUser } from '@clerk/clerk-expo';
import { likeProducts, unlikeProducts } from '../api';
import { FilterType, UserProduct } from '../utils/types';

export const useLikeProductMutation = (filter: FilterType) => {
  const { user } = useUser();
  const queryClient = useQueryClient();

  const likeProductMutation = useMutation({
    mutationFn: async (product: UserProduct) => {
      !product.liked
        ? await unlikeProducts(user!.id, [product])
        : await likeProducts(user!.id, [product]);
      return product;
    },
    onMutate: async (product: UserProduct) => {
      console.log('product', product);

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
      if (!filter?.list?.includes('likes')) {
        queryClient.invalidateQueries({
          queryKey: ['products', user?.id, { list: ['likes'] }],
        });
      }
    },
  });

  return likeProductMutation;
};
