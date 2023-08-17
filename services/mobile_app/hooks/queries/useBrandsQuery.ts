import { useQuery } from '@tanstack/react-query';
import auth from '@react-native-firebase/auth';
import { Brand } from '../../utils/types';

import { URL } from '../../api/index';
import { useFirebaseUser } from '../useFirebaseUser';

async function fetchBrands(): Promise<string[]> {
  const completeUrl = `${URL}/products/brands`;
  const token = await auth()?.currentUser?.getIdToken();
  const response = await fetch(completeUrl, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(
      `Network response was not ok. Status code: ${response.status}`
    );
  }
  return response.json();
}

export const useBrandsQuery = () => {
  const { user } = useFirebaseUser();

  const brandsQuery = useQuery({
    queryKey: ['brands', user?.uid],
    queryFn: () => fetchBrands(),
    enabled: !!user?.uid,
    onError: (err) => {
      console.log('error fetching brands:', err);
    },
  });

  return brandsQuery;
};
