import { FlatList, Image, SafeAreaView, TouchableOpacity } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useAuth, useUser } from '@clerk/clerk-expo';
import { Image as ExpoImage } from 'expo-image';

import { Theme } from '../styling/theme';
import { Box } from '../styling/Box';
import { Text } from '../styling/Text';
import { useState } from 'react';
import { TextInput } from '../styling/TextInput';

const startSites = [
  {
    url: 'www.zalando.com',
    name: 'Zalando',
    icon: require('../assets/logos/zalando.png'),
  },
  {
    url: 'www.zara.com',
    name: 'Zara',
    icon: require('../assets/logos/zara.png'),
  },
  {
    url: 'www.asos.com',
    name: 'Asos',
    icon: require('../assets/logos/asos.png'),
  },
  {
    url: 'www.hm.com',
    name: 'H&M',
    icon: require('../assets/logos/hm.png'),
  },
  {
    url: 'www.boozt.com',
    name: 'Boozt',
    icon: require('../assets/logos/boozt.png'),
  },
];

const URL = 'https://4566-146-70-202-4.ngrok-free.app';
const fetchWebsites = async (id: string) => {
  const completeUrl = `${URL}/websites/`;
  const response = await fetch(completeUrl);

  // get all websites
  // get all favorites

  if (!response.ok) {
    throw new Error(
      `Network response was not ok. Status code: ${response.status}`
    );
  }
  return response.json();
};

const fetchFavoriteWebsites = async (id: string) => {
  const completeUrl = `${URL}/users/${id}/websites`;
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
  const [sites, setSites] = useState(
    startSites
      .concat(startSites)
      .concat(startSites)
      .map((site, i) => {
        return { ...site, id: i.toString() };
      })
  );

  const { user } = useUser();
  const userId = user?.id;

  const { status, data: allWebsites } = useQuery({
    queryKey: ['info', user?.id],
    queryFn: () => fetchWebsites(userId as string),
    enabled: !!userId,
  });

  console.log('data', allWebsites);

  if (status === 'loading') {
    return <Text>Loading...</Text>;
  }

  if (status === 'error') {
    return <Text>Error</Text>;
  }

  const handleFavorite = (site: any) => {
    console.log('handleFavorite', site);
    // make request to backend to add favorite
  };

  let displaySites = sites;
  if (selectedCategory === 'Favorites') {
    displaySites = sites.filter((site) => site.name === 'Zalando');
  } else if (selectedCategory === 'Luxury') {
    displaySites = sites.filter((site) => site.name === 'Zara');
  } else {
    displaySites = sites;
  }

  return (
    <Box backgroundColor="background" flex={1}>
      <SafeAreaView style={{ flex: 1 }}>
        <Box flex={1} gap="s">
          {allWebsites.map((site: any) => (
            <Text key={site.domain}>{site.domain}</Text>
          ))}
          <SearchBar />
          <Text variant="title" paddingHorizontal="m">
            Top sites
          </Text>
          <Box flexDirection="row" gap="m" marginVertical="s">
            <FlatList
              style={{ flex: 1, gap: 10 }}
              horizontal
              showsHorizontalScrollIndicator={false}
              data={[
                { label: 'Favorites' },
                { label: 'All' },
                { label: 'Luxury' },
                { label: 'Cheap' },
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
            <FlatList
              data={displaySites}
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
                      navigation.navigate('Browser', { url: item.url })
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
                        source={item.icon}
                        contentFit="contain"
                      />
                      <Box gap="s">
                        <Text variant="body" fontWeight={'bold'}>
                          {item.name}
                        </Text>
                        <Text variant="body">{item.url}</Text>
                      </Box>
                    </Box>
                  </TouchableOpacity>
                  <Ionicons
                    name="ios-star-outline"
                    flex={0}
                    size={24}
                    color="black"
                    onPress={() => {
                      handleFavorite(item);
                    }}
                  />
                </Box>
              )}
              keyExtractor={(site) => site.id}
            />
          </Box>
        </Box>
      </SafeAreaView>
    </Box>
  );
}

function SearchBar() {
  const [search, setSearch] = useState('');

  const handleSearch = () => {};

  return (
    <Box
      flex={0}
      flexDirection="row"
      alignItems="center"
      gap="s"
      paddingBottom="s"
      paddingHorizontal="m"
    >
      <Box
        flex={1}
        backgroundColor="grey"
        borderRadius={20}
        flexDirection="row"
        alignItems="center"
        paddingHorizontal="m"
        paddingVertical="xxs"
      >
        <TextInput
          onChangeText={setSearch}
          value={search}
          autoCapitalize="none"
          autoComplete="off"
          autoCorrect={false}
          inputMode="url"
          variant="secondary"
          onSubmitEditing={handleSearch}
          selectTextOnFocus={true}
          placeholder="Search and shop anywhere"
          placeholderTextColor="black"
        />
        <Ionicons
          name="search"
          size={18}
          color="black"
          style={{ position: 'absolute', left: 15 }}
        />
      </Box>
      <Ionicons name="ellipsis-vertical" flex={0} size={24} color="black" />
    </Box>
  );
}
