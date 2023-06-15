import {
  FlatList,
  Image,
  SafeAreaView,
  TextInput as TextInputRN,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { useRef, useState } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Theme } from '../styling/theme';
import { Box } from '../styling/Box';
import { Text } from '../styling/Text';
import {
  VariantProps,
  createRestyleComponent,
  createVariant,
} from '@shopify/restyle';

const TextInput = createRestyleComponent<
  VariantProps<Theme, 'inputVariants'> &
    React.ComponentProps<typeof TextInputRN>,
  Theme
>([createVariant({ themeKey: 'inputVariants' })], TextInputRN);

export default function Browse() {
  const [url, setUrl] = useState(
    'https://github.com/react-native-webview/react-native-webview'
  );
  const [search, setSearch] = useState('');

  const webviewRef = useRef<WebView>(null);

  const handleSearch = () => {
    console.log('searching for', search);
    let finalUrl = search;
    if (!search.startsWith('http://') && !search.startsWith('https://')) {
      finalUrl = 'http://' + search;
    }

    setUrl(finalUrl);
  };

  const navigate = (direction: 'back' | 'forward') => {
    if (!webviewRef.current) return;

    if (direction === 'back') {
      webviewRef.current.goBack();
    } else if (direction === 'forward') {
      webviewRef.current.goForward();
    }
  };

  return (
    <Box backgroundColor="background" flex={1}>
      <SafeAreaView style={{ flex: 1 }}>
        <Box flex={1} gap="s">
          <Box
            flex={0}
            flexDirection="row"
            alignItems="center"
            gap="s"
            paddingHorizontal="s"
          >
            <Box flex={1}>
              <TextInput
                onChangeText={setSearch}
                value={search}
                autoCapitalize="none"
                autoComplete="off"
                variant="primary"
                onSubmitEditing={handleSearch}
              />
            </Box>
            <Ionicons name="close" flex={0} size={28} color="black" />
          </Box>
          <Box flex={1}>
            <WebView
              ref={webviewRef}
              source={{
                uri: url,
              }}
            />
          </Box>
          <Box
            flex={0}
            borderWidth={0}
            flexDirection="row"
            padding="s"
            justifyContent="space-between"
          >
            <Box flex={0} flexDirection="row" gap="m" alignItems="center">
              <Ionicons
                name="arrow-back"
                size={28}
                color="black"
                onPress={() => navigate('back')}
              />
              <Ionicons
                name="arrow-forward"
                size={28}
                color="black"
                onPress={() => navigate('forward')}
              />
            </Box>
            <Box flex={0} flexDirection="row" alignItems="center">
              <Ionicons name="arrow-up-circle" size={28} color="black" />
            </Box>
            <Box flex={0} flexDirection="row" gap="m" alignItems="center">
              <Ionicons name="md-star-outline" size={24} color="black" />
              <Ionicons
                name="md-ellipsis-horizontal-sharp"
                size={24}
                color="black"
              />
            </Box>
          </Box>
        </Box>
      </SafeAreaView>
    </Box>
  );
}
