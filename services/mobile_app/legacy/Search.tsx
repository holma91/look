import {
  FlatList,
  TouchableOpacity,
  Keyboard,
  SafeAreaView,
} from 'react-native';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { useUser } from '@clerk/clerk-expo';
import { Image as ExpoImage } from 'expo-image';
import Ionicons from '@expo/vector-icons/Ionicons';

import { SearchBar } from '../components/SearchBar';
import { Box } from '../styling/RestylePrimitives';
import { Text } from '../styling/Text';
import { fetchCompanies } from '../api';
import { useState } from 'react';
import { Website, Company } from '../utils/types';
import { companyToInfo } from '../utils/info';

export default function Search({ navigation }: { navigation: any }) {
  const [searchText, setSearchText] = useState('');
  const [isFocused, setFocus] = useState(false);
  const { user } = useUser();
  const { status, data: companies } = useQuery<Company[]>({
    queryKey: ['companies', user?.id],
    queryFn: () => fetchCompanies(user?.id as string),
    enabled: !!user?.id,
    onSuccess: () => {},
  });

  const handleSearch = () => {
    // If the search text isn't found in the preconfigured websites
    if (!companies?.some((company) => company.id.includes(searchText))) {
      // Navigate to the new domain
      navigation.navigate('Browser', { url: searchText });
    }
  };

  // console.log('websites', websites);

  const filteredWebsites = companies?.filter((company) =>
    company.id.includes(searchText)
  );

  return (
    <>
      <SearchBar
        navigation={navigation}
        searchText={searchText}
        setSearchText={setSearchText}
        handleSearch={handleSearch}
        setFocus={setFocus}
      />
      {status === 'success' && isFocused ? (
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
      ) : null}
    </>
  );
}
