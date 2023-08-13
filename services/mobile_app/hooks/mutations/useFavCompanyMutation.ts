import { useQueryClient, useMutation } from '@tanstack/react-query';
import { Company } from '../../utils/types';
import { URL } from '../../api/index';
import { useFirebaseUser } from '../useFirebaseUser';

async function favoriteCompany(userId: string, company: string) {
  const response = await fetch(`${URL}/users/${userId}/favorites`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id: company }),
  });
  return response;
}

async function unFavoriteCompany(userId: string, company: string) {
  const response = await fetch(`${URL}/users/${userId}/favorites`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id: company }),
  });
  return response;
}

export const useFavCompanyMutation = (
  setRenderToggle: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const { user } = useFirebaseUser();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (company: Company) => {
      if (!user?.uid) return;

      if (!company.favorited) {
        return unFavoriteCompany(user.uid, company.id);
      } else {
        return favoriteCompany(user.uid, company.id);
      }
    },
    onMutate: async (company: Company) => {
      company.favorited = !company.favorited;

      await queryClient.cancelQueries({ queryKey: ['companies', user?.uid] });

      const previousCompany = queryClient.getQueryData([
        'companies',
        company.id,
      ]);

      queryClient.setQueryData(['companies', company.id], company);

      return { previousCompany, company };
    },
    onError: (err, company, context) => {
      console.log('mutation error', err, company, context);
      queryClient.setQueryData(
        ['companies', context?.company.id],
        context?.previousCompany
      );
    },
    onSettled: () => {
      setRenderToggle((prev) => !prev);
      queryClient.invalidateQueries({ queryKey: ['companies', user?.uid] });
    },
  });

  return mutation;
};
