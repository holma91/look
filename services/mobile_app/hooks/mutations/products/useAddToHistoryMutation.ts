import { useQueryClient, useMutation } from '@tanstack/react-query';
import auth from '@react-native-firebase/auth';
import { URL } from '../../../api/index';
import { UserProduct } from '../../../utils/types';
import { getDomain } from '../../../utils/helpers';
import { useFirebaseUser } from '../../useFirebaseUser';

const createProduct = async (
  userId: string,
  product: UserProduct,
  domain: string
) => {
  // fix the brand name here
  const backendProduct = {
    ...product,
    domain: domain,
  };

  const token = await auth()?.currentUser?.getIdToken();

  const completeUrl = `${URL}/products`;

  const response = await fetch(completeUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(backendProduct),
  });

  if (response.status === 409) {
    console.log('duplicate');
  } else if (!response.ok) {
    console.log('response:', response);

    throw new Error(
      `HTTP error in createProduct! status: ${response.status}, error: ${response.statusText}`
    );
  }

  return response.json();
};

export const useAddToHistoryMutation = () => {
  const { user } = useFirebaseUser();
  const queryClient = useQueryClient();

  const addToHistoryMutation = useMutation({
    mutationFn: async (product: UserProduct) => {
      const domain = getDomain(product.url);
      await createProduct(user!.uid, product, domain!);
      return product;
    },
    onMutate: async (product: UserProduct) => {
      await queryClient.cancelQueries(['products', { list: ['history'] }]);
      const previousProducts = queryClient.getQueryData([
        'products',
        { list: ['history'] },
      ]);

      queryClient.setQueryData(
        ['products', { list: ['history'] }],
        (old: UserProduct[] | undefined) => {
          return old?.concat([product]);
        }
      );

      return { previousProducts };
    },
    onError: (err, product, context) => {
      console.log('error', err);
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
