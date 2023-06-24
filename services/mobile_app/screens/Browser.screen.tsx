import { Dimensions, SafeAreaView } from 'react-native';
import { WebView } from 'react-native-webview';
import { useRef, useState } from 'react';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
  LightSpeedInLeft,
  LightSpeedOutRight,
  useAnimatedReaction,
  FadeIn,
  FadeOut,
  ZoomIn,
} from 'react-native-reanimated';
import { Image as ExpoImage } from 'expo-image';
import Ionicons from '@expo/vector-icons/Ionicons';
import { theme } from '../styling/theme';
import { Box } from '../styling/Box';
import { Text } from '../styling/Text';
import { TextInput } from '../styling/TextInput';
import { Button } from '../components/Button';
import { jsScripts } from '../utils/scripts';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

// The minimum and maximum heights for our bottom sheet
const MIN_HEIGHT = 0;
const MEDIUM_HEIGHT = 300;
const MAX_HEIGHT = SCREEN_HEIGHT - 115;

type Product = {
  name: string;
  brand: string;
  price: string;
  currency: string;
  images?: string[];
};

export default function Browser({
  navigation,
  route,
}: {
  navigation: any;
  route: any;
}) {
  const [url, setUrl] = useState(`https://${route.params.url}`);
  const [search, setSearch] = useState(`${route.params.url}`);
  const [expandedMenu, setExpandedMenu] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product>({
    name: 'RAK BLAZER',
    brand: 'Zara',
    price: '599',
    currency: 'SEK',
  });

  const webviewRef = useRef<WebView>(null);
  const bottomSheetHeight = useSharedValue(0);

  console.log('url', url);

  const handleSearch = () => {
    console.log('searching for', search);
    let finalUrl = search;
    if (!search.startsWith('http://') && !search.startsWith('https://')) {
      finalUrl = 'http://' + search;
    }

    setUrl(finalUrl);
  };

  const navigate = (direction: 'back' | 'forward' | 'reload') => {
    if (!webviewRef.current) return;

    if (direction === 'back') {
      webviewRef.current.goBack();
    } else if (direction === 'forward') {
      webviewRef.current.goForward();
    } else if (direction === 'reload') {
      webviewRef.current.reload();
    }
  };

  const handleNavigationStateChange = (navState: any) => {
    console.log('NAV CHANGE! navState:', navState);
    if (!navState.loading && webviewRef.current) {
      // we are using var instead of let/const because of a console error

      let match = url.match(/https?:\/\/(?:www\.)?(\w+)\./);
      if (match && match[1]) {
        let domain = match[1];

        let script = jsScripts[domain];

        // Very hacky solution
        // in the future, throw away the scripts and write something more robust
        setTimeout(() => {
          if (webviewRef.current) {
            webviewRef.current.injectJavaScript(script.interact);
            webviewRef.current.injectJavaScript(script.extract);
          }
        }, 1000);
        setTimeout(() => {
          if (webviewRef.current) {
            webviewRef.current.injectJavaScript(script.interact);
          }
        }, 1500);
      }
    }
  };

  const handleMessage = (event: any) => {
    console.log('received data:', event.nativeEvent.data);
    // message 1: product data
    const parsedData = JSON.parse(event.nativeEvent.data);
    if (parsedData.type === 'product') {
      const product: Product = parsedData.data;
      if (product?.images) {
        // remove query parameters from images
        for (let i = 0; i < product.images.length; i++) {
          product.images[i] = product.images[i].substring(
            0,
            product.images[i].indexOf('?')
          );
        }
      }
      setCurrentProduct(product);
    } else if (parsedData.type === 'imageSrc') {
      const imageSrc: string = parsedData.data;
      setCurrentProduct((prev) => ({ ...prev, images: [imageSrc] }));
    } else {
      console.log('unknown message type:', parsedData.data);
    }
  };

  const handleLikeProduct = () => {
    console.log('liked product:', currentProduct);
  };

  // need a mutation that checks (by url) if the product is already liked

  return (
    <Box backgroundColor="background" flex={1}>
      <SafeAreaView style={{ flex: 1 }}>
        <Box flex={1}>
          <SearchBar
            setSearch={setSearch}
            search={search}
            handleSearch={handleSearch}
            webviewNavigation={navigate}
            navigation={navigation}
          />
          <Box flex={1}>
            <WebView
              ref={webviewRef}
              startInLoadingState={true} // https://github.com/react-native-webview/react-native-webview/issues/124
              source={{
                uri: url,
              }}
              onNavigationStateChange={handleNavigationStateChange}
              onMessage={handleMessage}
            />
          </Box>
          <BottomSheet
            bottomSheetHeight={bottomSheetHeight}
            setExpandedMenu={setExpandedMenu}
            currentProduct={currentProduct}
          />
          <NavBar
            bottomSheetHeight={bottomSheetHeight}
            expandedMenu={expandedMenu}
            setExpandedMenu={setExpandedMenu}
            navigate={navigate}
            handleLikeProduct={handleLikeProduct}
          />
        </Box>
      </SafeAreaView>
    </Box>
  );
}

type SearchBarProps = {
  setSearch: (search: string) => void;
  search: string;
  handleSearch: () => void;
  navigation: any;
  webviewNavigation: (direction: 'back' | 'forward' | 'reload') => void;
};

function SearchBar({
  setSearch,
  search,
  handleSearch,
  navigation,
  webviewNavigation,
}: SearchBarProps) {
  return (
    <Box
      flex={0}
      flexDirection="row"
      alignItems="center"
      gap="s"
      paddingBottom="s"
      paddingHorizontal="m"
    >
      <Box
        flex={1}
        backgroundColor="grey"
        borderRadius={20}
        flexDirection="row"
        alignItems="center"
        paddingHorizontal="m"
        paddingVertical="xxs"
      >
        <TextInput
          onChangeText={setSearch}
          value={search}
          autoCapitalize="none"
          autoComplete="off"
          autoCorrect={false}
          inputMode="url"
          variant="primary"
          onSubmitEditing={handleSearch}
          selectTextOnFocus={true}
        />
        <Ionicons
          name="refresh"
          flex={0}
          size={24}
          color="black"
          onPress={() => webviewNavigation('reload')}
        />
      </Box>
      <Box flex={0} backgroundColor="grey" borderRadius={20} padding="xs">
        <Ionicons
          name="close"
          flex={0}
          size={24}
          color="black"
          onPress={() => navigation.goBack()}
        />
      </Box>
    </Box>
  );
}

type NavBarProps = {
  bottomSheetHeight: Animated.SharedValue<number>;
  expandedMenu: boolean;
  setExpandedMenu: (expanded: boolean) => void;
  navigate: (direction: 'back' | 'forward') => void;
  handleLikeProduct: () => void;
};

function NavBar({
  bottomSheetHeight,
  expandedMenu,
  setExpandedMenu,
  navigate,
  handleLikeProduct,
}: NavBarProps) {
  return (
    <Box
      flex={0}
      borderWidth={0}
      flexDirection="row"
      paddingVertical="s"
      paddingHorizontal="m"
      marginTop="s"
      justifyContent="space-between"
      backgroundColor="background"
      zIndex={100}
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
        {expandedMenu ? (
          <Ionicons
            name="close-circle"
            size={28}
            color="black"
            onPress={() => {
              setExpandedMenu(false);
              bottomSheetHeight.value = withTiming(MIN_HEIGHT);
            }}
          />
        ) : (
          <Ionicons
            name="arrow-up-circle"
            size={28}
            color="black"
            onPress={() => {
              setExpandedMenu(true);
              bottomSheetHeight.value = withTiming(MEDIUM_HEIGHT);
            }}
          />
        )}
      </Box>
      <Box flex={0} flexDirection="row" gap="m" alignItems="center">
        <Ionicons
          name="heart-outline"
          size={24}
          color="black"
          onPress={handleLikeProduct}
        />
        <Ionicons name="md-ellipsis-horizontal-sharp" size={24} color="black" />
      </Box>
    </Box>
  );
}

type BottomSheetProps = {
  bottomSheetHeight: Animated.SharedValue<number>;
  setExpandedMenu: (expanded: boolean) => void;
  currentProduct: Product;
};

function BottomSheet({
  bottomSheetHeight,
  setExpandedMenu,
  currentProduct,
}: BottomSheetProps) {
  const [sheetState, setSheetState] = useState<'MIN' | 'MEDIUM' | 'MAX'>('MIN');
  const [generating, setGenerating] = useState(false);
  const start = useSharedValue(0);

  const handleGenerate = async () => {
    const sleep = (ms: number) => {
      return new Promise((resolve) => setTimeout(resolve, ms));
    };
    setGenerating(true);

    console.log('generating image(s)');
    await sleep(3000);
    console.log('done generating image(s)');
    setGenerating(false);
    bottomSheetHeight.value = withTiming(MAX_HEIGHT);
  };

  const animatedStyleOuter = useAnimatedStyle(() => {
    return {
      height: bottomSheetHeight.value,
    };
  });

  const gesture = Gesture.Pan()
    .onBegin(() => {
      start.value = bottomSheetHeight.value;
    })
    .onUpdate((e) => {
      if (start.value === MAX_HEIGHT) {
        // bottomSheetHeight.value = MAX_HEIGHT - e.translationY;
      } else if (start.value === MEDIUM_HEIGHT) {
        if (e.translationY > 0) {
          bottomSheetHeight.value = MEDIUM_HEIGHT - e.translationY;
        }
      }
    })
    .onEnd((e) => {
      if (start.value === MAX_HEIGHT) {
        if (e.translationY > 150) {
          // bottomSheetHeight.value = withTiming(MIN_HEIGHT);
          // runOnJS(setExpandedMenu)(false);
        } else if (e.translationY > 50) {
          // bottomSheetHeight.value = withTiming(MEDIUM_HEIGHT);
        } else {
          // bottomSheetHeight.value = withTiming(MAX_HEIGHT);
        }
      } else if (start.value === MEDIUM_HEIGHT) {
        if (e.translationY > 50) {
          bottomSheetHeight.value = withTiming(MIN_HEIGHT);
          runOnJS(setExpandedMenu)(false);
        } else if (e.translationY < -50) {
          // bottomSheetHeight.value = withTiming(MAX_HEIGHT);
        } else {
          bottomSheetHeight.value = withTiming(MEDIUM_HEIGHT);
        }
      }
    })
    .onFinalize(() => {});

  useAnimatedReaction(
    () => bottomSheetHeight.value,
    (height) => {
      if (height === MAX_HEIGHT) {
        runOnJS(setSheetState)('MAX');
      } else if (height === MEDIUM_HEIGHT) {
        runOnJS(setSheetState)('MEDIUM');
      } else {
        runOnJS(setSheetState)('MIN');
      }
    }
  );

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View
        style={[
          {
            backgroundColor: 'white',
            position: 'absolute',
            bottom: 45,
            left: 0,
            right: 0,
          },
          animatedStyleOuter,
        ]}
      >
        <Box
          height={5}
          width={40}
          backgroundColor="grey"
          borderRadius={2.5}
          alignSelf="center"
          margin="m"
        ></Box>
        {(sheetState === 'MEDIUM' || sheetState === 'MIN') && (
          <Animated.View
            style={[
              {
                flex: 1,
                flexDirection: 'row',
                paddingHorizontal: theme.spacing.m,
                paddingVertical: theme.spacing.l,
                justifyContent: 'space-between',
              },
            ]}
            // entering={LightSpeedInLeft}
            exiting={FadeOut.duration(500)}
          >
            <Box flex={1}>
              <ExpoImage
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: 200,
                }}
                source={currentProduct.images ? currentProduct.images[0] : ''}
                contentFit="contain"
              />
            </Box>
            <Box flex={1} gap="s">
              <Text variant="body" fontWeight="bold">
                {currentProduct.name}
              </Text>
              <Text variant="body">{currentProduct.brand}</Text>

              <Text variant="body">{`${currentProduct.price} ${currentProduct.currency}`}</Text>
              {generating ? (
                <Button
                  label="Generating..."
                  variant="tertiary"
                  fontSize={14}
                  color="textOnBackground"
                ></Button>
              ) : (
                <Button
                  label="Generate"
                  onPress={handleGenerate}
                  variant="tertiary"
                  fontSize={14}
                  color="textOnBackground"
                ></Button>
              )}
            </Box>
          </Animated.View>
        )}
        {sheetState === 'MAX' && (
          <Animated.View
            style={[
              {
                flex: 1,
                flexDirection: 'column',
                paddingHorizontal: theme.spacing.m,
                paddingVertical: theme.spacing.l,
                justifyContent: 'space-between',
                gap: theme.spacing.m,
              },
            ]}
            entering={ZoomIn.duration(100)}
            exiting={LightSpeedOutRight.duration(500)}
          >
            <Box flex={1}>
              <ExpoImage
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '100%',
                }}
                source={require('../assets/res4-1.png')}
                contentFit="contain"
              />
            </Box>
            <Box flex={0} gap="m">
              <Box gap="s">
                <Text fontWeight="bold">KORREN - Kofta</Text>
                <Text variant="body">Tiger of Sweden</Text>
                <Text variant="body">2 995.00kr</Text>
              </Box>
              <Button
                label="Add to cart"
                variant="tertiary"
                fontSize={14}
                color="textOnBackground"
                paddingVertical="s"
              ></Button>
            </Box>
          </Animated.View>
        )}
      </Animated.View>
    </GestureDetector>
  );
}
