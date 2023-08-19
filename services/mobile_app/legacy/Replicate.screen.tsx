import Ionicons from '@expo/vector-icons/Ionicons';
import React, { useState, useEffect } from 'react';
import { Text, TextInput, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Replicate from 'replicate';
import Constants from 'expo-constants';

import { Box } from '../styling/RestylePrimitives';

const replicate = new Replicate({
  auth: Constants?.expoConfig?.extra?.replicateApiKey,
});

const defaultImage =
  'https://i0.wp.com/roadmap-tech.com/wp-content/uploads/2019/04/placeholder-image.jpg?resize=400%2C400&ssl=1';

export default function Testing() {
  const [prompt, setPrompt] = useState('');
  const [imageURL, setImageURL] = useState(defaultImage);
  const [loading, setLoading] = useState(false);
  const [model, setModel] = useState<`${string}/${string}:${string}`>(
    'stability-ai/stable-diffusion:db21e45d3f7023abc2a46ee38a23973f6dce16bb082a930b0c49861f96d1e5bf'
  );

  const fetchGeneratedImage = async (prompt: string) => {
    setLoading(true);
    // await new Promise((res) => setTimeout(res, 2000));
    const input = {
      prompt:
        'an astronaut riding a horse on mars, hd, dramatic lighting, detailed',
    };
    const output = (await replicate.run(model, { input })) as string[];

    console.log(output);

    setImageURL(output[0]);
    setLoading(false);
  };

  return (
    <Box justifyContent="center" alignItems="center" flex={1} gap="xs">
      <Box
        height="90%"
        width="100%"
        justifyContent="center"
        alignItems="center"
      >
        {loading ? (
          <Text>Loading...</Text>
        ) : (
          <Image
            source={{ uri: imageURL }}
            style={{ width: '100%', height: '100%' }}
          />
        )}
      </Box>
      <Box flexDirection="row" alignItems="center" gap="s" padding="m">
        <TextInput
          value={prompt}
          onChangeText={setPrompt}
          onSubmitEditing={() => fetchGeneratedImage(prompt)}
          placeholder="Enter prompt"
          style={{
            borderWidth: 1,
            borderColor: 'grey',
            padding: 10,
            flex: 1,
          }}
        />
        <Ionicons
          name="refresh"
          size={24}
          color="black"
          onPress={() => setImageURL(defaultImage)}
        />
        <Ionicons
          name="arrow-forward"
          size={24}
          color="black"
          onPress={() => fetchGeneratedImage(prompt)}
        />
      </Box>
    </Box>
  );
}
