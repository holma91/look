import { FlatList, Image, SafeAreaView } from 'react-native';
import { WebView } from 'react-native-webview';
import { useState } from 'react';
import { Theme } from '../styling/theme';
import { Box } from '../styling/Box';
import { Text } from '../styling/Text';

export default function Browse() {
  const runFirst = `
      document.body.style.backgroundColor = 'red';
      setTimeout(function() { window.alert('hi') }, 2000);
      true; // note: this is required, or you'll sometimes get silent failures
    `;

  return (
    <Box backgroundColor="background" flex={1}>
      <SafeAreaView style={{ flex: 1 }}>
        <Box flex={1} paddingHorizontal="m" gap="s">
          <Text variant="header">Hey</Text>
          <Box
            flex={1}
            margin="m"
            borderWidth={2}
            borderRadius={10}
            borderColor="primary"
          >
            <WebView
              source={{
                uri: 'https://github.com/react-native-webview/react-native-webview',
              }}
              borderRadius={10}
              injectedJavaScript={runFirst}
            />
          </Box>
        </Box>
      </SafeAreaView>
    </Box>
  );
}
