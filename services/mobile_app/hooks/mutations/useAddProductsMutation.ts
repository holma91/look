import { useQueryClient, useMutation } from '@tanstack/react-query';
import auth from '@react-native-firebase/auth';
import { URL } from '../../api/index';
import { UserProduct } from '../../utils/types';
import { useFirebaseUser } from '../useFirebaseUser';

const addToPlist = async (
  userId: string,
  listId: string,
  products: UserProduct[]
) => {
  const token = await auth()?.currentUser?.getIdToken();
  const response = await fetch(`${URL}/products/lists/${listId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      productUrls: products.map((p) => p.url),
    }),
  });

  if (!response.ok) {
    throw new Error(
      `HTTP error in addToPlist! status: ${response.status}, error: ${response.statusText}`
    );
  }

  return response;
};

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
