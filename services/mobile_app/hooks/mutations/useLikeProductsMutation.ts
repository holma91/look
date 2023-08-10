import { useQueryClient, useMutation } from '@tanstack/react-query';
import { useUser } from '@clerk/clerk-expo';
import { likeProducts, unlikeProducts } from '../../api';
import { FilterType, UserProduct } from '../../utils/types';

type LikeProductsMutationProps = { products: UserProduct[]; like: boolean };

export const useLikeProductsMutation = (filter: FilterType) => {
  const { user } = useUser();
  const queryClient = useQueryClient();

  const likeProductsMutation = useMutation({
    mutationFn: async ({ products, like }: LikeProductsMutationProps) => {
      if (like) {
        await likeProducts(user!.id, products);
      } else {
        await unlikeProducts(user!.id, products);
      }
      return products;
    },
    onMutate: async ({ products, like }: LikeProductsMutationProps) => {
      await queryClient.cancelQueries(['products', user?.id, filter]);
      const previousProducts = queryClient.getQueryData([
        'products',
        user?.id,
        filter,
      ]);

      // optimistically update the cache
      const productUrls = products.map((p) => p.url);
      queryClient.setQueryData(
        ['products', user?.id, filter],
        (old: UserProduct[] | undefined) => {
          return old?.map((p) => {
            if (productUrls.includes(p.url)) {
              p.liked = like;
            }
            return p;
          });
        }
      );

      return { previousProducts };
    },
    onError: (err, { products, like }, context) => {
      console.log('error', err, products, context);
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

  return likeProductsMutation;
};
