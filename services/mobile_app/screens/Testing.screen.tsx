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

import React, { useEffect, useRef, useState } from 'react';
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
import { set } from 'react-native-reanimated';

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
  const [uid, setUid] = useState(null);
  const [imgWidth, setImgWidth] = useState(0);
  const [imgHeight, setImgHeight] = useState(0);
  const [maskData, setMaskData] = useState(null);

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

  const getEmbedding = async () => {
    try {
      const formData = new FormData();
      formData.append('image', {
        uri: image,
        name: 'image.jpg',
        type: 'image/jpg',
      } as any);

      const response = await fetch(
        'http://localhost:8080/predictions/sam_embeddings/1.0',
        {
          method: 'POST',
          body: formData,
        }
      );

      const data = await response.json();

      console.log('Received embedding:', data);

      if (data[0]) {
        setUid(data[0]); // Set the uid in state
        console.log(`Received UID: ${data[0]}`);
      }
    } catch (error) {
      console.error(`Error during embedding: ${error}`);
    }
  };

  const getMask = async () => {
    try {
      const pointCoords = points.map((p) => [p.x, p.y]);
      const pointLabels = points.map((p) => (p.type === 'positive' ? 1 : 0));

      // we have a size problem, what we get back seems to big

      const response = await fetch(
        'http://localhost:8080/predictions/sam_masks/1.0',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            uid,
            point_coords: pointCoords,
            point_labels: pointLabels,
          }),
        }
      );

      const data = await response.json();

      console.log('Received mask shape:', data.shape);
      console.log('Received mask data[0]:', data[0]);
      setMaskData(data[0]); // now just iterate over the pixel values and set them if maskData[i][j] === true
    } catch (error) {
      console.error(`Error during mask prediction: ${error}`);
    }
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
          onLoad={(e) => {
            const { width, height } = e.source;
            console.log(
              `Image loaded with width: ${width} and height: ${height}`
            );
            setImgWidth(width);
            setImgHeight(height);
            // Update the state variables or any other logic here
          }}
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
        <Box flexDirection="row" gap="m">
          <Box gap="sm">
            <SecondaryButton label="Reset points" onPress={resetPoints} />
            <PrimaryButton label="Pick an image" onPress={pickImage} />
          </Box>
          <Box gap="sm">
            <SecondaryButton label="Get embedding" onPress={getEmbedding} />
            <PrimaryButton label="Get mask" onPress={getMask} />
          </Box>
        </Box>
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
