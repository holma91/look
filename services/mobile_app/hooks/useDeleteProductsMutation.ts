import { useQueryClient, useMutation } from '@tanstack/react-query';
import { useUser } from '@clerk/clerk-expo';
import { deleteFromPlist } from '../api';
import { FilterType, UserProduct } from '../utils/types';

export const useDeleteProductsMutation = (filter: FilterType) => {
  const { user } = useUser();
  const queryClient = useQueryClient();

  const deleteProductsMutation = useMutation({
    mutationFn: async (products: UserProduct[]) => {
      const listId = filter?.list && filter.list[0];
      await deleteFromPlist(user!.id, listId!, products);
      return products;
    },
    onMutate: async (products: UserProduct[]) => {
      await queryClient.cancelQueries(['products', user?.id, filter]);
      const previousProducts = queryClient.getQueryData([
        'products',
        user?.id,
        filter,
      ]);

      const productUrls = products.map((p) => p.url);

      // optimistically update the cache
      queryClient.setQueryData(
        ['products', user?.id, filter],
        (old: UserProduct[] | undefined) => {
          return old?.filter((p) => !productUrls.includes(p.url));
        }
      );

      return { previousProducts };
    },
    onError: (err, products, context) => {
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
    },
  });

  return deleteProductsMutation;
};
