import { FlatList, TouchableOpacity, SafeAreaView } from 'react-native';
import { Image as ExpoImage } from 'expo-image';
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
];

export default function ModelPicker({ navigation }: { navigation: any }) {
  const [models, setModels] = useState<Model[]>(startingModels); // This should be your models data
  const [selectedModel, setSelectedModel] = useState<Model>(startingModels[0]);
  const [expanded, setExpanded] = useState(false);

  return (
    <Box backgroundColor="background" flex={1}>
      <Box
        flex={0.25} // Adjust this to control the size of the image
        position="relative"
      >
        <ExpoImage
          style={{
            width: '100%',
            height: '100%',
            opacity: 0.3,
          }}
          source={{
            uri: 'https://softgoat.centracdn.net/client/dynamic/images/2167_c2c4adff2f-30-size1024.jpg',
          }}
        />
        <Box position="absolute" bottom={30} left={20} width="60%">
          <Text variant="title" fontWeight="bold">
            Create a model of yourself
          </Text>
        </Box>
        <Box position="absolute" bottom={30} right={20}>
          <Button
            variant="tertiary"
            color="textOnBackground"
            padding="xs"
            label="Try Now"
            onPress={() => {
              console.log('Create model');

              navigation.navigate('Create');
            }}
          />
        </Box>
      </Box>
      <Box flex={0.75}>
        <Text variant="body" fontWeight="bold" padding="m" paddingBottom="s">
          Choose your default model
        </Text>
        <Box padding="s" flex={1}>
          <FlatList
            data={models}
            numColumns={2}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <Model
                navigation={navigation}
                model={item}
                setSelectedModel={setSelectedModel}
                selectedModel={selectedModel}
              />
            )}
            showsVerticalScrollIndicator={false}
          />
        </Box>
        {selectedModel && ( // If a model is selected, show their name
          <Box
            margin="s"
            marginTop="none"
            padding="m"
            borderWidth={1}
            borderRadius={10}
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
        )}
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
      <Box
        flex={1}
        marginBottom="s"
        marginLeft={parseInt(model.id) % 2 === 0 ? 's' : 'none'}
        borderRadius={10}
      >
        <ExpoImage
          style={{
            width: '100%',
            height: 256,
            borderRadius: 10,
            borderWidth: selectedModel.id === model.id ? 3 : 0,
          }}
          source={model.imageUrl}
        />
      </Box>
    </TouchableOpacity>
  );
}
