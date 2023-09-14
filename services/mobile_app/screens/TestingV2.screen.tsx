import { SafeAreaView } from 'react-native-safe-area-context';
import {
  BackdropFilter,
  Blur,
  Canvas,
  Circle,
  ColorMatrix,
  Fill,
  Group,
  Image,
  Mask,
  Offset,
  Rect,
  Skia,
  useImage,
} from '@shopify/react-native-skia';
import * as ImagePicker from 'expo-image-picker';
import { Image as ExpoImage } from 'expo-image';

import { Box, Text } from '../styling/RestylePrimitives';
import {
  Dimensions,
  GestureResponderEvent,
  Switch,
  TouchableOpacity,
} from 'react-native';

import { PrimaryButton, SecondaryButton } from '../components/Button';
import { useState } from 'react';

const { width, height } = Dimensions.get('window');

type Point = {
  x: number;
  y: number;
  type: 'positive' | 'negative';
};

export default function TestingV2() {
  const [image, setImage] = useState('');
  const [isDoingPositivePoints, setIsDoingPositivePoints] = useState(true);
  const [points, setPoints] = useState<Point[]>([]);
  const [uid, setUid] = useState('');
  const [mask, setMask] = useState('');

  // og image is 1024x1369
  const originalWidth = 1024;
  const originalHeight = 1369;
  const aspectRatio = originalHeight / originalWidth;

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      quality: 1,
    });

    if (!result.canceled) {
      console.log('ImagePicker result:', result);

      setImage(result.assets[0].uri);
      uploadImage(result.assets[0].uri); // Replace this with your actual upload logic
    }
  };

  const uploadImage = async (uri: string) => {
    // TODO: upload the image to the server
    console.log(`Uploading image from URI: ${uri}`);
    resetJob();
    getEmbedding(uri);
  };

  const handleCanvasPress = (e: GestureResponderEvent) => {
    const { locationX, locationY } = e.nativeEvent;
    const pointType = isDoingPositivePoints ? 'positive' : 'negative';
    setPoints([...points, { x: locationX, y: locationY, type: pointType }]);
  };

  const resetAll = () => {
    resetJob();
    setImage('');
  };

  const resetJob = () => {
    setPoints([]);
    setMask('');
  };

  const toggle = {
    title: 'Positive points',
    description: 'Use Look with a dark interface.',
    function: () => setIsDoingPositivePoints((previousState) => !previousState),
    value: isDoingPositivePoints,
  };

  const getEmbedding = async (uri: string) => {
    try {
      const formData = new FormData();
      formData.append('image', {
        uri: uri,
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
      let pointCoords = points.map((p) => [p.x, p.y]);
      let pointLabels = points.map((p) => (p.type === 'positive' ? 1 : 0));

      pointCoords = pointCoords.map((p) => [
        p[0] * (originalWidth / 390),
        p[1] * (originalHeight / (390 * aspectRatio)),
      ]);

      console.log('pointCoords:', pointCoords);
      console.log('pointLabels:', pointLabels);

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

      setMask(data[0]);
      // setMaskData(`data:image/png;base64,${data[0]}`);
    } catch (error) {
      console.error(`Error during mask prediction: ${error}`);
    }
  };

  console.log('image:', image);

  const getMaskReady = uid !== '' && points.length > 0;

  return (
    <SafeAreaView edges={['right', 'top', 'left']} style={{ flex: 1 }}>
      <Box flex={1}>
        <FittingExample
          currentImage={image}
          aspectRatio={aspectRatio}
          isDoingPositivePoints={isDoingPositivePoints}
          handleCanvasPress={handleCanvasPress}
          points={points}
          mask={mask}
        />
        <Box gap="m" alignItems="center" paddingBottom="m" paddingTop="s">
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
          <Box flexDirection="row" gap="m" justifyContent="space-evenly">
            <Box gap="sm">
              <SecondaryButton label="Reset all" onPress={resetAll} />
              <PrimaryButton label="Pick an image" onPress={pickImage} />
            </Box>
            <Box gap="sm">
              <SecondaryButton label="Reset job" onPress={resetJob} />
              <PrimaryButton
                label="Get mask"
                onPress={getMask}
                disabled={!getMaskReady}
                opacity={!getMaskReady ? 0.5 : 1}
              />
            </Box>
          </Box>
        </Box>
      </Box>
    </SafeAreaView>
  );
}

type FittingExampleProps = {
  currentImage: string;
  aspectRatio: number;
  isDoingPositivePoints: boolean;
  handleCanvasPress: (e: GestureResponderEvent) => void;
  points: Point[];
  mask: string;
};

const FittingExample = ({
  currentImage,
  aspectRatio,
  isDoingPositivePoints,
  handleCanvasPress,
  points,
  mask,
}: FittingExampleProps) => {
  const image = useImage(currentImage);
  const maskImage = Skia.Image.MakeImageFromEncoded(Skia.Data.fromBase64(mask));

  const imgWidth = 390; // width / 390
  const imgHeight = Math.floor(imgWidth * aspectRatio);

  console.log('screen width: ', width);
  console.log('screen height: ', height);

  console.log('imgWidth: ', imgWidth);
  console.log('imgHeight: ', imgHeight);

  // console.log('maskImage height:', maskImage?.height());
  // console.log('maskImage width:', maskImage?.width());

  // console.log('image height:', image?.height());
  // console.log('image width:', image?.width());

  return (
    <Box flex={1}>
      <TouchableOpacity
        activeOpacity={1}
        onPress={handleCanvasPress}
        style={{ flex: 1 }}
      >
        <Canvas style={{ width: 390, height: 844 }}>
          {mask !== '' ? (
            <Mask
              mode="luminance"
              mask={
                <Group>
                  <Image
                    image={maskImage}
                    fit="cover"
                    x={0}
                    y={0}
                    width={imgWidth}
                    height={imgHeight}
                  />
                </Group>
              }
            >
              <Image
                image={image}
                fit="cover"
                x={0}
                y={0}
                width={imgWidth}
                height={imgHeight}
              />
            </Mask>
          ) : (
            <Image
              image={image}
              fit="cover"
              x={0}
              y={0}
              width={imgWidth}
              height={imgHeight}
            />
          )}
          {points.map((point, index) => (
            <Circle
              key={index}
              cx={point.x}
              cy={point.y}
              r={5}
              color={point.type === 'positive' ? 'blue' : 'red'}
            />
          ))}
        </Canvas>
      </TouchableOpacity>
    </Box>
  );
};
