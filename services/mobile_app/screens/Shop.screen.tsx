import { FlatList, Image, SafeAreaView, TouchableOpacity } from 'react-native';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useAuth, useUser } from '@clerk/clerk-expo';
import { Image as ExpoImage } from 'expo-image';

import { Box } from '../styling/Box';
import { Text } from '../styling/Text';
import { useEffect, useState } from 'react';
import { domainToInfo } from '../utils/utils';
import { SearchBar } from '../components/SearchBar';

type WebsiteItem = {
  domain: string;
  is_favorite: string;
  multi_brand: boolean;
  second_hand: boolean;
};

const URL = 'https://ad0e-83-255-121-67.ngrok-free.app';
const fetchWebsites = async (id: string) => {
  const completeUrl = `${URL}/websites/?user_id=${id}`;
  const response = await fetch(completeUrl);

  if (!response.ok) {
    throw new Error(
      `Network response was not ok. Status code: ${response.status}`
    );
  }
  return response.json();
};

export default function Shop({ navigation }: { navigation: any }) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [filteredSites, setFilteredSites] = useState([]);

  const queryClient = useQueryClient();

  const { user } = useUser();
  const userId = user?.id;

  const { status, data: websites } = useQuery({
    queryKey: ['websites', user?.id],
    queryFn: () => fetchWebsites(userId as string),
    enabled: !!userId,
    onSuccess: () => {},
  });

  const mutation = useMutation({
    mutationFn: async (website: WebsiteItem) => {
      // add error handling later
      const userId = user?.id;
      if (website.is_favorite) {
        const response = await fetch(
          `${URL}/users/${userId}/favorites/${website.domain}`,
          {
            method: 'DELETE',
          }
        );

        if (!response.ok) {
          throw new Error(
            `Network response was not ok. Status code: ${response.status}`
          );
        }

        return;
      } else {
        const response = await fetch(
          `${URL}/users/${userId}/favorites/${website.domain}`,
          {
            method: 'POST',
          }
        );

        if (!response.ok) {
          throw new Error(
            `Network response was not ok. Status code: ${response.status}`
          );
        }

        const data = await response.json();
        return data;
      }
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ['websites'] });
    },
  });

  useEffect(() => {
    let filtered;
    if (selectedCategory === 'Favorites') {
      filtered = websites.filter((site: WebsiteItem) => site.is_favorite);
    } else if (selectedCategory === 'Multi') {
      filtered = websites.filter((site: WebsiteItem) => site.multi_brand);
    } else if (selectedCategory === 'Single') {
      filtered = websites.filter((site: WebsiteItem) => !site.multi_brand);
    } else if (selectedCategory === '2nd hand') {
      filtered = websites.filter((site: WebsiteItem) => site.second_hand);
    } else {
      filtered = websites;
    }

    setFilteredSites(filtered);
  }, [selectedCategory, websites]);

  if (status === 'loading') {
    return <Text>Loading...</Text>;
  }

  if (status === 'error') {
    return <Text>Error</Text>;
  }

  return (
    <Box backgroundColor="background" flex={1}>
      <SafeAreaView style={{ flex: 1 }}>
        <Box flex={1} gap="s">
          <SearchBar navigation={navigation} isFakeSearchBar={true} />
          {/* <Text variant="title" paddingHorizontal="m">
            Popular sites
          </Text> */}
          <Box flexDirection="row" gap="m" marginVertical="s">
            <FlatList
              style={{ flex: 1, gap: 10 }}
              horizontal
              showsHorizontalScrollIndicator={false}
              data={[
                { label: 'Favorites' },
                { label: 'All' },
                { label: 'Multi' },
                { label: 'Single' },
                { label: '2nd hand' },
                { label: 'Other' },
              ]}
              contentContainerStyle={{ paddingLeft: 18 }}
              keyExtractor={(item, index) => `category-${index}`}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => setSelectedCategory(item.label)}
                  style={{
                    marginRight: 16,
                    borderBottomWidth: selectedCategory === item.label ? 2 : 0,
                    borderColor: '#5A31F4',
                  }}
                >
                  <Text
                    variant="body"
                    fontWeight={'bold'}
                    paddingBottom="s"
                    color={selectedCategory === item.label ? 'primary' : 'text'}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </Box>
          <Box>
            <FlatList<WebsiteItem>
              data={filteredSites}
              renderItem={({ item }) => (
                <Box
                  flex={1}
                  flexDirection="row"
                  alignItems="center"
                  borderTopWidth={1}
                  borderColor="grey"
                  paddingHorizontal="m"
                  paddingVertical="s"
                >
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate('Browser', { url: item.domain })
                    }
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
                  <Ionicons
                    name={item.is_favorite ? 'ios-star' : 'ios-star-outline'}
                    flex={0}
                    size={24}
                    color="black"
                    onPress={() => {
                      mutation.mutate(item);
                    }}
                  />
                </Box>
              )}
              keyExtractor={(site) => site.domain}
            />
          </Box>
        </Box>
      </SafeAreaView>
    </Box>
  );
}
