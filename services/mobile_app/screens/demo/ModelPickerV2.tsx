import { FlatList, View, TouchableOpacity } from 'react-native';
import { Image as ExpoImage } from 'expo-image';
import Ionicons from '@expo/vector-icons/Ionicons';

import { Box, Text } from '../../styling/RestylePrimitives';
import { useContext, useEffect, useState } from 'react';
import { TrainingContext } from '../../context/Training';
import TrainingSticker from '../../components/TrainingSticker';

type Model = {
  id: string;
  name: string;
  imageUrl: string;
};

const startingModels: Model[] = [
  { id: 'addButton', name: '', imageUrl: '' },
  {
    id: 'me',
    name: 'me',
    imageUrl: require('../../assets/models/me/3.png'),
  },
  {
    id: '1',
    name: 'White man',
    imageUrl: require('../../assets/models/whiteman/1.png'),
  },
  {
    id: '2',
    name: 'White woman',
    imageUrl: require('../../assets/models/whitewoman/2.png'),
  },
  {
    id: '3',
    name: 'Black man',
    imageUrl: require('../../assets/models/blackman/3.png'),
  },
  {
    id: '4',
    name: 'Black woman',
    imageUrl: require('../../assets/models/blackwoman/2.png'),
  },
  {
    id: '5',
    name: 'Asian woman',
    imageUrl: require('../../assets/models/asianwoman/4.png'),
  },
  {
    id: '6',
    name: 'Asian man',
    imageUrl: require('../../assets/models/asianman/2.png'),
  },
];

export default function ModelPickerV2({ navigation }: { navigation: any }) {
  const { isTraining, trainedModels, activeModel, setActiveModel } =
    useContext(TrainingContext);
  const [models, setModels] = useState<Model[]>(startingModels);

  console.log('isTraining', isTraining);

  useEffect(() => {
    console.log(`Number of trained models: ${trainedModels}`);
  }, [trainedModels]);

  return (
    <Box backgroundColor="background" flex={1} position="relative">
      <Box flex={9}>
        <ExpoImage
          style={{
            width: '100%',
            height: '100%',
          }}
          source={activeModel.imageUrl}
        />
      </Box>
      <Box
        margin="s"
        padding="m"
        flexDirection="row"
        justifyContent="center"
        alignItems="center"
      >
        <Text variant="body" fontWeight="bold" fontSize={22}>
          {activeModel.name}
        </Text>
      </Box>
      <Box flex={3} gap="m">
        <Text
          variant="body"
          fontWeight="bold"
          paddingTop="s"
          paddingHorizontal="m"
        >
          Other models:
        </Text>
        <FlatList
          data={models}
          horizontal
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingLeft: 12 }}
          renderItem={({ item }) => (
            <View>
              {item.id === 'addButton' ? (
                <TouchableOpacity
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    aspectRatio: 1,
                    width: 128,
                    marginRight: 8,
                    borderColor: 'gray',
                    borderWidth: 1,
                    borderStyle: 'dashed',
                  }}
                  onPress={() => navigation.navigate('Create')}
                >
                  <Ionicons name="add-sharp" size={32} color="gray" />
                </TouchableOpacity>
              ) : (
                <Model
                  model={item}
                  activeModel={activeModel}
                  setActiveModel={setActiveModel}
                  trainedModels={trainedModels}
                />
              )}
            </View>
          )}
          showsHorizontalScrollIndicator={false}
        />
      </Box>

      {isTraining ? <TrainingSticker navigation={navigation} /> : null}
    </Box>
  );
}

type ModelProps = {
  model: Model;
  activeModel: Model;
  setActiveModel: React.Dispatch<React.SetStateAction<Model>>;
  trainedModels?: number;
};

function Model({
  model,
  activeModel,
  setActiveModel,
  trainedModels,
}: ModelProps) {
  if (model.id === 'me' && trainedModels === 0) {
    return null;
  }

  return (
    <TouchableOpacity
      onPress={() => {
        setActiveModel(model);
      }}
      style={{ flex: 1 }}
    >
      <Box flex={1} marginBottom="s" marginRight="s">
        <ExpoImage
          style={{
            width: 128,
            height: 128,
            borderWidth: activeModel.id === model.id ? 2 : 0,
          }}
          source={model.imageUrl}
        />
      </Box>
    </TouchableOpacity>
  );
}
