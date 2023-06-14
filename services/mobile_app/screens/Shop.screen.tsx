import { FlatList, Image, SafeAreaView } from 'react-native';
import {
  createBox,
  createText,
  createRestyleComponent,
  createVariant,
  VariantProps,
} from '@shopify/restyle';
import { Theme } from '../styling/theme';
import { Box } from '../styling/Box';
import { Text } from '../styling/Text';
import { useState } from 'react';

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

export default function Shop() {
  const [sites, setSites] = useState(
    startSites
      .concat(startSites)
      .concat(startSites)
      .map((site, i) => {
        return { ...site, id: i.toString() };
      })
  );

  return (
    <Box backgroundColor="background" flex={1}>
      <SafeAreaView style={{ flex: 1 }}>
        <Box flex={1} paddingHorizontal="m" gap="s">
          <Text variant="title">url bar</Text>
          <Text variant="title">Top sites</Text>
          <FlatList
            data={sites}
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
              </Box>
            )}
            keyExtractor={(site) => site.id}
          />
        </Box>
      </SafeAreaView>
    </Box>
  );
}
