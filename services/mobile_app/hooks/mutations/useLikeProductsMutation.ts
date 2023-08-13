import { useQueryClient, useMutation } from '@tanstack/react-query';
import { likeProducts, unlikeProducts } from '../../api';
import { FilterType, UserProduct } from '../../utils/types';
import { useFirebaseUser } from '../useFirebaseUser';

type LikeProductsMutationProps = { products: UserProduct[]; like: boolean };

export const useLikeProductsMutation = (filter: FilterType) => {
  const { user } = useFirebaseUser();
  const queryClient = useQueryClient();

  const likeProductsMutation = useMutation({
    mutationFn: async ({ products, like }: LikeProductsMutationProps) => {
      if (like) {
        await likeProducts(user!.uid, products);
      } else {
        await unlikeProducts(user!.uid, products);
      }
      return products;
    },
    onMutate: async ({ products, like }: LikeProductsMutationProps) => {
      await queryClient.cancelQueries(['products', user?.uid, filter]);
      const previousProducts = queryClient.getQueryData([
        'products',
        user?.uid,
        filter,
      ]);

      const productUrls = products.map((p) => p.url);
      queryClient.setQueryData(
        ['products', user?.uid, filter],
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
        ['products', user?.uid, filter],
        context?.previousProducts
      );
    },
    onSettled: async () => {
      queryClient.invalidateQueries({
        queryKey: ['products', user?.uid, filter],
      });
      if (!filter?.list?.includes('likes')) {
        queryClient.invalidateQueries({
          queryKey: ['products', user?.uid, { list: ['likes'] }],
        });
      }
    },
  });

  return likeProductsMutation;
};
