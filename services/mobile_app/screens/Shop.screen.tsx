import { FlatList, Image, SafeAreaView, TouchableOpacity } from 'react-native';
import {
  createBox,
  createText,
  createRestyleComponent,
  createVariant,
  VariantProps,
} from '@shopify/restyle';
import Ionicons from '@expo/vector-icons/Ionicons';

import { Theme } from '../styling/theme';
import { Box } from '../styling/Box';
import { Text } from '../styling/Text';
import { useState } from 'react';
import { TextInput } from '../styling/TextInput';

const startSites = [
  {
    url: 'https://www.zalando.com',
    name: 'Zalando',
    icon: 'https://companieslogo.com/img/orig/ZAL.DE-38291d55.png?t=1648046036',
  },
  {
    url: 'https://www.zara.com',
    name: 'Zara',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/Zara_Logo.svg/2560px-Zara_Logo.svg.png',
  },
  {
    url: 'https://www.asos.com',
    name: 'Asos',
    icon: 'https://static-00.iconduck.com/assets.00/asos-icon-1024x1024-67s53sn1.png',
  },
  {
    url: 'https://www.hm.com',
    name: 'H&M',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/H%26M-Logo.svg/1200px-H%26M-Logo.svg.png',
  },
];

export default function Shop({ navigation }: { navigation: any }) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sites, setSites] = useState(
    startSites
      .concat(startSites)
      .concat(startSites)
      .map((site, i) => {
        return { ...site, id: i.toString() };
      })
  );

  const handleSearch = () => {};

  let displaySites = sites;
  if (selectedCategory === 'Favorites') {
    displaySites = sites.filter((site) => site.name === 'Zalando');
  } else if (selectedCategory === 'All') {
    displaySites = sites;
  }

  return (
    <Box backgroundColor="background" flex={1}>
      <SafeAreaView style={{ flex: 1 }}>
        <Box flex={1} gap="s">
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
            <Ionicons
              name="ellipsis-vertical"
              flex={0}
              size={24}
              color="black"
            />
          </Box>
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
          <Box paddingHorizontal="m">
            <FlatList
              data={displaySites}
              renderItem={({ item }) => (
                <Box
                  flex={1}
                  flexDirection="row"
                  marginVertical="s"
                  gap="m"
                  alignItems="center"
                >
                  <Image
                    style={{
                      justifyContent: 'center',
                      alignItems: 'center',
                      height: 32,
                      width: 32,
                    }}
                    source={{ uri: item.icon }}
                  />
                  <Box>
                    <Text variant="body" fontWeight={'bold'}>
                      {item.name}
                    </Text>
                    <Text variant="body">{item.url}</Text>
                  </Box>
                  <Ionicons
                    name="chevron-forward-outline"
                    size={24}
                    color="black"
                    onPress={() => navigation.navigate('Details')}
                    alignSelf="flex-end"
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
