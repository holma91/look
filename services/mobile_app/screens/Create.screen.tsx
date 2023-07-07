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
import { useContext, useState } from 'react';
import { Button } from '../components/Button';
import { TrainingContext } from '../context/Training';

type ImageProps = {
  uri: string;
  id: string;
};

const { height, width } = Dimensions.get('window');

export default function Create({ navigation }: { navigation: any }) {
  const trainingContext = useContext(TrainingContext);
  console.log('trainingContext', trainingContext);

  const [selectedImages, setSelectedImages] = useState<ImageProps[]>([
    { uri: '', id: 'addButton' },
  ]);
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

        const fakeImage = { uri: '', id: 'addButton' };

        const updatedImages = [
          ...prevSelectedImages.filter((image) => image.id !== 'addButton'),
          ...newUris,
          fakeImage,
        ];
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

  const createModel = async () => {
    // do stuff
    navigation.replace('Creating');
  };

  return (
    <Box marginTop={'xl'} paddingHorizontal={'m'} gap="m" position="relative">
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={{
          position: 'absolute',
          top: 5,
          right: 15,
          zIndex: 1,
          backgroundColor: 'transparent',
          borderRadius: 5,
          padding: 3,
        }}
      >
        <Ionicons name="close" size={30} color="black" />
      </TouchableOpacity>
      <Box gap="s" paddingHorizontal="s" marginTop="s" paddingTop="xl" flex={0}>
        <Text variant="title">Pick 4-12 photos of yourself</Text>
        <Text variant="body">
          The more, the better. A higher number of good quality photos gives you
          more chances for incredible results!
        </Text>
      </Box>
      <Box minHeight={height * 0.64} maxHeight={height * 0.66} padding="xxs">
        <FlatList
          data={selectedImages}
          renderItem={({ item }) => (
            <View
              style={{
                flex: 1 / 3,
                flexDirection: 'column',
                margin: 2,
                // borderRadius: 5,
              }}
            >
              <TouchableOpacity
                onPress={() => (item.id === 'addButton' ? pickImages() : {})}
              >
                {item.id !== 'addButton' ? (
                  <Image
                    style={{
                      justifyContent: 'center',
                      alignItems: 'center',
                      aspectRatio: 1,
                      width: '100%',
                    }}
                    source={{ uri: item.uri }}
                  />
                ) : (
                  <View
                    style={{
                      justifyContent: 'center',
                      alignItems: 'center',
                      aspectRatio: 1,
                      width: '100%',
                      borderColor: 'gray',
                      borderWidth: 1,
                      borderStyle: 'dashed',
                    }}
                  >
                    <Ionicons name="add-sharp" size={32} color="gray" />
                  </View>
                )}

                {item.id !== 'addButton' && (
                  <Box
                    position="absolute"
                    top={5}
                    right={5}
                    padding="xs"
                    style={{ backgroundColor: 'rgba(150,150,150,0.7)' }}
                  >
                    <Ionicons
                      name="close-sharp"
                      size={18}
                      color="white"
                      onPress={() => removeImage(item)}
                    />
                  </Box>
                )}
              </TouchableOpacity>
            </View>
          )}
          numColumns={3}
          keyExtractor={(item) => item.id}
        />
      </Box>

      <TouchableOpacity
        onPress={createModel}
        disabled={!readyToCreate}
        activeOpacity={readyToCreate ? 0.2 : 1}
      >
        <Box
          backgroundColor={readyToCreate ? 'text' : 'darkGrey'}
          borderRadius={10}
        >
          <Text
            textAlign="center"
            fontWeight="bold"
            fontSize={18}
            color="textOnBackground"
            padding="m"
          >
            Create model
          </Text>
        </Box>
      </TouchableOpacity>
    </Box>
  );
}
