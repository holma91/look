import { useQuery } from '@tanstack/react-query';
import auth from '@react-native-firebase/auth';
import { Clist } from '../../utils/types';
import { URL } from '../../api/index';
import { useFirebaseUser } from '../useFirebaseUser';

async function fetchClists(): Promise<Clist[]> {
  const completeUrl = `${URL}/companies/lists`;
  const token = await auth()?.currentUser?.getIdToken();

  const response = await fetch(completeUrl, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error(
      `HTTP error in useClistsQuery!. Status code: ${response.status}`
    );
  }
  return response.json();
}

export const useClistsQuery = () => {
  const { user } = useFirebaseUser();

  const ClistsQuery = useQuery({
    queryKey: ['clists'],
    queryFn: () => fetchClists(),
    enabled: !!user?.uid,
    onError: (err) => {
      console.log('error fetching Clists:', err);
    },
  });

  return ClistsQuery;
};
