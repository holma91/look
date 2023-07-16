import {
  FlatList,
  Dimensions,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { Image as ExpoImage } from 'expo-image';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import { Box } from '../styling/Box';
import { Text } from '../styling/Text';
import { UserProduct } from '../utils/types';
import { useRef, useState } from 'react';
import Animated from 'react-native-reanimated';

const { width } = Dimensions.get('window');

const demoImages: { [key: string]: any } = {
  basic: [
    require('../assets/generations/demo/basic/1.png'),
    require('../assets/generations/demo/basic/2.png'),
    require('../assets/generations/demo/basic/3.png'),
    require('../assets/generations/demo/basic/4.png'),
    require('../assets/generations/demo/basic/5.png'),
    require('../assets/generations/demo/basic/6.png'),
    require('../assets/generations/demo/basic/7.png'),
    require('../assets/generations/demo/basic/8.png'),
    require('../assets/generations/demo/basic/9.png'),
    require('../assets/generations/demo/basic/10.png'),
    require('../assets/generations/demo/basic/15.png'),
    require('../assets/generations/demo/basic/20.png'),
    require('../assets/generations/demo/basic/25.png'),
  ],
  other: [
    require('../assets/generations/demo/kitchen.png'),
    require('../assets/generations/demo/park.png'),
    require('../assets/generations/demo/timessquare.png'),
    require('../assets/generations/demo/villa.png'),
  ],
};

export default function Studio({
  navigation,
  route,
}: {
  navigation: any;
  route: any;
}) {
  const [currentImages, setCurrentImages] = useState([
    route.params.product.images[0],
  ]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 50 }).current;

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: any }) => {
      setActiveIndex(viewableItems[0].index);
    }
  ).current;

  const handleGenerate = async () => {
    if (isGenerating) return;
    setIsGenerating(true);
    for (let i = 0; i < demoImages['basic'].length; i++) {
      setCurrentImages([demoImages['basic'][i]]);
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
    setIsGenerating(false);

    setCurrentImages(
      [demoImages['basic'][demoImages['basic'].length - 1]].concat(
        demoImages['other']
      )
    );
  };

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
        <FlatList
          data={currentImages}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          keyExtractor={(_, index) => index.toString()}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          renderItem={({ item }) => (
            <ExpoImage
              source={item}
              style={{ width: width, height: '100%' }}
              resizeMode="cover"
            />
          )}
        />
        <Box
          flexDirection="row"
          justifyContent="center"
          position="absolute"
          bottom={35}
          width="100%"
        >
          {currentImages.length > 1
            ? currentImages.map((_: any, i: number) => (
                <Box
                  key={i}
                  width={7}
                  height={7}
                  borderRadius={40}
                  backgroundColor={i === activeIndex ? 'text' : 'background'}
                  marginHorizontal="s"
                />
              ))
            : null}
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
            label={isGenerating ? 'is generating...' : `Test on model`}
            onPress={handleGenerate}
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
