import { useQuery } from '@tanstack/react-query';
import { Brand } from '../../utils/types';

import { URL } from '../../api/index';
import { useFirebaseUser } from '../useFirebaseUser';

async function fetchBrands(id: string): Promise<Brand[]> {
  const completeUrl = `${URL}/users/${id}/brands`;
  const response = await fetch(completeUrl);

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
    queryFn: () => fetchBrands(user!.uid as string),
    enabled: !!user?.uid,
    onError: (err) => {
      console.log('error fetching brands:', err);
    },
  });

  return brandsQuery;
};
