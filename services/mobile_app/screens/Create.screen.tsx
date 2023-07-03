import {
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  View,
  Image,
  Dimensions,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as ImagePicker from 'expo-image-picker';
import { Box } from '../styling/Box';
import { Text } from '../styling/Text';
import { useState } from 'react';
import { Button } from '../components/Button';

const defaultImages = [
  {
    uri: 'https://softgoat.centracdn.net/client/dynamic/images/2151_a7dc7bd334-softgoat-ss23-nc3763-turtleneck-singlet-light-blue-1795-4-size1024.jpg',
    id: '1',
  },
  {
    uri: 'https://softgoat.centracdn.net/client/dynamic/images/2151_a7dc7bd334-softgoat-ss23-nc3763-turtleneck-singlet-light-blue-1795-4-size1024.jpg',
    id: '2',
  },
  {
    uri: 'https://softgoat.centracdn.net/client/dynamic/images/2151_a7dc7bd334-softgoat-ss23-nc3763-turtleneck-singlet-light-blue-1795-4-size1024.jpg',
    id: '3',
  },
];

type ImageProps = {
  uri: string;
  id: string;
};

const { width, height } = Dimensions.get('window');

export default function Create({ navigation }: { navigation: any }) {
  const [selectedImages, setSelectedImages] = useState<ImageProps[]>([]);
  const [readyToCreate, setReadyToCreate] = useState(false);

  const pickImages = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsMultipleSelection: true,
      quality: 1,
    });

    if (!result.canceled) {
      const images: ImageProps[] = result.assets.map((asset) => {
        let assetId = asset.assetId;
        if (!assetId) {
          // Android does not provide assetId under certain circumstances
          assetId = asset.uri;
        }
        return { uri: asset.uri, id: assetId };
      });

      setSelectedImages((prevSelectedImages) => {
        const prevSelectedImageIds = prevSelectedImages.map(
          (image) => image.id
        );
        const newUris = images.filter(
          (image) => !prevSelectedImageIds.includes(image.id)
        );
        const updatedImages = [...prevSelectedImages, ...newUris];

        if (updatedImages.length >= 6) {
          setReadyToCreate(true);
        }

        return updatedImages;
      });
    } else {
      alert('You did not select any image.');
    }
  };

  const removeImage = async (oldImage: ImageProps) => {
    const newImages = selectedImages.filter(
      (image) => image.uri !== oldImage.uri
    );
    setSelectedImages(newImages);
    if (newImages.length < 6) {
      setReadyToCreate(false);
    }
  };

  console.log('selectedImages', selectedImages);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Box paddingHorizontal="m" gap="m">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={30} color="black" />
        </TouchableOpacity>
        <Box gap="s" paddingHorizontal="s" flex={0}>
          <Text variant="title">Pick 4-12 photos of yourself</Text>
          <Text variant="body">
            The more, the better. A higher number of good quality photos gives
            you more chances for incredible results!
          </Text>
        </Box>
        <Box
          borderWidth={4}
          borderRadius={10}
          minHeight={height * 0.65}
          padding="xxs"
        >
          <FlatList
            data={selectedImages}
            renderItem={({ item }) => (
              <View
                style={{
                  flex: 1 / 3,
                  flexDirection: 'column',
                  margin: 2,
                  borderRadius: 5,
                }}
              >
                <TouchableOpacity onPress={() => removeImage(item)}>
                  <Image
                    style={{
                      justifyContent: 'center',
                      alignItems: 'center',
                      aspectRatio: 1, // This ensures that your images are always squares
                      width: '100%',
                      borderRadius: 5,
                    }}
                    source={{ uri: item.uri }}
                  />
                  <Box
                    position="absolute"
                    top={5}
                    right={5}
                    padding="xs"
                    borderRadius={5}
                    style={{ backgroundColor: 'rgba(150,150,150,0.7)' }}
                  >
                    <Ionicons name="close-sharp" size={18} color="white" />
                  </Box>
                </TouchableOpacity>
              </View>
            )}
            numColumns={3}
            keyExtractor={(item) => item.id}
          />
        </Box>
        <Button
          flex={0}
          label="Upload photos"
          onPress={pickImages}
          variant="tertiary"
          fontSize={16}
          color="textOnBackground"
          padding="s"
        ></Button>
      </Box>
    </SafeAreaView>
  );
}
