import { useQueryClient, useMutation } from '@tanstack/react-query';
import { createProduct } from '../../api';
import { UserProduct } from '../../utils/types';
import { getDomain } from '../../utils/helpers';
import { useFirebaseUser } from '../useFirebaseUser';

export const useAddToHistoryMutation = () => {
  const { user } = useFirebaseUser();
  const queryClient = useQueryClient();

  const addToHistoryMutation = useMutation({
    mutationFn: async (product: UserProduct) => {
      // await addToPlist(user!.id, listId!, products);
      console.log('product', product);

      const domain = getDomain(product.url);
      await createProduct(user!.uid, product, domain!);
      return product;
    },
    onMutate: async (product: UserProduct) => {
      console.log('onMutate');

      await queryClient.cancelQueries(['products', { list: ['history'] }]);
      const previousProducts = queryClient.getQueryData([
        'products',
        { list: ['history'] },
      ]);

      // DO NOT NEED TO OPTIMISTICALLY UPDATE THE CACHE BECAUSE WE CHANGE THE FILTER AFTER ADDING
      // optimistically update the cache
      queryClient.setQueryData(
        ['products', { list: ['history'] }],
        (old: UserProduct[] | undefined) => {
          return old?.concat([product]);
        }
      );

      return { previousProducts };
    },
    onError: (err, product, context) => {
      console.log('error', err, product, context);
      queryClient.setQueryData(
        ['products', { list: ['history'] }],
        context?.previousProducts
      );
    },
    onSettled: async (_, err, products, context) => {
      queryClient.invalidateQueries({
        queryKey: ['products', { list: ['history'] }],
      });
    },
  });

  return addToHistoryMutation;
};
