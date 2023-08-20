import { useQueryClient, useMutation } from '@tanstack/react-query';
import auth from '@react-native-firebase/auth';
import { URL } from '../../../api/index';
import { FilterType, UserProduct } from '../../../utils/types';
import { useFirebaseUser } from '../../useFirebaseUser';

const deleteFromPlist = async (listId: string, products: UserProduct[]) => {
  const token = await auth()?.currentUser?.getIdToken();
  const response = await fetch(`${URL}/products/lists/${listId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      id: listId,
      productUrls: products.map((p) => p.url),
    }),
  });

  if (!response.ok) {
    throw new Error(
      `HTTP error in deleteFromPlist! status: ${response.status}, error: ${response.statusText}`
    );
  }

  return response;
};

export const useDeleteProductsMutation = (filter: FilterType) => {
  const { user } = useFirebaseUser();
  const queryClient = useQueryClient();

  const deleteProductsMutation = useMutation({
    mutationFn: async (products: UserProduct[]) => {
      const listId = filter?.list && filter.list[0];
      await deleteFromPlist(listId!, products);
      return products;
    },
    onMutate: async (products: UserProduct[]) => {
      await queryClient.cancelQueries(['products', filter]);
      const previousProducts = queryClient.getQueryData([
        'products',
        user?.uid,
        filter,
      ]);

      const productUrls = products.map((p) => p.url);

      // optimistically update the cache
      queryClient.setQueryData(
        ['products', filter],
        (old: UserProduct[] | undefined) => {
          return old?.filter((p) => !productUrls.includes(p.url));
        }
      );

      return { previousProducts };
    },
    onError: (err, products, context) => {
      console.log('error', err, products, context);
      queryClient.setQueryData(['products', filter], context?.previousProducts);
    },
    onSettled: async () => {
      queryClient.invalidateQueries({
        queryKey: ['products', filter],
      });
    },
  });

  return deleteProductsMutation;
};
