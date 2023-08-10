import { useUser } from '@clerk/clerk-expo';
import { useQuery } from '@tanstack/react-query';
import { Brand } from '../../utils/types';

import { URL } from '../../api/index';

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
  const { user } = useUser();

  const brandsQuery = useQuery({
    queryKey: ['brands', user?.id],
    queryFn: () => fetchBrands(user!.id as string),
    enabled: !!user?.id,
    onError: (err) => {
      console.log('error fetching brands:', err);
    },
  });

  return brandsQuery;
};
