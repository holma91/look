import { useQuery } from '@tanstack/react-query';
import { Company } from '../../utils/types';

import { URL } from '../../api/index';
import { useFirebaseUser } from '../useFirebaseUser';

async function fetchCompanies(id: string): Promise<Company[]> {
  const completeUrl = `${URL}/users/${id}/companies`;
  const response = await fetch(completeUrl);

  if (!response.ok) {
    throw new Error(
      `Network response was not ok. Status code: ${response.status}`
    );
  }
  return response.json();
}

export const useCompaniesQuery = () => {
  const { user } = useFirebaseUser();

  const companiesQuery = useQuery({
    queryKey: ['companies', user?.uid],
    queryFn: () => fetchCompanies(user!.uid as string),
    enabled: !!user?.uid,
    onError: (err) => {
      console.log('error fetching companies:', err);
    },
  });

  return companiesQuery;
};
