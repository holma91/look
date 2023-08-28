/*
CLIENT
1. upload image from camera roll
2. send image to server automatically for the embedding calculation (?)

SERVER
1. receive image, call SamPredictor.set_image to calculate an image embedding
2. send "ready" message when the image embedding is calculated

CLIENT
1. receive "ready" message, make the UI responsive for the user to click around to generate points
2. send point on click to server
*/

import React, { useState } from 'react';
import {
  View,
  Button,
  StyleSheet,
  TouchableOpacity,
  GestureResponderEvent,
  Switch,
} from 'react-native';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { Box, Text } from '../styling/RestylePrimitives';
import { PrimaryButton, SecondaryButton } from '../components/Button';

type Point = {
  x: number;
  y: number;
  type: 'positive' | 'negative';
};

export default function Testing() {
  const [image, setImage] = useState('');
  const [isReady, setIsReady] = useState(false);
  const [isDoingPositivePoints, setIsDoingPositivePoints] = useState(true);
  const [points, setPoints] = useState<Point[]>([]);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      uploadImage(result.assets[0].uri); // Replace this with your actual upload logic
    }
  };

  const uploadImage = async (uri: string) => {
    // TODO: upload the image to the server
    console.log(`Uploading image from URI: ${uri}`);
    resetPoints();
    setIsReady(true);
  };

  const handlePress = (e: GestureResponderEvent) => {
    const { locationX, locationY } = e.nativeEvent;
    const pointType = isDoingPositivePoints ? 'positive' : 'negative';
    setPoints([...points, { x: locationX, y: locationY, type: pointType }]);
  };

  const resetPoints = () => {
    setPoints([]);
  };

  const toggle = {
    title: 'Positive points',
    description: 'Use Look with a dark interface.',
    function: () => setIsDoingPositivePoints((previousState) => !previousState),
    value: isDoingPositivePoints,
  };

  return (
    <Box justifyContent="center" alignItems="center" flex={1} gap="s">
      <TouchableOpacity
        activeOpacity={1}
        style={{
          width: '100%',
          height: '72.5%',
          position: 'relative',
        }}
        disabled={!isReady}
        onPress={handlePress}
      >
        <Image
          source={{ uri: image }}
          style={{ width: '100%', height: '100%' }}
          contentFit="contain"
        />
        {points.map((point, index) => (
          <View
            key={index}
            style={[
              styles.point,
              {
                left: point.x - 5,
                top: point.y - 5,
                backgroundColor: point.type === 'positive' ? 'blue' : 'red',
              },
            ]}
          />
        ))}
      </TouchableOpacity>
      <Box flex={1} gap="m">
        <Box
          flexDirection="row"
          key={toggle.title}
          alignItems="center"
          justifyContent="space-between"
          gap="xl"
        >
          <Text variant="smallTitle">{toggle.title}</Text>
          <Switch
            trackColor={{ false: '#767577', true: 'green' }}
            thumbColor={'#f4f3f4'}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggle.function}
            value={toggle.value}
          />
        </Box>
        <SecondaryButton label="Reset points" onPress={resetPoints} />
        <PrimaryButton label="Pick an image" onPress={pickImage} />

        <Button title="Pick an image from camera roll" onPress={pickImage} />
      </Box>
    </Box>
  );
}

const styles = StyleSheet.create({
  point: {
    position: 'absolute',
    width: 10,
    height: 10,
    backgroundColor: 'blue',
    borderRadius: 5,
  },
});
