import { useState } from 'react';
import { SafeAreaView, Image, FlatList, View } from 'react-native';
import { createBox, createText } from '@shopify/restyle';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Theme } from '../styling/theme';
import { Button } from '../components/Button';

const Box = createBox<Theme>();
const Text = createText<Theme>();

type ImageProps = {
  uri: string;
  id: string;
};

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

  const createLora = async () => {
    console.log('Creating Lora');
  };

  return (
    <Box backgroundColor="background" flex={1}>
      <SafeAreaView style={{ flex: 1 }}>
        <Box
          flex={1}
          paddingHorizontal="m"
          gap="s"
          justifyContent="space-between"
          marginVertical="m"
        >
          <Box
            flex={1}
            // borderColor="primary"
            // borderWidth={2}
            // borderRadius={10}
            padding="m"
          >
            <Text
              variant="body"
              fontWeight="bold"
              fontSize={18}
              marginBottom="m"
              marginHorizontal="s"
            >
              Your photos
            </Text>
            <FlatList
              data={selectedImages}
              renderItem={({ item }) => (
                <View
                  style={{
                    flex: 1,
                    flexDirection: 'column',
                    margin: 3,
                    borderRadius: 10,
                    position: 'relative',
                  }}
                >
                  <Image
                    style={{
                      justifyContent: 'center',
                      alignItems: 'center',
                      height: 100,
                      width: '100%',
                      borderRadius: 5,
                    }}
                    source={{ uri: item.uri }}
                  />
                  <View
                    style={{
                      position: 'absolute',
                      top: 5,
                      right: 5,
                      backgroundColor: 'rgba(150,150,150,0.7)',
                      borderRadius: 8,
                      padding: 4,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                    onTouchEnd={() => removeImage(item)}
                  >
                    <Ionicons name="close-sharp" size={18} color="white" />
                  </View>
                </View>
              )}
              numColumns={3}
              keyExtractor={(item) => item.id}
            />
          </Box>
          {readyToCreate ? (
            <Button
              label="Create LoRA"
              onPress={createLora}
              variant="primary"
            ></Button>
          ) : (
            <Button
              label="Upload photos"
              onPress={pickImages}
              variant="primary"
            ></Button>
          )}
        </Box>
      </SafeAreaView>
    </Box>
  );
}
