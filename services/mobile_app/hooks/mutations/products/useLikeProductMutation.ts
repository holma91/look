import { useQueryClient, useMutation } from '@tanstack/react-query';
import { likeProducts, unlikeProducts } from '../../../api';
import { FilterType, UserProduct } from '../../../utils/types';

export const useLikeProductMutation = (filter: FilterType) => {
  const queryClient = useQueryClient();

  const likeProductMutation = useMutation({
    mutationFn: async (product: UserProduct) => {
      !product.liked
        ? await unlikeProducts([product])
        : await likeProducts([product]);
      return product;
    },
    onMutate: async (product: UserProduct) => {
      await queryClient.cancelQueries(['product', product.schemaUrl]);
      const previousProduct = queryClient.getQueryData([
        'product',
        product.schemaUrl,
      ]);

      queryClient.setQueryData(
        ['product', product.schemaUrl],
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
        ['product', product.schemaUrl],
        context?.previousProduct
      );
    },
    onSettled: async (_, err, product, context) => {
      queryClient.invalidateQueries({
        queryKey: ['product', product.schemaUrl],
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
