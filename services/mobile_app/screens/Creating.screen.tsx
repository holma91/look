import { View, Dimensions, TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Box } from '../styling/Box';
import { Text } from '../styling/Text';
import { Image as ExpoImage } from 'expo-image';
import { Button } from '../components/NewButton';

const images = [
  {
    id: '1',
    name: 'White woman',
    imageUrl: require('../assets/models/whitewoman1.png'),
  },
  {
    id: '2',
    name: 'White man',
    imageUrl: require('../assets/models/whiteman1.png'),
  },
  {
    id: '3',
    name: 'Brown woman',
    imageUrl:
      'https://softgoat.centracdn.net/client/dynamic/images/2151_a7dc7bd334-softgoat-ss23-nc3763-turtleneck-singlet-light-blue-1795-4-size1024.jpg',
  },
  {
    id: '4',
    name: 'Black man',
    imageUrl:
      'https://adaysmarch.centracdn.net/client/dynamic/images/8080_342601e6d9-102521-20_frankie_relaxed_hoodie_oyster0085-max.jpg',
  },
  {
    id: '5',
    name: 'Asian woman',
    imageUrl:
      'https://images.lululemon.com/is/image/lululemon/LW3GAHS_059404_4?wid=750&op_usm=0.8,1,10,0&fmt=webp&qlt=80,1&fit=constrain,0&op_sharpen=0&resMode=sharp2&iccEmbed=0&printRes=72',
  },
  {
    id: '6',
    name: 'Black woman',
    imageUrl:
      'https://images.lululemon.com/is/image/lululemon/LW3GS5S_027597_4?wid=750&op_usm=0.8,1,10,0&fmt=webp&qlt=80,1&fit=constrain,0&op_sharpen=0&resMode=sharp2&iccEmbed=0&printRes=72',
  },
  {
    id: '7',
    name: 'Black man',
    imageUrl:
      'https://adaysmarch.centracdn.net/client/dynamic/images/8080_342601e6d9-102521-20_frankie_relaxed_hoodie_oyster0085-max.jpg',
  },
  {
    id: '8',
    name: 'Asian woman',
    imageUrl:
      'https://images.lululemon.com/is/image/lululemon/LW3GAHS_059404_4?wid=750&op_usm=0.8,1,10,0&fmt=webp&qlt=80,1&fit=constrain,0&op_sharpen=0&resMode=sharp2&iccEmbed=0&printRes=72',
  },
  {
    id: '9',
    name: 'Black woman',
    imageUrl:
      'https://images.lululemon.com/is/image/lululemon/LW3GS5S_027597_4?wid=750&op_usm=0.8,1,10,0&fmt=webp&qlt=80,1&fit=constrain,0&op_sharpen=0&resMode=sharp2&iccEmbed=0&printRes=72',
  },
];

const { height, width } = Dimensions.get('window');

export default function Creating({ navigation }: { navigation: any }) {
  return (
    <Box flex={1} backgroundColor="background" position="relative">
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={{
          position: 'absolute',
          top: 45,
          right: 15,
          zIndex: 1,
          backgroundColor: 'rgba(256,256,256,0.75)',
          borderRadius: 5,
          padding: 3,
        }}
      >
        <Ionicons name="close" size={30} color="black" />
      </TouchableOpacity>
      <Box flexDirection="row">
        {images.slice(0, 3).map((image) => (
          <ExpoImage
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              aspectRatio: 1,
              width: '33.333%',
            }}
            source={image.imageUrl}
          />
        ))}
      </Box>
      <Box flexDirection="row">
        {images.slice(3, 6).map((image) => (
          <ExpoImage
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              aspectRatio: 1,
              width: '33.333%',
            }}
            source={image.imageUrl}
          />
        ))}
      </Box>
      <Box flexDirection="row">
        {images.slice(0, 3).map((image) => (
          <ExpoImage
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              aspectRatio: 1,
              width: '33.333%',
            }}
            source={image.imageUrl}
          />
        ))}
      </Box>
      <Box flexDirection="row">
        {images.slice(6, 9).map((image) => (
          <ExpoImage
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              aspectRatio: 1,
              width: '33.333%',
            }}
            source={image.imageUrl}
          />
        ))}
      </Box>
      <Box
        justifyContent="center"
        alignItems="center"
        style={{ marginTop: -130 }}
      >
        <View
          style={{
            borderWidth: 5,
            borderColor: 'white',
            width: 200,
            height: 200,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'black',
            borderRadius: 280,
          }}
        >
          <Text variant="title" color="textOnBackground" fontSize={44}>
            39
          </Text>
          <Text color="textOnBackground">minutes left</Text>
        </View>
      </Box>
      <Box
        justifyContent="space-between"
        alignItems="center"
        marginTop="m"
        gap="s"
        flex={1}
        marginBottom="xl"
      >
        <Box gap="s" alignItems="center">
          <Text variant="title" fontSize={30}>
            Creating model ...
          </Text>
          <Text variant="body">Your model is currently being created! </Text>
          <Text variant="body" fontSize={14}>
            Estimated finish time: 17:00
          </Text>
        </Box>
        <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={1}>
          <Box
            marginTop="m"
            backgroundColor={'text'}
            borderRadius={10}
            width={width * 0.8}
          >
            <Text
              textAlign="center"
              fontWeight="bold"
              fontSize={18}
              color="textOnBackground"
              padding="m"
            >
              Hide model status
            </Text>
          </Box>
        </TouchableOpacity>
      </Box>
    </Box>
  );
}
