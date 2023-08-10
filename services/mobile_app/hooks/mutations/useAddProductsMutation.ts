import { useQueryClient, useMutation } from '@tanstack/react-query';
import { useUser } from '@clerk/clerk-expo';
import { addToPlist } from '../../api';
import { UserProduct } from '../../utils/types';

type AddProductsMutationProps = { products: UserProduct[]; listId: string };

export const useAddProductsMutation = () => {
  const { user } = useUser();
  const queryClient = useQueryClient();

  const addProductsMutation = useMutation({
    mutationFn: async ({ products, listId }: AddProductsMutationProps) => {
      await addToPlist(user!.id, listId!, products);
      return products;
    },
    onMutate: async ({ products, listId }: AddProductsMutationProps) => {
      await queryClient.cancelQueries([
        'products',
        user?.id,
        { list: [listId] },
      ]);
      const previousProducts = queryClient.getQueryData([
        'products',
        user?.id,
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
        ['products', user?.id, { list: [listId] }],
        context?.previousProducts
      );
    },
    onSettled: async (_, err, { products, listId }, context) => {
      queryClient.invalidateQueries({
        queryKey: ['products', user?.id, { list: [listId] }],
      });
    },
  });

  return addProductsMutation;
};
