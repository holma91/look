import { FlatList, View, TouchableOpacity, SafeAreaView } from 'react-native';
import { Image as ExpoImage } from 'expo-image';
import Ionicons from '@expo/vector-icons/Ionicons';

import { Box } from '../styling/Box';
import { Text } from '../styling/Text';
import { useState } from 'react';
import { Button } from '../components/Button';

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
    imageUrl: require('../assets/models/whitewoman1.png'),
  },
  {
    id: '2',
    name: 'White man',
    imageUrl: require('../assets/models/whiteman1.png'),
  },
  {
    id: '3',
    name: 'Brown woman',
    imageUrl:
      'https://softgoat.centracdn.net/client/dynamic/images/2151_a7dc7bd334-softgoat-ss23-nc3763-turtleneck-singlet-light-blue-1795-4-size1024.jpg',
  },
  {
    id: '4',
    name: 'Black man',
    imageUrl:
      'https://adaysmarch.centracdn.net/client/dynamic/images/8080_342601e6d9-102521-20_frankie_relaxed_hoodie_oyster0085-max.jpg',
  },
  {
    id: '5',
    name: 'Asian woman',
    imageUrl:
      'https://images.lululemon.com/is/image/lululemon/LW3GAHS_059404_4?wid=750&op_usm=0.8,1,10,0&fmt=webp&qlt=80,1&fit=constrain,0&op_sharpen=0&resMode=sharp2&iccEmbed=0&printRes=72',
  },
  {
    id: '6',
    name: 'Black woman',
    imageUrl:
      'https://images.lululemon.com/is/image/lululemon/LW3GS5S_027597_4?wid=750&op_usm=0.8,1,10,0&fmt=webp&qlt=80,1&fit=constrain,0&op_sharpen=0&resMode=sharp2&iccEmbed=0&printRes=72',
  },
  {
    id: '7',
    name: 'Black man 2',
    imageUrl:
      'https://adaysmarch.centracdn.net/client/dynamic/images/8080_342601e6d9-102521-20_frankie_relaxed_hoodie_oyster0085-max.jpg',
  },
  {
    id: '8',
    name: 'Asian woman 2',
    imageUrl:
      'https://images.lululemon.com/is/image/lululemon/LW3GAHS_059404_4?wid=750&op_usm=0.8,1,10,0&fmt=webp&qlt=80,1&fit=constrain,0&op_sharpen=0&resMode=sharp2&iccEmbed=0&printRes=72',
  },
  {
    id: '9',
    name: 'Black woman 2',
    imageUrl:
      'https://images.lululemon.com/is/image/lululemon/LW3GS5S_027597_4?wid=750&op_usm=0.8,1,10,0&fmt=webp&qlt=80,1&fit=constrain,0&op_sharpen=0&resMode=sharp2&iccEmbed=0&printRes=72',
  },
];

export default function ModelPickerV2({ navigation }: { navigation: any }) {
  const [models, setModels] = useState<Model[]>(startingModels); // This should be your models data
  const [selectedModel, setSelectedModel] = useState<Model>(startingModels[1]);
  const [expanded, setExpanded] = useState(false);

  return (
    <Box backgroundColor="background" flex={1}>
      <Box flex={9}>
        <ExpoImage
          style={{
            width: '100%',
            height: '100%',
            // height: 512,
          }}
          source={selectedModel.imageUrl}
        />
      </Box>
      <Box
        margin="s"
        padding="m"
        borderWidth={1}
        // borderRadius={10}
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
                  navigation={navigation}
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
    </Box>
  );
}

type ModelProps = {
  navigation: any;
  model: Model;
  setSelectedModel: React.Dispatch<React.SetStateAction<Model>>;
  selectedModel: Model;
};

function Model({
  navigation,
  model,
  setSelectedModel,
  selectedModel,
}: ModelProps) {
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
