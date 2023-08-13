import { useQuery } from '@tanstack/react-query';
import { Plist } from '../../utils/types';
import { URL } from '../../api/index';
import { useFirebaseUser } from '../useFirebaseUser';

async function fetchPlists(userId: string): Promise<Plist[]> {
  const completeUrl = `${URL}/users/${userId}/plists`;
  const response = await fetch(completeUrl);

  if (!response.ok) {
    throw new Error(
      `Network response was not ok. Status code: ${response.status}`
    );
  }
  return response.json();
}

export const usePlistsQuery = () => {
  const { user } = useFirebaseUser();

  const plistsQuery = useQuery({
    queryKey: ['plists', user?.uid],
    queryFn: () => fetchPlists(user!.uid as string),
    enabled: !!user?.uid,
    onError: (err) => {
      console.log('error fetching plists:', err);
    },
  });

  return plistsQuery;
};
