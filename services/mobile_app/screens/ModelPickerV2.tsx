import { FlatList, View, TouchableOpacity, SafeAreaView } from 'react-native';
import { Image as ExpoImage } from 'expo-image';
import Ionicons from '@expo/vector-icons/Ionicons';

import { Box } from '../styling/Box';
import { Text } from '../styling/Text';
import { useContext, useState } from 'react';
import { Button } from '../components/Button';
import { TrainingContext } from '../context/Training';
import EmojiSticker from '../components/EmojiSticker';
import TrainingSticker from '../components/TrainingSticker';

type Model = {
  id: string;
  name: string;
  imageUrl: string;
};

const startingModels: Model[] = [
  { id: 'addButton', name: '', imageUrl: '' },
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
    name: 'me',
    imageUrl: require('../assets/models/me/3.png'),
  },
];

export default function ModelPickerV2({ navigation }: { navigation: any }) {
  const { isTraining, setIsTraining } = useContext(TrainingContext);
  const [models, setModels] = useState<Model[]>(startingModels);
  const [selectedModel, setSelectedModel] = useState<Model>(startingModels[1]);

  console.log('isTraining', isTraining);

  return (
    <Box backgroundColor="background" flex={1} position="relative">
      <Box flex={9}>
        <ExpoImage
          style={{
            width: '100%',
            height: '100%',
          }}
          source={selectedModel.imageUrl}
        />
      </Box>
      <Box
        margin="s"
        padding="m"
        borderWidth={1}
        borderColor="grey"
        flexDirection="row"
        justifyContent="space-between"
      >
        <Text variant="body" fontWeight="bold">
          Selected Model:
        </Text>
        <Text variant="body" fontWeight="bold">
          {selectedModel.name}
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
                  setSelectedModel={setSelectedModel}
                  selectedModel={selectedModel}
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
  setSelectedModel: React.Dispatch<React.SetStateAction<Model>>;
  selectedModel: Model;
};

function Model({ model, setSelectedModel, selectedModel }: ModelProps) {
  return (
    <TouchableOpacity
      onPress={() => {
        setSelectedModel(model);
      }}
      style={{ flex: 1 }}
    >
      <Box flex={1} marginBottom="s" marginRight="s">
        <ExpoImage
          style={{
            width: 128,
            height: 128,
            borderWidth: selectedModel.id === model.id ? 2 : 0,
          }}
          source={model.imageUrl}
        />
      </Box>
    </TouchableOpacity>
  );
}
