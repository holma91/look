import { useQueryClient, useMutation } from '@tanstack/react-query';
import { useUser } from '@clerk/clerk-expo';
import { deleteFromPlist } from '../api';
import { FilterType, UserProduct } from '../utils/types';

export const useDeleteProductMutation = (filter: FilterType) => {
  const { user } = useUser();
  const queryClient = useQueryClient();

  const deleteProductMutation = useMutation({
    mutationFn: async (product: UserProduct) => {
      const listId = filter?.list && filter.list[0];
      await deleteFromPlist(user!.id, listId!, product);
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
          return old?.filter((p) => p.url !== product.url);
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

  return deleteProductMutation;
};
