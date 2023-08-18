import { useQueryClient, useMutation } from '@tanstack/react-query';
import auth from '@react-native-firebase/auth';
import { URL } from '../../api/index';
import { UserProduct } from '../../utils/types';
import { useFirebaseUser } from '../useFirebaseUser';

export const createPlist = async (
  userId: string,
  listId: string,
  selectedProducts: UserProduct[]
) => {
  // Create plist
  const completeUrl = `${URL}/products/lists`;
  const token = await auth()?.currentUser?.getIdToken();
  const response = await fetch(completeUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      id: listId,
      productUrls: selectedProducts.map((product) => product.url),
    }),
  });

  if (!response.ok) {
    throw new Error(
      `HTTP error in createPlist! status: ${response.status}, error: ${response.statusText}`
    );
  }

  return response.json();
};

type CreatePListMutationProps = { products: UserProduct[]; listId: string };

export const useCreatePListMutation = () => {
  const { user } = useFirebaseUser();
  const queryClient = useQueryClient();

  const createPListMutation = useMutation({
    mutationFn: async ({ products, listId }: CreatePListMutationProps) => {
      await createPlist(user!.uid, listId!, products);
      return products;
    },
    onMutate: async ({ listId, products }: CreatePListMutationProps) => {
      await queryClient.cancelQueries(['plists']);
      const previousPLists = queryClient.getQueryData(['plists']);

      // queryClient.setQueryData(['products', { list: [listId] }], () => {
      //   return products;
      // });

      return { previousPLists };
    },
    onError: (err, { products, listId }, context) => {
      console.log('error', err, products, context);
      queryClient.setQueryData(['plists'], context?.previousPLists);
    },
    onSettled: async (_, err, { listId, products }, context) => {
      queryClient.invalidateQueries({
        queryKey: ['plists'],
      });
      queryClient.invalidateQueries({
        queryKey: ['products', { list: [listId] }],
      });
    },
  });

  return createPListMutation;
};
