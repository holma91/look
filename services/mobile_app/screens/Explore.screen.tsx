import { SafeAreaView, FlatList, Dimensions } from 'react-native';
import { FlashList, MasonryFlashList } from '@shopify/flash-list';
import { Image as ExpoImage } from 'expo-image';
import { Box } from '../styling/Box';
import { Text } from '../styling/Text';
import { FakeSearchBarBrowser } from '../components/SearchBar';

const imagesData = [
  {
    id: '1',
    uri: 'https://softgoat.centracdn.net/client/dynamic/images/2151_a7dc7bd334-softgoat-ss23-nc3763-turtleneck-singlet-light-blue-1795-4-size1024.jpg',
    size: 'big',
  },
  {
    id: '2',
    uri: 'https://adaysmarch.centracdn.net/client/dynamic/images/8080_342601e6d9-102521-20_frankie_relaxed_hoodie_oyster0085-max.jpg',
    size: 'small',
  },
  {
    id: '3',
    uri: 'https://images.lululemon.com/is/image/lululemon/LW3GAHS_059404_4?wid=750&op_usm=0.8,1,10,0&fmt=webp&qlt=80,1&fit=constrain,0&op_sharpen=0&resMode=sharp2&iccEmbed=0&printRes=72',
    size: 'small',
  },
  {
    id: '4',
    uri: 'https://softgoat.centracdn.net/client/dynamic/images/2202_8ee99fa254-softgoat-ss23-25030-mens-collar-navy-2895-2-size1024.jpg',
    size: 'small',
  },
  {
    id: '5',
    uri: 'https://images.lululemon.com/is/image/lululemon/LW3GAHS_059404_4?wid=750&op_usm=0.8,1,10,0&fmt=webp&qlt=80,1&fit=constrain,0&op_sharpen=0&resMode=sharp2&iccEmbed=0&printRes=72',
    size: 'small',
  },
  {
    id: '6',
    uri: 'https://images.lululemon.com/is/image/lululemon/LW3GS5S_027597_4?wid=750&op_usm=0.8,1,10,0&fmt=webp&qlt=80,1&fit=constrain,0&op_sharpen=0&resMode=sharp2&iccEmbed=0&printRes=72',
    size: 'big',
  },
  {
    id: '7',
    uri: 'https://softgoat.centracdn.net/client/dynamic/images/2151_a7dc7bd334-softgoat-ss23-nc3763-turtleneck-singlet-light-blue-1795-4-size1024.jpg',
    size: 'small',
  },
  {
    id: '8',
    uri: 'https://adaysmarch.centracdn.net/client/dynamic/images/8080_342601e6d9-102521-20_frankie_relaxed_hoodie_oyster0085-max.jpg',
    size: 'small',
  },
  {
    id: '9',
    uri: 'https://images.lululemon.com/is/image/lululemon/LW3GAHS_059404_4?wid=750&op_usm=0.8,1,10,0&fmt=webp&qlt=80,1&fit=constrain,0&op_sharpen=0&resMode=sharp2&iccEmbed=0&printRes=72',
    size: 'small',
  },
  {
    id: '10',
    uri: 'https://softgoat.centracdn.net/client/dynamic/images/2202_8ee99fa254-softgoat-ss23-25030-mens-collar-navy-2895-2-size1024.jpg',
    size: 'small',
  },
  {
    id: '11',
    uri: 'https://images.lululemon.com/is/image/lululemon/LW3GAHS_059404_4?wid=750&op_usm=0.8,1,10,0&fmt=webp&qlt=80,1&fit=constrain,0&op_sharpen=0&resMode=sharp2&iccEmbed=0&printRes=72',
    size: 'small',
  },
  {
    id: '12',
    uri: 'https://images.lululemon.com/is/image/lululemon/LW3GS5S_027597_4?wid=750&op_usm=0.8,1,10,0&fmt=webp&qlt=80,1&fit=constrain,0&op_sharpen=0&resMode=sharp2&iccEmbed=0&printRes=72',
    size: 'small',
  },
  {
    id: '13',
    uri: 'https://softgoat.centracdn.net/client/dynamic/images/2202_8ee99fa254-softgoat-ss23-25030-mens-collar-navy-2895-2-size1024.jpg',
    size: 'small',
  },
  {
    id: '14',
    uri: 'https://images.lululemon.com/is/image/lululemon/LW3GAHS_059404_4?wid=750&op_usm=0.8,1,10,0&fmt=webp&qlt=80,1&fit=constrain,0&op_sharpen=0&resMode=sharp2&iccEmbed=0&printRes=72',
    size: 'small',
  },
  {
    id: '15',
    uri: 'https://images.lululemon.com/is/image/lululemon/LW3GS5S_027597_4?wid=750&op_usm=0.8,1,10,0&fmt=webp&qlt=80,1&fit=constrain,0&op_sharpen=0&resMode=sharp2&iccEmbed=0&printRes=72',
    size: 'small',
  },
  {
    id: '16',
    uri: 'https://softgoat.centracdn.net/client/dynamic/images/2196_58f2100716-softgoat-ss23-ss1701-mens-t-shirt-white-1695-2-size1600.jpg',
    size: 'small',
  },
  {
    id: '17',
    uri: 'https://softgoat.centracdn.net/client/dynamic/images/2196_58f2100716-softgoat-ss23-ss1701-mens-t-shirt-white-1695-2-size1600.jpg',
    size: 'small',
  },
];

const { height, width } = Dimensions.get('window');

export default function Explore({ navigation }: { navigation: any }) {
  return (
    <Box backgroundColor="background" flex={1}>
      <SafeAreaView style={{ flex: 1 }}>
        <FakeSearchBarBrowser navigation={navigation} domain="" />
        <MasonryFlashList
          data={imagesData}
          renderItem={({ item }) => {
            return (
              <ExpoImage
                source={{ uri: item.uri }}
                style={{
                  width: '100%',
                  height: item.size === 'big' ? 400 : 200,
                }}
                contentFit="cover"
              />
            );
          }}
          keyExtractor={(item) => item.id}
          numColumns={3}
          estimatedItemSize={200}
          showsVerticalScrollIndicator={false}
        />
      </SafeAreaView>
    </Box>
  );
}
