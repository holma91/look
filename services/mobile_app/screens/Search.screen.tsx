import { FlatList, TouchableOpacity, Keyboard } from 'react-native';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { useUser } from '@clerk/clerk-expo';
import { Image as ExpoImage } from 'expo-image';
import Ionicons from '@expo/vector-icons/Ionicons';

import { SearchBar } from '../components/SearchBar';
import { Box } from '../styling/Box';
import { Text } from '../styling/Text';
import { fetchWebsites } from '../api';
import { useState } from 'react';
import { Website } from '../utils/types';
import { domainToInfo } from '../utils/utils';

export default function Search({ navigation }: { navigation: any }) {
  const [searchText, setSearchText] = useState('');
  const { user } = useUser();
  const { status, data: websites } = useQuery<Website[]>({
    queryKey: ['websites', user?.id],
    queryFn: () => fetchWebsites(user?.id as string),
    enabled: !!user?.id,
    onSuccess: () => {},
  });

  const handleSearch = () => {
    // If the search text isn't found in the preconfigured websites
    if (!websites?.some((website) => website.domain.includes(searchText))) {
      // Navigate to the new domain
      navigation.navigate('Browser', { url: searchText });
    }
  };

  console.log('websites', websites);

  const filteredWebsites = websites?.filter((website) =>
    website.domain.includes(searchText)
  );

  return (
    <Box backgroundColor="background" flex={1}>
      <Box flex={1} gap="s">
        <SearchBar
          navigation={navigation}
          searchText={searchText}
          setSearchText={setSearchText}
          handleSearch={handleSearch}
        />
        <Box flex={1}>
          {status === 'success' ? (
            <FlatList
              data={filteredWebsites}
              keyExtractor={(item) => item.domain}
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
                      navigation.navigate('Browser', { url: item.domain });
                    }}
                    style={{ flex: 1 }}
                  >
                    <Box
                      flexDirection="row"
                      alignItems="center"
                      gap="l"
                      flex={1}
                    >
                      <ExpoImage
                        style={{
                          justifyContent: 'center',
                          alignItems: 'center',
                          height: 40,
                          width: 40,
                        }}
                        source={domainToInfo[item.domain].icon}
                        contentFit="contain"
                      />
                      <Box gap="s">
                        <Text variant="body" fontWeight={'bold'}>
                          {domainToInfo[item.domain].name}
                        </Text>
                        <Text variant="body">{item.domain}</Text>
                      </Box>
                    </Box>
                  </TouchableOpacity>
                </Box>
              )}
            />
          ) : null}
        </Box>
      </Box>
    </Box>
  );
}
