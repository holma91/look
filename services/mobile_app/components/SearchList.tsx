import { FlatList, Keyboard, TouchableOpacity } from 'react-native';
import { Image as ExpoImage } from 'expo-image';
import { useUser } from '@clerk/clerk-expo';

import { Box } from '../styling/Box';
import { domainToInfo } from '../utils/utils';
import { Text } from '../styling/Text';
import { fetchCompanies } from '../api';
import { useQuery } from '@tanstack/react-query';
import { Company } from '../utils/types';

export default function SearchList({
  navigation,
  searchText,
  setFocus,
}: {
  navigation: any;
  searchText: string;
  setFocus: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { user } = useUser();

  const { data: companies } = useQuery<Company[]>({
    queryKey: ['companies', user?.id],
    queryFn: () => fetchCompanies(user?.id as string),
    enabled: !!user?.id,
    onSuccess: () => {},
  });

  const filteredWebsites = companies?.filter((company) =>
    company.id.includes(searchText)
  );
  return (
    <Box flex={1}>
      <FlatList
        data={filteredWebsites}
        keyExtractor={(item) => item.id}
        keyboardShouldPersistTaps="handled"
        renderItem={({ item }) => (
          <Box
            flex={1}
            flexDirection="row"
            alignItems="center"
            paddingHorizontal="m"
            paddingVertical="s"
          >
            <TouchableOpacity
              onPress={() => {
                console.log('item', item);
                setFocus(false);
                Keyboard.dismiss();
                navigation.navigate('Browser', {
                  url: item.domains[0],
                });
              }}
              style={{ flex: 1 }}
            >
              <Box flexDirection="row" alignItems="center" gap="l" flex={1}>
                <ExpoImage
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: 40,
                    width: 40,
                  }}
                  source={domainToInfo[item.id].icon}
                  contentFit="contain"
                />
                <Box gap="s">
                  <Text variant="body" fontWeight={'bold'}>
                    {domainToInfo[item.id].name}
                  </Text>
                  <Text variant="body">{item.domains[0]}</Text>
                </Box>
              </Box>
            </TouchableOpacity>
          </Box>
        )}
      />
    </Box>
  );
}
