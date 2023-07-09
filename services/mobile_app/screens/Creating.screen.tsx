import { useContext, useEffect, useRef } from 'react';
import { View, Dimensions, TouchableOpacity, Animated } from 'react-native';
import { Image as ExpoImage } from 'expo-image';
import Ionicons from '@expo/vector-icons/Ionicons';
import CircularProgress from 'react-native-circular-progress-indicator';

import { Box } from '../styling/Box';
import { Text } from '../styling/Text';
import { Button } from '../components/NewButton';
import { TrainingContext } from '../context/Training';

const images = [
  {
    id: '1',
    name: 'White woman',
    imageUrl: require('../assets/models/whitewoman/2.png'),
  },
  {
    id: '2',
    name: 'White man',
    imageUrl: require('../assets/models/whiteman/1.png'),
  },
  {
    id: '3',
    name: 'Black man',
    imageUrl: require('../assets/models/blackman/3.png'),
  },
  {
    id: '4',
    name: 'Black woman',
    imageUrl: require('../assets/models/blackwoman/2.png'),
  },
  {
    id: '5',
    name: 'Asian woman',
    imageUrl: require('../assets/models/asianwoman/4.png'),
  },
  {
    id: '6',
    name: 'Asian man',
    imageUrl: require('../assets/models/asianman/2.png'),
  },
  {
    id: '7',
    name: 'Black man',
    imageUrl: require('../assets/models/blackman/2.png'),
  },
  {
    id: '8',
    name: 'me',
    imageUrl: require('../assets/models/me/3.png'),
  },
  {
    id: '9',
    name: 'me',
    imageUrl: require('../assets/models/asianwoman/2.png'),
  },
];

const { height, width } = Dimensions.get('window');

export default function Creating({ navigation }: { navigation: any }) {
  const { remainingTime } = useContext(TrainingContext);

  const borderColorAnimation = useRef(
    new Animated.Value(remainingTime)
  ).current;

  useEffect(() => {
    Animated.timing(borderColorAnimation, {
      toValue: remainingTime,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  }, [remainingTime]);

  const borderColor = borderColorAnimation.interpolate({
    inputRange: [0, 15], // change the values according to your needs
    outputRange: ['rgb(0, 255, 0)', 'rgb(255, 255, 255)'],
  });

  const progress = (remainingTime / 15) * 100; // Assuming total time is 15 minutes. Adjust it according to your needs.

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
      {[
        [0, 3],
        [3, 6],
        [6, 9],
      ].map((range) => (
        <Box flexDirection="row">
          {images.slice(range[0], range[1]).map((image) => (
            <ExpoImage
              key={image.id}
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
      ))}
      <Box flexDirection="row">
        {images.slice(0, 3).map((image) => (
          <ExpoImage
            key={image.id}
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
            {remainingTime}
          </Text>
          <Text color="textOnBackground">minutes left</Text>
        </View>
        {/* <CircularProgress
          value={15 - remainingTime}
          radius={120}
          maxValue={15}
          initialValue={0}
          progressValueColor={'#fff'}
          activeStrokeWidth={15}
          inActiveStrokeWidth={15}
          duration={15000}
          title={'minutes left'}
          titleFontSize={20}
          titleColor={'white'}
          circleBackgroundColor="black"
          titleStyle={{ fontWeight: 'bold' }}
          onAnimationComplete={() => alert('time out')}
        /> */}
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
