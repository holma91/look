import {
  FlatList,
  TouchableOpacity,
  Keyboard,
  SafeAreaView,
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { useUser } from '@clerk/clerk-expo';
import { Image as ExpoImage } from 'expo-image';

import { SearchBar } from '../components/SearchBar';
import { Box } from '../styling/RestylePrimitives';
import { Text } from '../styling/Text';
import { fetchCompanies } from '../api';
import { useState } from 'react';
import { Company } from '../utils/types';
import { companyToInfo } from '../utils/info';

export default function Search({ navigation }: { navigation: any }) {
  const [searchText, setSearchText] = useState('');
  const { user } = useUser();
  const { status, data: companies } = useQuery<Company[]>({
    queryKey: ['companies', user?.id],
    queryFn: () => fetchCompanies(user?.id as string),
    enabled: !!user?.id,
    onSuccess: () => {},
  });

  // console.log('websites', websites);

  const filteredWebsites = companies?.filter((company) =>
    company.id.includes(searchText)
  );

  return (
    <Box backgroundColor="background" flex={1}>
      <SafeAreaView style={{ flex: 1 }}>
        <Box flex={1} gap="s">
          {/* <SearchBar
            navigation={navigation}
            searchText={searchText}
            setSearchText={setSearchText}
            handleSearch={handleSearch}
          /> */}
          <Box flex={1}>
            {status === 'success' ? (
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
            ) : null}
          </Box>
        </Box>
      </SafeAreaView>
    </Box>
  );
}
