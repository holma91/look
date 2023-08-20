import { useQueryClient, useMutation } from '@tanstack/react-query';
import auth from '@react-native-firebase/auth';
import { URL } from '../../../api/index';
import { Company } from '../../../utils/types';
import { useFirebaseUser } from '../../useFirebaseUser';

// favving is the same as adding to a list (named favorites)

const deleteFromClist = async (listId: string, companies: Company[]) => {
  const token = await auth()?.currentUser?.getIdToken();
  const response = await fetch(`${URL}/companies/lists/${listId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      companyIds: companies.map((c) => c.id),
    }),
  });

  if (!response.ok) {
    throw new Error(
      `HTTP error in addToClist! status: ${response.status}, error: ${response.statusText}`
    );
  }

  return response;
};

type DeleteCompaniesMutationProps = { companies: Company[]; listId: string };

export const useDeleteCompaniesMutation = (selectedClist: string) => {
  const queryClient = useQueryClient();

  const deleteCompaniesMutation = useMutation({
    mutationFn: async ({ companies, listId }: DeleteCompaniesMutationProps) => {
      await deleteFromClist(listId, companies);
      return companies;
    },
    onMutate: async ({ companies, listId }: DeleteCompaniesMutationProps) => {
      await queryClient.cancelQueries(['companies', selectedClist]);
      const previousCompanies = queryClient.getQueryData([
        'companies',
        selectedClist,
      ]);

      if (listId === 'favorites') {
        for (const company of companies) {
          company.favorited = false;
        }
      }
      queryClient.setQueryData(
        ['companies', listId],
        (old: Company[] | undefined) => {
          return old?.filter((company) => !companies.includes(company));
        }
      );

      return { previousCompanies };
    },
    onError: (err, { companies, listId }, context) => {
      console.log('error', err, companies, context);
      queryClient.setQueryData(
        ['companies', selectedClist],
        context?.previousCompanies
      );
    },
    onSettled: async (_, err, { companies, listId }, context) => {
      queryClient.invalidateQueries({
        queryKey: ['companies', selectedClist],
      });
    },
  });

  return deleteCompaniesMutation;
};
