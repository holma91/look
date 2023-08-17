import { useQueryClient, useMutation } from '@tanstack/react-query';
import { addToPlist } from '../../api';
import { UserProduct } from '../../utils/types';
import { useFirebaseUser } from '../useFirebaseUser';

type AddProductsMutationProps = { products: UserProduct[]; listId: string };

export const useAddProductsMutation = () => {
  const { user } = useFirebaseUser();
  const queryClient = useQueryClient();

  const addProductsMutation = useMutation({
    mutationFn: async ({ products, listId }: AddProductsMutationProps) => {
      await addToPlist(user!.uid, listId!, products);
      return products;
    },
    onMutate: async ({ products, listId }: AddProductsMutationProps) => {
      await queryClient.cancelQueries(['products', { list: [listId] }]);
      const previousProducts = queryClient.getQueryData([
        'products',
        { list: [listId] },
      ]);

      // DO NOT NEED TO OPTIMISTICALLY UPDATE THE CACHE BECAUSE WE CHANGE THE FILTER AFTER ADDING
      // optimistically update the cache
      // const productUrls = products.map((p) => p.url);
      // queryClient.setQueryData(
      //   ['products', user?.id, { list: [listId] }],
      //   (old: UserProduct[] | undefined) => {
      //     return old?.concat(products);
      //   }
      // );

      return { previousProducts };
    },
    onError: (err, { products, listId }, context) => {
      console.log('error', err, products, context);
      queryClient.setQueryData(
        ['products', { list: [listId] }],
        context?.previousProducts
      );
    },
    onSettled: async (_, err, { products, listId }, context) => {
      queryClient.invalidateQueries({
        queryKey: ['products', { list: [listId] }],
      });
    },
  });

  return addProductsMutation;
};
