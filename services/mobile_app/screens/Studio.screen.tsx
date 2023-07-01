import {
  FlatList,
  Dimensions,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { Image as ExpoImage } from 'expo-image';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import { Button } from '../components/Button';
import { Box } from '../styling/Box';
import { Text } from '../styling/Text';
import { UserProduct } from '../utils/types';
import { useRef, useState } from 'react';

const { width } = Dimensions.get('window');

export default function Studio({
  navigation,
  route,
}: {
  navigation: any;
  route: any;
}) {
  const [activeIndex, setActiveIndex] = useState(0);

  const { product }: { product: UserProduct } = route.params;
  console.log(product);

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50, // Item is considered visible if 50% of its area is showing
  }).current;

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: any }) => {
      setActiveIndex(viewableItems[0].index);
    }
  ).current;

  return (
    <Box backgroundColor="background" flex={1}>
      <Box flex={1}>
        <TouchableOpacity
          style={{
            position: 'absolute',
            top: 50,
            right: 20,
            zIndex: 1,
            backgroundColor: 'rgba(256, 256, 256, 0.5)',
            borderRadius: 50,
            width: 42,
            height: 42,
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="close" size={30} color="black" />
        </TouchableOpacity>
        <Box>
          <ExpoImage
            source={{ uri: product.images[0] }}
            style={{ width: width, height: '100%' }}
            resizeMode="cover"
          />
        </Box>
      </Box>
      <Box flex={0} padding="m" justifyContent="space-between" marginBottom="m">
        <Box
          alignContent="space-between"
          justifyContent="space-between"
          gap="m"
        >
          <Box
            marginTop="none"
            padding="m"
            borderWidth={1}
            borderRadius={10}
            borderColor="grey"
            flexDirection="row"
            justifyContent="space-between"
          >
            <Text variant="body" fontWeight="bold">
              Selected Model:
            </Text>
            <Text variant="body" fontWeight="bold">
              White man
            </Text>
          </Box>
          <Button
            label={`Test on model`}
            onPress={() => {}}
            variant="tertiary"
            fontSize={17}
            paddingVertical="s"
            color="textOnBackground"
          ></Button>
        </Box>
      </Box>
    </Box>
  );
}
