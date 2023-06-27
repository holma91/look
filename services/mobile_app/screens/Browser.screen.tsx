import { Dimensions } from 'react-native';
import { WebView } from 'react-native-webview';
import { useRef, useState } from 'react';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
  LightSpeedOutRight,
  useAnimatedReaction,
  FadeOut,
  ZoomIn,
} from 'react-native-reanimated';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { Image as ExpoImage } from 'expo-image';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useUser } from '@clerk/clerk-expo';
import { theme } from '../styling/theme';
import { WebViewBox } from '../components/WebViewBox';
import { Box } from '../styling/Box';
import { Text } from '../styling/Text';
import { Button } from '../components/Button';
import { baseExtractScript, baseInteractScript } from '../utils/scripts';
import { fetchHistory, likeProduct, unlikeProduct } from '../api';
import { Product, UserProduct } from '../utils/types';
import { BrowserSearchBar } from '../components/SearchBar';
import { connectors } from '../utils/connectors';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

// The minimum and maximum heights for our bottom sheet
const MIN_HEIGHT = 0;
const MEDIUM_HEIGHT = 300;
const MAX_HEIGHT = SCREEN_HEIGHT - 115;

function getDomain(url: string) {
  let domain;

  // find & remove protocol (http, ftp, etc.) and get domain
  if (url.indexOf('://') > -1) {
    domain = url.split('/')[2];
  } else {
    domain = url.split('/')[0];
  }

  // find & remove port number if present
  domain = domain.split(':')[0];

  // find & remove "www."
  if (domain.indexOf('www.') > -1) {
    domain = domain.split('www.')[1];
  }

  return domain;
}

function getUrl(urlParam: string) {
  if (urlParam.startsWith('http://') || urlParam.startsWith('https://')) {
    return urlParam;
  } else {
    return 'https://' + urlParam;
  }
}

export default function Browser({
  navigation,
  route,
}: {
  navigation: any;
  route: any;
}) {
  const [url, setUrl] = useState(getUrl(route.params.url));
  const [search, setSearch] = useState(`${route.params.url}`);
  const [expandedMenu, setExpandedMenu] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product>({
    url: 'https://www.zara.com/se/en/rak-blazer-p08068001.html?v1=78861699&v2=1718127',
    name: 'NAME',
    brand: 'BRAND',
    price: 'PRICE',
    currency: 'CURRENCY',
    images: [],
  });
  const [currentImage, setCurrentImage] = useState<string>('');

  const domain = getDomain(route.params.url);

  const { user } = useUser();

  const webviewRef = useRef<WebView>(null);
  const bottomSheetHeight = useSharedValue(0);

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

  const handleLoadEnd = (navState: any) => {
    console.log('handleLoadEnd:', navState.nativeEvent);
    if (!webviewRef.current) return;

    webviewRef.current.injectJavaScript(baseExtractScript);
    const slowSites = ['sellpy.se', 'softgoat.com', 'hm.com', 'zara.com'];
    if (slowSites.includes(domain)) {
      setTimeout(() => {
        if (webviewRef.current) {
          webviewRef.current.injectJavaScript(baseExtractScript);
          webviewRef.current.injectJavaScript(baseInteractScript);
        }
      }, 500);
    }
  };

  const { data: products, refetch: refetchProducts } = useQuery({
    queryKey: ['history', user?.id],
    queryFn: () => fetchHistory(user?.id as string),
    enabled: !!user?.id,
  });

  return (
    <Box backgroundColor="background" flex={1}>
      <Box flex={1}>
        <BrowserSearchBar
          setSearch={setSearch}
          search={search}
          handleSearch={handleSearch}
          webviewNavigation={navigate}
          navigation={navigation}
        />
        <Box flex={1}>
          <WebViewBox
            webviewRef={webviewRef}
            handleLoadEnd={handleLoadEnd}
            url={url}
            domain={domain}
            setCurrentProduct={setCurrentProduct}
            setCurrentImage={setCurrentImage}
            refetchProducts={refetchProducts}
          />
        </Box>
        <BottomSheet
          bottomSheetHeight={bottomSheetHeight}
          setExpandedMenu={setExpandedMenu}
          currentProduct={currentProduct}
          currentImage={currentImage}
        />
        <NavBar
          bottomSheetHeight={bottomSheetHeight}
          expandedMenu={expandedMenu}
          setExpandedMenu={setExpandedMenu}
          navigate={navigate}
          user={user}
          currentProduct={currentProduct}
          products={products}
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
  user: any;
  currentProduct: Product;
  products: UserProduct[];
};

function NavBar({
  bottomSheetHeight,
  expandedMenu,
  setExpandedMenu,
  navigate,
  user,
  currentProduct,
  products,
}: NavBarProps) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (product: UserProduct) => {
      !product.liked
        ? await unlikeProduct(user?.id, product.url)
        : await likeProduct(user?.id, product.url);
      return product;
    },
    onMutate: async (product: UserProduct) => {
      product.liked = !product.liked;
      await queryClient.cancelQueries(['history', user?.id]);
      const previousProducts = queryClient.getQueryData([
        'history',
        product.url,
      ]);
      queryClient.setQueryData(['history', product.url], product);

      return { previousProducts, product };
    },
    onError: (err, product, context) => {
      console.log('error', err, product, context);
      queryClient.setQueryData(
        ['history', context?.product.url],
        context?.previousProducts
      );
    },
    onSettled: async () => {
      queryClient.invalidateQueries({ queryKey: ['history', user?.id] });
    },
  });

  let icon: 'heart' | 'heart-outline' = products?.find(
    (product) => product.url === currentProduct?.url && product.liked
  )
    ? 'heart'
    : 'heart-outline';

  let activeProduct = products?.find((p) => p.url === currentProduct?.url);

  // console.log('activeProduct', activeProduct);

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
          name={icon}
          size={24}
          color="black"
          onPress={() => {
            if (activeProduct) {
              mutation.mutate(activeProduct);
            }
          }}
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
  currentImage: string;
};

function BottomSheet({
  bottomSheetHeight,
  setExpandedMenu,
  currentProduct,
  currentImage,
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
            exiting={FadeOut.duration(500)}
          >
            <Box flex={1}>
              {currentImage !== '' && (
                <ExpoImage
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: 200,
                  }}
                  source={currentImage}
                  contentFit="contain"
                />
              )}
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
