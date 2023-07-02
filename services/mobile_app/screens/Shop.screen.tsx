import { FlatList, SafeAreaView, TouchableOpacity } from 'react-native';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useUser } from '@clerk/clerk-expo';
import { Image as ExpoImage } from 'expo-image';

import { Box } from '../styling/Box';
import { Text } from '../styling/Text';
import { useMemo, useState } from 'react';
import { domainToInfo } from '../utils/utils';
import {
  SearchBar,
  FakeSearchBar,
  FakeSearchBarBrowser,
} from '../components/SearchBar';
import { favoriteWebsite, fetchWebsites, unFavoriteWebsite } from '../api';

type WebsiteItem = {
  domain: string;
  favorited: boolean;
};

export default function Shop({ navigation }: { navigation: any }) {
  const [selectedCategory, setSelectedCategory] = useState('All');

  return (
    <Box backgroundColor="background" flex={1}>
      <SafeAreaView style={{ flex: 1 }}>
        <Box flex={1} gap="s">
          <FakeSearchBarBrowser navigation={navigation} domain="" />
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
                    borderColor: 'black',
                  }}
                >
                  <Text
                    variant="body"
                    fontWeight={'bold'}
                    paddingBottom="s"
                    color={selectedCategory === item.label ? 'text' : 'text'}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </Box>
          <Box>
            <WebsiteList
              navigation={navigation}
              selectedCategory={selectedCategory}
            />
          </Box>
        </Box>
      </SafeAreaView>
    </Box>
  );
}

type WebsiteListProps = {
  navigation: any;
  selectedCategory: string;
};

function WebsiteList({ navigation, selectedCategory }: WebsiteListProps) {
  const [renderToggle, setRenderToggle] = useState(false);
  const queryClient = useQueryClient();
  const { user } = useUser();

  const { status, data: websites } = useQuery({
    queryKey: ['websites', user?.id],
    queryFn: () => fetchWebsites(user?.id as string),
    enabled: !!user?.id,
    onSuccess: () => {},
  });

  const mutation = useMutation({
    mutationFn: async (website: WebsiteItem) => {
      if (!user?.id) return;

      if (!website.favorited) {
        return unFavoriteWebsite(user.id, website.domain);
      } else {
        return favoriteWebsite(user.id, website.domain);
      }
    },
    onMutate: async (website: WebsiteItem) => {
      website.favorited = !website.favorited;

      await queryClient.cancelQueries({ queryKey: ['websites', user?.id] });

      const previousWebsite = queryClient.getQueryData([
        'websites',
        website.domain,
      ]);

      queryClient.setQueryData(['websites', website.domain], website);

      return { previousWebsite, website };
    },
    onError: (err, website, context) => {
      console.log('mutation error', err, website, context);
      queryClient.setQueryData(
        ['websites', context?.website.domain],
        context?.previousWebsite
      );
    },
    onSettled: async () => {
      setRenderToggle(!renderToggle);

      queryClient.invalidateQueries({ queryKey: ['websites', user?.id] });
    },
  });

  const filteredSites = useMemo(() => {
    let filtered;
    if (selectedCategory === 'Favorites') {
      filtered = websites.filter((site: WebsiteItem) => site.favorited);
    } else if (selectedCategory === 'Multi') {
      filtered = websites.filter(
        (site: WebsiteItem) => domainToInfo[site.domain].multiBrand
      );
    } else if (selectedCategory === 'Single') {
      filtered = websites.filter(
        (site: WebsiteItem) => !domainToInfo[site.domain].multiBrand
      );
    } else if (selectedCategory === '2nd hand') {
      filtered = websites.filter(
        (site: WebsiteItem) => domainToInfo[site.domain].secondHand
      );
    } else {
      filtered = websites;
    }
    return filtered;
  }, [selectedCategory, websites, renderToggle]);

  if (status === 'loading') {
    return <Text>Loading...</Text>;
  }

  if (status === 'error') {
    return <Text>Error when getting websites</Text>;
  }

  return (
    <FlatList<WebsiteItem>
      data={filteredSites}
      renderItem={({ item, index }) => (
        <Box
          flex={1}
          flexDirection="row"
          alignItems="center"
          borderColor="grey"
          paddingHorizontal="m"
          paddingVertical="s"
        >
          <TouchableOpacity
            onPress={() => navigation.navigate('Browser', { url: item.domain })}
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
            name={item.favorited ? 'ios-star' : 'ios-star-outline'}
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
  );
}
