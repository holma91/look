import { FlatList, Keyboard, TouchableOpacity } from 'react-native';
import { Image as ExpoImage } from 'expo-image';

import { Box, Text } from '../styling/RestylePrimitives';
import { companyToInfo } from '../utils/info';
import { Company } from '../utils/types';
import { useCompaniesQuery } from '../hooks/queries/useCompaniesQuery';

export default function SearchList({
  navigateToSite,
  searchText,
  setFocus,
}: {
  navigateToSite: (company: Company) => Promise<void>;
  searchText: string;
  setFocus: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { data: companies } = useCompaniesQuery('all');

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
                setFocus(false);
                Keyboard.dismiss();
                navigateToSite(item);
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
                  source={companyToInfo[item.id].icon}
                  contentFit="contain"
                />
                <Box gap="s">
                  <Text variant="body" fontWeight={'bold'}>
                    {companyToInfo[item.id].name}
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
