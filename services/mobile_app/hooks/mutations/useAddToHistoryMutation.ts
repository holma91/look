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
      const domain = getDomain(product.url);
      await createProduct(user!.uid, product, domain!);
      return product;
    },
    onMutate: async (product: UserProduct) => {
      await queryClient.cancelQueries([
        'products',
        user?.uid,
        { list: ['history'] },
      ]);
      const previousProducts = queryClient.getQueryData([
        'products',
        user?.uid,
        { list: ['history'] },
      ]);

      // DO NOT NEED TO OPTIMISTICALLY UPDATE THE CACHE BECAUSE WE CHANGE THE FILTER AFTER ADDING
      // optimistically update the cache
      queryClient.setQueryData(
        ['products', user?.uid, { list: ['history'] }],
        (old: UserProduct[] | undefined) => {
          return old?.concat([product]);
        }
      );

      return { previousProducts };
    },
    onError: (err, product, context) => {
      console.log('error', err, product, context);
      queryClient.setQueryData(
        ['products', user?.uid, { list: ['history'] }],
        context?.previousProducts
      );
    },
    onSettled: async (_, err, products, context) => {
      queryClient.invalidateQueries({
        queryKey: ['products', user?.uid, { list: ['history'] }],
      });
    },
  });

  return addToHistoryMutation;
};
