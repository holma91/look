import { useQueryClient, useMutation } from '@tanstack/react-query';
import { likeProducts, unlikeProducts } from '../../api';
import { FilterType, UserProduct } from '../../utils/types';

type LikeProductsMutationProps = { products: UserProduct[]; like: boolean };

export const useLikeProductsMutation = (filter: FilterType) => {
  const queryClient = useQueryClient();

  const likeProductsMutation = useMutation({
    mutationFn: async ({ products, like }: LikeProductsMutationProps) => {
      if (like) {
        await likeProducts(products);
      } else {
        await unlikeProducts(products);
      }
      return products;
    },
    onMutate: async ({ products, like }: LikeProductsMutationProps) => {
      await queryClient.cancelQueries(['products', filter]);
      const previousProducts = queryClient.getQueryData(['products', filter]);

      const productUrls = products.map((p) => p.url);
      queryClient.setQueryData(
        ['products', filter],
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
      queryClient.setQueryData(['products', filter], context?.previousProducts);
    },
    onSettled: async () => {
      queryClient.invalidateQueries({
        queryKey: ['products', filter],
      });
      if (!filter?.list?.includes('likes')) {
        queryClient.invalidateQueries({
          queryKey: ['products', { list: ['likes'] }],
        });
      }
    },
  });

  return likeProductsMutation;
};
