import { useQuery } from '@tanstack/react-query';
import auth from '@react-native-firebase/auth';
import { Plist } from '../../utils/types';
import { URL } from '../../api/index';
import { useFirebaseUser } from '../useFirebaseUser';

async function fetchPlists(): Promise<Plist[]> {
  const completeUrl = `${URL}/products/lists`;
  const token = await auth()?.currentUser?.getIdToken();

  const response = await fetch(completeUrl, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error(
      `HTTP error in usePlistsQuery!. Status code: ${response.status}`
    );
  }
  return response.json();
}

export const usePlistsQuery = () => {
  const { user } = useFirebaseUser();

  const plistsQuery = useQuery({
    queryKey: ['plists'],
    queryFn: () => fetchPlists(),
    enabled: !!user?.uid,
    onError: (err) => {
      console.log('error fetching plists:', err);
    },
  });

  return plistsQuery;
};
