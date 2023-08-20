import { useQuery } from '@tanstack/react-query';
import auth from '@react-native-firebase/auth';
import { Company } from '../../utils/types';

import { URL } from '../../api/index';
import { useFirebaseUser } from '../useFirebaseUser';

async function fetchCompanies(clist: string): Promise<Company[]> {
  const completeUrl = `${URL}/companies?clist=${clist}`;
  console.log('completeUrl:', completeUrl);

  const token = await auth()?.currentUser?.getIdToken();
  const response = await fetch(completeUrl, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(
      `HTTP error in useCompaniesQuery!. Status code: ${response.status}`
    );
  }
  return response.json();
}

async function fetchVisitedCompanies(): Promise<Company[]> {
  const completeUrl = `${URL}/products/companies`;
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

export const useCompaniesQuery = (clist: string) => {
  const { user } = useFirebaseUser();

  const companiesQuery = useQuery({
    queryKey: ['companies', clist],
    queryFn: () =>
      clist !== 'visited' ? fetchCompanies(clist) : fetchVisitedCompanies(),
    enabled: !!user?.uid,
    onError: (err) => {
      console.log('error fetching companies:', err);
    },
  });

  return companiesQuery;
};
