import { useQueryClient, useMutation } from '@tanstack/react-query';
import { deleteFromPlist } from '../../api';
import { FilterType, UserProduct } from '../../utils/types';
import { useFirebaseUser } from '../useFirebaseUser';

export const useDeleteProductsMutation = (filter: FilterType) => {
  const { user } = useFirebaseUser();
  const queryClient = useQueryClient();

  const deleteProductsMutation = useMutation({
    mutationFn: async (products: UserProduct[]) => {
      const listId = filter?.list && filter.list[0];
      await deleteFromPlist(user!.uid, listId!, products);
      return products;
    },
    onMutate: async (products: UserProduct[]) => {
      await queryClient.cancelQueries(['products', user?.uid, filter]);
      const previousProducts = queryClient.getQueryData([
        'products',
        user?.uid,
        filter,
      ]);

      const productUrls = products.map((p) => p.url);

      // optimistically update the cache
      queryClient.setQueryData(
        ['products', user?.uid, filter],
        (old: UserProduct[] | undefined) => {
          return old?.filter((p) => !productUrls.includes(p.url));
        }
      );

      return { previousProducts };
    },
    onError: (err, products, context) => {
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
    },
  });

  return deleteProductsMutation;
};
