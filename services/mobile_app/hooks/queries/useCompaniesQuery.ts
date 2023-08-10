import { useUser } from '@clerk/clerk-expo';
import { useQuery } from '@tanstack/react-query';
import { Company } from '../../utils/types';

import { URL } from '../../api/index';

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
  const { user } = useUser();

  const companiesQuery = useQuery({
    queryKey: ['companies', user?.id],
    queryFn: () => fetchCompanies(user!.id as string),
    enabled: !!user?.id,
    onError: (err) => {
      console.log('error fetching companies:', err);
    },
  });

  return companiesQuery;
};
