import { useQueryClient, useMutation } from '@tanstack/react-query';
import auth from '@react-native-firebase/auth';
import { URL } from '../../../api/index';
import { Company } from '../../../utils/types';

const addToClist = async (listId: string, companies: Company[]) => {
  const token = await auth()?.currentUser?.getIdToken();
  const response = await fetch(`${URL}/companies/lists/${listId}`, {
    method: 'POST',
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

type AddCompaniesMutationProps = { companies: Company[]; listId: string };

export const useAddCompaniesMutation = (selectedClist: string) => {
  const queryClient = useQueryClient();

  const addCompaniesMutation = useMutation({
    mutationFn: async ({ companies, listId }: AddCompaniesMutationProps) => {
      await addToClist(listId, companies);
      return companies;
    },
    onMutate: async ({ companies, listId }: AddCompaniesMutationProps) => {
      await queryClient.cancelQueries(['companies', selectedClist]);
      const previousCompanies = queryClient.getQueryData([
        'companies',
        selectedClist,
      ]);

      if (listId === 'favorites') {
        for (const company of companies) {
          company.favorited = true;
        }
      }

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
      queryClient.invalidateQueries({
        queryKey: ['companies', listId],
      });
    },
  });

  return addCompaniesMutation;
};
