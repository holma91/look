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
  const [isInitializing, setIsInitializing] = useState(false);
  const {
    isTraining,
    setIsTraining,
    remainingTime,
    setRemainingTime,
    setTrainedModels,
  } = useContext(TrainingContext);

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
    setIsInitializing(true);
    setTimeout(() => {
      setIsTraining(true);
      setRemainingTime(15); // start countdown from 5 seconds
      navigation.replace('Creating');
      setIsInitializing(false);

      const timerId = setInterval(() => {
        setRemainingTime((prevTime) => {
          if (prevTime <= 1) {
            // Time is up
            clearInterval(timerId);
            setIsTraining(false);
            setTrainedModels((prevModels) => prevModels + 1);
            return 0;
          } else {
            return prevTime - 1;
          }
        });
      }, 1000);

      // Save timerId for cleanup
      return () => clearInterval(timerId);
    }, 3000);
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
        <Text variant="title">
          Upload between 5 and 15 pictures of yourself
        </Text>
        <Text variant="body">
          More images is better, and make sure your face is visible in all the
          images.
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
            {isInitializing ? 'Initializing...' : 'Create Model'}
          </Text>
        </Box>
      </TouchableOpacity>
    </Box>
  );
}
