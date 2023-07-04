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

type ImageProps = {
  uri: string;
  id: string;
};

const { height, width } = Dimensions.get('window');

export default function Create({ navigation }: { navigation: any }) {
  const [selectedImages, setSelectedImages] = useState<ImageProps[]>([
    { uri: '', id: 'addButton' },
  ]);
  const [readyToCreate, setReadyToCreate] = useState(false);
  const [creationMode, setCreationMode] = useState(false);

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
    setCreationMode(true);
  };

  return (
    <Box
      marginTop={creationMode ? 'none' : 'xl'}
      paddingHorizontal={creationMode ? 'none' : 'm'}
      gap="m"
      position="relative"
    >
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={{
          position: 'absolute',
          top: creationMode ? 45 : 5,
          left: 20,
          zIndex: 1,
          backgroundColor: creationMode
            ? 'rgba(256,256,256,0.5)'
            : 'transparent',
          borderRadius: 5,
          padding: 3,
        }}
      >
        <Ionicons name="chevron-back" size={30} color="black" />
      </TouchableOpacity>
      {!creationMode && (
        <Box
          gap="s"
          paddingHorizontal="s"
          marginTop="s"
          paddingTop="xl"
          flex={0}
        >
          <Text variant="title">Pick 4-12 photos of yourself</Text>
          <Text variant="body">
            The more, the better. A higher number of good quality photos gives
            you more chances for incredible results!
          </Text>
        </Box>
      )}
      <Box
        minHeight={creationMode ? 0 : height * 0.64}
        maxHeight={height * 0.66}
        padding="xxs"
      >
        <FlatList
          data={selectedImages}
          renderItem={({ item }) => (
            <View
              style={{
                flex: 1 / 3,
                flexDirection: 'column',
                margin: creationMode ? 0 : 2,
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
                ) : !creationMode ? (
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
                ) : null}

                {item.id !== 'addButton' && !creationMode && (
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

      {!creationMode && (
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
      )}

      {creationMode && (
        <>
          <View style={{ position: 'absolute', top: '75%', left: '25%' }}>
            <View
              style={{
                borderWidth: 4,
                borderColor: 'white',
                width: width / 2,
                height: width / 2,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'black',
                borderRadius: 180,
              }}
              onTouchEnd={() => setCreationMode(false)}
            >
              <Text variant="title" color="textOnBackground" fontSize={44}>
                39
              </Text>
              <Text color="textOnBackground">minutes left</Text>
            </View>
          </View>
          <Box
            paddingTop="l"
            position="absolute"
            top="110%"
            width="100%"
            justifyContent="center"
            alignItems="center"
            gap="s"
          >
            <Text variant="title" fontSize={30}>
              Creating model ...
            </Text>
            <Text variant="body">Your model is currently being created!</Text>
            <Text variant="body" fontSize={13}>
              Estimated finish time: 17:00
            </Text>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              disabled={!readyToCreate}
              activeOpacity={readyToCreate ? 0.2 : 1}
            >
              <Box
                marginTop="m"
                backgroundColor={readyToCreate ? 'text' : 'darkGrey'}
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
        </>
      )}
    </Box>
  );
}
