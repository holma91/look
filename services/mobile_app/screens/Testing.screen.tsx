import { WebView } from 'react-native-webview';
import { Box } from '../styling/Box';
import { Text } from '../styling/Text';

export default function Testing() {
  const handleNavigationStateChange = (navState: any) => {
    // this will get called whenever ANY property of the navState changes.
    // console.log('handleNavigationStateChange:', navState);
  };

  const handleLoadStart = (navState: any) => {
    // console.log('handleLoadStart:', navState.nativeEvent);
  };

  const handleLoadEnd = (navState: any) => {
    console.log('handleLoadEnd:', navState.nativeEvent);
  };

  const handleLoad = (navState: any) => {
    // console.log('handleLoad:', navState.nativeEvent);
  };

  return (
    <Box flex={1}>
      <WebView
        source={{ uri: 'https://zalando.se/' }}
        style={{ flex: 1 }}
        onNavigationStateChange={handleNavigationStateChange}
        onLoadStart={handleLoadStart}
        onLoadEnd={handleLoadEnd}
        onLoad={handleLoad}
      />
    </Box>
  );
}

// https://www.zalando.se/gant-luxury-skjorta-light-pink-ga321e0du-j11.html
// https://www.zalando.se/gant-luxury-skjorta-light-pink-ga321e0du-j11.html
