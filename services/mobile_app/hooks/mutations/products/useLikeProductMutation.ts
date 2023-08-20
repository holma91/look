import { useQueryClient, useMutation } from '@tanstack/react-query';
import { likeProducts, unlikeProducts } from '../../../api';
import { FilterType, UserProduct } from '../../../utils/types';
import { useFirebaseUser } from '../../useFirebaseUser';

export const useLikeProductMutation = (filter: FilterType) => {
  const { user } = useFirebaseUser();
  const queryClient = useQueryClient();

  const likeProductMutation = useMutation({
    mutationFn: async (product: UserProduct) => {
      !product.liked
        ? await unlikeProducts([product])
        : await likeProducts([product]);
      return product;
    },
    onMutate: async (product: UserProduct) => {
      console.log('onMutate', product);

      await queryClient.cancelQueries(['product', product.url]);
      const previousProduct = queryClient.getQueryData([
        'product',
        product.url,
      ]);

      queryClient.setQueryData(
        ['product', product.url],
        (old: UserProduct | undefined) => {
          if (old) {
            old.liked = !old.liked;
          }
          return old;
        }
      );

      return { previousProduct };
    },
    onError: (err, product, context) => {
      console.log('error', err, product, context);
      queryClient.setQueryData(
        ['product', product.url],
        context?.previousProduct
      );
    },
    onSettled: async (_, err, product, context) => {
      queryClient.invalidateQueries({
        queryKey: ['product', product.url],
      });
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

  return likeProductMutation;
};
