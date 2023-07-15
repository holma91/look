import { SafeAreaView, Dimensions, TouchableOpacity } from 'react-native';
import { MasonryFlashList } from '@shopify/flash-list';
import { Image as ExpoImage } from 'expo-image';
import Ionicons from '@expo/vector-icons/Ionicons';

import { Box } from '../styling/Box';
import { TextInput } from '../styling/TextInput';
import { UserProduct } from '../utils/types';
import { useState } from 'react';
import Filter from '../components/Filter';

const names = [
  'Alice',
  'Bob',
  'lapuerta',
  'Dave',
  'Eve',
  'Frank',
  'Grace',
  'Heidi',
  'Ivan',
  'Judy',
];

const products: UserProduct[] = [
  {
    url: 'https://softgoat.com/p/mens-collar-navy/',
    name: "MEN'S COLLAR",
    brand: 'Soft Goat',
    price: '2027',
    currency: 'SEK',
    images: [
      require('../assets/products/softgoat1/gen1.png'),
      require('../assets/generations/demo/me/stepbystep2/30.png'),
    ],
    domain: 'softgoat.com',
  },
  {
    url: 'https://www.adaysmarch.com/se/kita-shirt-denim-light-blue',
    name: 'Kita Shirt - Denim',
    brand: "A Day's March",
    price: '1077',
    currency: 'SEK',
    images: [
      require('../assets/products/adaysmarch1/gen2.png'),
      require('../assets/products/adaysmarch1/gen1.png'),
    ],
    domain: 'adaysmarch.com',
  },
  {
    url: 'https://www.eu.lululemon.com/en-lu/p/city-sweat-full-zip-hoodie/prod8910005.html?dwvar_prod8910005_color=32798',
    name: 'City Sweat Full Zip Hoodie',
    brand: 'Lululemon',
    price: '138',
    currency: 'EUR',
    images: [
      require('../assets/products/lulubuy/black.png'),
      require('../assets/products/lulubuy/blonde.png'),
      require('../assets/products/lulubuy/indian.png'),
      require('../assets/products/lulubuy/irish.png'),
    ],
    domain: 'eu.lululemon.com',
  },
  {
    url: 'https://shop.lululemon.com/p/jackets-and-hoodies-jackets/Define-Jacket/_/prod5020054?color=34563',
    name: 'Define Jacket Luon',
    brand: 'Lululemon',
    price: '118',
    currency: 'USD',
    images: [
      require('../assets/products/lululemon1/gen1.png'),
      require('../assets/products/lululemon1/gen2.png'),
    ],
    domain: 'lululemon.com',
  },
  {
    url: 'https://www.hermes.com/se/en/product/rib-trim-jacket-H353220HD4J50/',
    name: 'RIB-TRIM JACKET',
    brand: 'Hermès',
    price: '96500',
    currency: 'SEK',
    images: [
      require('../assets/products/hermes1/gen1.png'),
      require('../assets/products/hermes1/gen2.png'),
      require('../assets/products/hermes1/gen3.png'),
    ],
    domain: 'hermes.com',
  },
  {
    url: 'https://softgoat.com/p/chunky-t-shirt-fragola/',
    name: 'CHUNKY T-SHIRT',
    brand: 'Soft Goat',
    price: '1537',
    currency: 'SEK',
    images: [
      require('../assets/products/softgoat3/gen1.png'),
      require('../assets/products/softgoat3/gen2.png'),
      require('../assets/products/softgoat3/gen3.png'),
      require('../assets/products/softgoat3/gen4.png'),
    ],
    domain: 'softgoat.com',
  },
  {
    url: 'https://www.zalando.se/nn07-carlo-half-zip-sweatshirt-purple-rose-nn922s012-i11.html',
    name: 'CARLO - Sweatshirt',
    brand: 'NN07',
    price: '1345',
    currency: 'SEK',
    images: [
      require('../assets/products/zalando1/gen1.png'),
      require('../assets/products/zalando1/gen2.png'),
    ],
    domain: 'zalando.se',
  },
  {
    url: 'https://se.loropiana.com/en/p/man/outerwear-jackets/nevado-bomber-jacket-FAM0063?colorCode=W000',
    name: 'Nevado Bomber Jacket',
    brand: 'Lululemon',
    price: '14800',
    currency: 'EUR',
    images: [
      require('../assets/products/lululemon2/gen3.png'),
      require('../assets/products/lululemon2/gen2.png'),
      require('../assets/products/lululemon2/gen1.png'),
    ],
    domain: 'loropiana.com',
  },
  {
    url: 'https://se.loropiana.com/en/p/man/knitwear/falkville-crewneck-FAI0361?colorCode=J1GB',
    name: 'Falkville Crewneck',
    brand: 'Loro Piana',
    price: '950',
    currency: 'EUR',
    images: [
      require('../assets/products/loropiana1/gen1.png'),
      require('../assets/products/loropiana1/gen2.png'),
    ],
    domain: 'loropiana.com',
  },
  {
    url: '',
    name: '',
    brand: 'Loro Piana',
    price: '',
    currency: '',
    images: [require('../assets/products/loropiana2/gen1.png')],
    domain: '',
  },
  {
    url: 'https://www.eu.lululemon.com/en-lu/p/perfectly-oversized-crew-pride/prod11090058.html?dwvar_prod11090058_color=0002',
    name: 'Perfectly Oversized Crew Pride',
    brand: 'Lululemon',
    price: '118',
    currency: 'EUR',
    images: [
      require('../assets/products/lululemon3/gen1.png'),
      require('../assets/products/lululemon3/gen2.png'),
    ],
    domain: 'lululemon.com',
  },

  {
    url: '',
    name: '',
    brand: '',
    price: '',
    currency: '',
    images: [
      'https://images.lululemon.com/is/image/lululemon/LM3CZPS_030956_1?wid=1600&op_usm=0.5,2,10,0&fmt=webp&qlt=80,1&fit=constrain,0&op_sharpen=0&resMode=sharp2&iccEmbed=0&printRes=72',
    ],
    domain: '',
  },
  {
    url: '',
    name: '',
    brand: '',
    price: '',
    currency: '',
    images: [
      'https://images.lululemon.com/is/image/lululemon/LM3CV3S_057772_1?wid=1600&op_usm=0.5,2,10,0&fmt=webp&qlt=80,1&fit=constrain,0&op_sharpen=0&resMode=sharp2&iccEmbed=0&printRes=72',
    ],
    domain: '',
  },
];

const updatedProducts = products.map((product) => {
  return {
    ...product,
    images: product.images, // Keep images as array of URIs
    generatedBy:
      product.url === 'https://softgoat.com/p/mens-collar-navy/'
        ? ['Bob', 'me']
        : product.images.map((_, index) => names[index % names.length]), // Create a separate array for generatedBy
  };
});

export default function Explore({ navigation }: { navigation: any }) {
  const [outerChoice, setOuterChoice] = useState<string>('Category');
  const [choice, setChoice] = useState<string>('');
  const [showFilter, setShowFilter] = useState(false);

  return (
    <Box backgroundColor="background" flex={1}>
      <SafeAreaView style={{ flex: 1 }}>
        <ExploreSearchBar
          navigation={navigation}
          showFilter={showFilter}
          setShowFilter={setShowFilter}
        />
        <Filter
          outerChoice={outerChoice}
          setOuterChoice={setOuterChoice}
          choice={choice}
          setChoice={setChoice}
          showFilter={showFilter}
        />
        <MasonryFlashList
          data={updatedProducts}
          renderItem={({ item }) => {
            return (
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('Product', {
                    product: { ...item },
                  })
                }
                style={{ flex: 1 }}
              >
                <ExpoImage
                  source={item.images[0]}
                  style={{
                    width: '100%',
                    height: 200,
                  }}
                  contentFit="cover"
                />
              </TouchableOpacity>
            );
          }}
          keyExtractor={(item) => item.images[0]}
          numColumns={3}
          estimatedItemSize={200}
          showsVerticalScrollIndicator={false}
        />
      </SafeAreaView>
    </Box>
  );
}

type ExploreSearchBarProps = {
  navigation: any;
  showFilter: boolean;
  setShowFilter: React.Dispatch<React.SetStateAction<boolean>>;
};

function ExploreSearchBar({
  navigation,
  showFilter,
  setShowFilter,
}: ExploreSearchBarProps) {
  return (
    <Box
      flex={0}
      flexDirection="row"
      alignItems="center"
      gap="s"
      paddingBottom="s"
      paddingHorizontal="sm"
    >
      <Box
        flex={1}
        backgroundColor="grey"
        borderRadius={10}
        flexDirection="row"
        alignItems="center"
        paddingHorizontal="m"
        paddingVertical="xxxs"
      >
        <TextInput
          autoCapitalize="none"
          autoComplete="off"
          autoCorrect={false}
          inputMode="url"
          variant="secondary"
          selectTextOnFocus={true}
          placeholder="Explore other's looks"
          placeholderTextColor="black"
        />
        <Ionicons
          name="search"
          size={18}
          color="black"
          style={{ position: 'absolute', left: 15 }}
        />
      </Box>
      {/* <Box flex={0} backgroundColor="grey" borderRadius={10} padding="xs"> */}
      <Ionicons
        name={showFilter ? 'options' : 'options-outline'}
        flex={0}
        size={26}
        color="black"
        onPress={() => setShowFilter(!showFilter)}
      />
      {/* </Box> */}
    </Box>
  );
}
