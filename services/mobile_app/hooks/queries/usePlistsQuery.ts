import { useUser } from '@clerk/clerk-expo';
import { useQuery } from '@tanstack/react-query';
import { Plist } from '../../utils/types';
import { URL } from '../../api/index';

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
  const { user } = useUser();

  const plistsQuery = useQuery({
    queryKey: ['plists', user?.id],
    queryFn: () => fetchPlists(user!.id as string),
    enabled: !!user?.id,
    onError: (err) => {
      console.log('error fetching plists:', err);
    },
  });

  return plistsQuery;
};
