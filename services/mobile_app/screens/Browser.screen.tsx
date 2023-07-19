import {
  SafeAreaView,
  LayoutAnimation,
  TouchableOpacity,
  FlatList,
  View,
} from 'react-native';
import { WebView } from 'react-native-webview';
import React, {
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  BottomSheetModal,
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetFlatList,
} from '@gorhom/bottom-sheet';
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { Image as ExpoImage } from 'expo-image';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useUser } from '@clerk/clerk-expo';
import { WebViewBox } from '../components/WebViewBox';
import { Box } from '../styling/Box';
import { Text } from '../styling/Text';
import { Button } from '../components/Buttons';
import {
  baseExtractScript,
  baseInteractScript,
  newBaseExtractScript,
  newBaseExtractScript2,
} from '../utils/scripts';
import {
  fetchCompanies,
  fetchProducts,
  likeProduct,
  unlikeProduct,
} from '../api';
import { Product, UserProduct } from '../utils/types';
import { WebviewSearchBar } from '../components/SearchBar';
import { TrainingContext } from '../context/Training';
import SearchList from '../components/SearchList';

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
  if (urlParam === 'gucci.com') {
    return 'https://www.gucci.com';
  } else if (
    urlParam.startsWith('http://') ||
    urlParam.startsWith('https://')
  ) {
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
  const [searchText, setSearchText] = useState('');
  const [focus, setFocus] = useState(false);
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

  const url = getUrl(route.params.url);
  console.log('url:', url);

  const domain = getDomain(route.params.url);

  const { user } = useUser();

  const webviewRef = useRef<WebView>(null);

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
    // console.log('handleLoadEnd:', navState.nativeEvent);
    if (!webviewRef.current) return;

    webviewRef.current.injectJavaScript(newBaseExtractScript2);
    // webviewRef.current.injectJavaScript(baseInteractScript);
  };

  const { data: products, refetch: refetchProducts } = useQuery({
    queryKey: ['products', user?.id],
    queryFn: () => fetchProducts(user?.id as string, { view: ['history'] }),
    enabled: !!user?.id,
  });

  return (
    <Box backgroundColor="background" flex={1}>
      <SafeAreaView style={{ flex: 1 }}>
        <Box flex={1}>
          <WebviewSearchBar
            navigation={navigation}
            webviewNavigation={navigate}
            searchText={searchText}
            setSearchText={setSearchText}
            handleSearch={() => {}}
            setFocus={setFocus}
            focus={focus}
          />
          <Box flex={1}>
            {focus ? (
              <Box flex={1}>
                <SearchList
                  navigation={navigation}
                  searchText={searchText}
                  setFocus={setFocus}
                />
              </Box>
            ) : null}
            <Box flex={focus ? 0 : 1}>
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
          </Box>
        </Box>
      </SafeAreaView>
      <NavBar
        expandedMenu={expandedMenu}
        setExpandedMenu={setExpandedMenu}
        navigate={navigate}
        user={user}
        currentProduct={currentProduct}
        currentImage={currentImage}
        setCurrentImage={setCurrentImage}
        products={products || []}
      />
    </Box>
  );
}

type NavBarProps = {
  expandedMenu: boolean;
  setExpandedMenu: React.Dispatch<React.SetStateAction<boolean>>;
  navigate: (direction: 'back' | 'forward') => void;
  user: any;
  currentProduct: Product;
  currentImage: string;
  setCurrentImage: React.Dispatch<React.SetStateAction<string>>;
  products: UserProduct[];
};

function NavBar({
  expandedMenu,
  setExpandedMenu,
  navigate,
  user,
  currentProduct,
  currentImage,
  setCurrentImage,
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
      console.log('onMutate', product);

      product.liked = !product.liked;
      await queryClient.cancelQueries(['products', user?.id]);
      const previousProducts = queryClient.getQueryData([
        'products',
        product.url,
      ]);
      queryClient.setQueryData(['products', product.url], product);

      return { previousProducts, product };
    },
    onError: (err, product, context) => {
      console.log('error', err, product, context);
      queryClient.setQueryData(
        ['products', context?.product.url],
        context?.previousProducts
      );
    },
    onSettled: async () => {
      queryClient.invalidateQueries({ queryKey: ['products', user?.id] });
    },
  });

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const handleDismissModalPress = useCallback(() => {
    bottomSheetModalRef.current?.dismiss();
  }, []);

  let icon: 'heart' | 'heart-outline' = products?.find(
    (product) => product.url === currentProduct?.url && product.liked
  )
    ? 'heart'
    : 'heart-outline';

  let activeProduct = products?.find((p) => p.url === currentProduct?.url);
  console.log('activeProduct', activeProduct);

  return (
    <Box zIndex={100}>
      <Box
        flex={0}
        borderWidth={0}
        flexDirection="row"
        paddingVertical="s"
        paddingHorizontal="m"
        marginTop="s"
        paddingBottom="xl"
        justifyContent="space-between"
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
              size={26}
              color="black"
              onPress={() => {
                setExpandedMenu(false);
                handleDismissModalPress();
              }}
            />
          ) : (
            <Ionicons
              name="arrow-up-circle"
              size={26}
              color="black"
              onPress={() => {
                setExpandedMenu(true);
                handlePresentModalPress();
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
          <Ionicons
            name="md-ellipsis-horizontal-sharp"
            size={24}
            color="black"
          />
        </Box>
      </Box>
      <BottomSheet
        bottomSheetModalRef={bottomSheetModalRef}
        setExpandedMenu={setExpandedMenu}
        currentProduct={currentProduct}
        currentImage={currentImage}
        setCurrentImage={setCurrentImage}
      />
    </Box>
  );
}

type BottomSheetModalProps = {
  bottomSheetModalRef: React.RefObject<BottomSheetModal>;
  setExpandedMenu: React.Dispatch<React.SetStateAction<boolean>>;
  currentProduct: Product;
  currentImage: string;
  setCurrentImage: React.Dispatch<React.SetStateAction<string>>;
};

const BottomSheet = ({
  bottomSheetModalRef,
  setExpandedMenu,
  currentProduct,
  currentImage,
  setCurrentImage,
}: BottomSheetModalProps) => {
  const [expandedContent, setExpandedContent] = useState(false);
  const { activeModel, setActiveModel } = useContext(TrainingContext);
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);
  const snapPoints = useMemo(() => ['46%', '100%'], []);

  const handleSheetChanges = useCallback((index: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    if (index === -1) {
      setExpandedContent(false);
      setExpandedMenu(false);
    } else if (index === 0) {
      setExpandedContent(false);
      setExpandedMenu(true);
    } else if (index === 1) {
      setExpandedContent(true);
      setExpandedMenu(true);
    }
  }, []);

  const handleTestOnModel = async () => {
    // change current image progressively, when at last image, snap to top
    setIsGenerating(true);
    for (let i = 0; i < demoImages['basic'].length; i++) {
      setCurrentImage(demoImages['basic'][i]);
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
    bottomSheetModalRef.current?.snapToIndex(1);
    setIsGenerating(false);
    setHasGenerated(true);
  };

  return (
    <BottomSheetModal
      style={{}}
      backgroundStyle={{}}
      bottomInset={85}
      ref={bottomSheetModalRef}
      index={0}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
      backdropComponent={(props) => (
        <BottomSheetBackdrop
          {...props}
          appearsOnIndex={0}
          disappearsOnIndex={-1}
          opacity={0}
        />
      )}
    >
      {expandedContent ? (
        <Box
          margin="m"
          marginBottom="l"
          flexDirection="column"
          justifyContent="space-between"
          gap="m"
          flex={1}
        >
          <Box flex={1} borderWidth={0}>
            {currentImage !== '' ? (
              <ExpoImage
                style={{
                  width: '100%',
                  height: '100%',
                }}
                source={currentImage}
                contentFit="cover"
              />
            ) : null}
          </Box>
          <Box
            flex={0}
            justifyContent="space-between"
            gap="m"
            marginVertical="m"
          >
            <Box
              padding="m"
              borderWidth={1}
              borderRadius={10}
              borderColor="text"
              flexDirection="row"
              justifyContent="space-between"
            >
              <Text variant="body" fontWeight="bold">
                Selected Model:
              </Text>
              <Text variant="body" fontWeight="bold">
                {activeModel.name}
              </Text>
            </Box>
            <Box flex={0}>
              <Button
                onPress={() => {}}
                variant="primary"
                backgroundColor="text"
              >
                <Text color="background" fontWeight="600" fontSize={15}>
                  {isGenerating
                    ? 'is generating...'
                    : hasGenerated
                    ? 'Share image'
                    : `Test on model`}
                </Text>
              </Button>
            </Box>
          </Box>
        </Box>
      ) : (
        <Box margin="m" gap="l">
          <Box flexDirection="row" justifyContent="space-between" gap="m">
            <Box flex={1}>
              {currentImage !== '' && (
                <ExpoImage
                  style={{
                    aspectRatio: 0.75, // todo: calculate this
                  }}
                  source={currentImage}
                  contentFit="cover"
                />
              )}
            </Box>
            <Box flex={1} justifyContent="space-between">
              <Box gap="s" flex={1}>
                <Text
                  variant="body"
                  fontWeight="bold"
                  fontSize={20}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {currentProduct.name}
                </Text>
                <Text variant="body" fontSize={17}>
                  {currentProduct.brand}
                </Text>

                <Text
                  variant="body"
                  fontSize={17}
                >{`${currentProduct.price} ${currentProduct.currency}`}</Text>
              </Box>

              <Box flex={0} gap="l">
                <FlatList
                  style={{ gap: 10, marginTop: 20 }}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  data={currentProduct.images}
                  contentContainerStyle={{ paddingLeft: 5 }}
                  keyExtractor={(item, index) => `category-${index}`}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      onPress={() => {
                        setCurrentImage(item);
                      }}
                      style={{
                        marginRight: 6,
                      }}
                    >
                      <ExpoImage
                        style={{
                          height: 50,
                          width: 50,
                          borderWidth: item === currentImage ? 2 : 0,
                        }}
                        source={item}
                        contentFit="cover"
                      />
                    </TouchableOpacity>
                  )}
                />
                <Box
                  flexDirection="row"
                  borderWidth={1}
                  padding="s"
                  paddingVertical="sm"
                  borderRadius={10}
                  alignItems="center"
                  justifyContent="center"
                  gap="xs"
                >
                  <Text variant="body" fontWeight="bold" fontSize={16}>
                    {activeModel.name}
                  </Text>
                  <Ionicons name="chevron-down" size={20} color="black" />
                </Box>
              </Box>
            </Box>
          </Box>
          <Button
            onPress={handleTestOnModel}
            variant="primary"
            backgroundColor="text"
          >
            <Text color="background" fontWeight="600" fontSize={15}>
              {isGenerating ? 'is generating...' : `Test on model`}
            </Text>
          </Button>
        </Box>
      )}
    </BottomSheetModal>
  );
};

const demoImages: { [key: string]: any } = {
  basic: [
    require('../assets/generations/demo/blackman/stepbystep/1.png'),
    require('../assets/generations/demo/blackman/stepbystep/2.png'),
    require('../assets/generations/demo/blackman/stepbystep/3.png'),
    require('../assets/generations/demo/blackman/stepbystep/4.png'),
    require('../assets/generations/demo/blackman/stepbystep/5.png'),
    require('../assets/generations/demo/blackman/stepbystep/6.png'),
    require('../assets/generations/demo/blackman/stepbystep/7.png'),
    require('../assets/generations/demo/blackman/stepbystep/8.png'),
    require('../assets/generations/demo/blackman/stepbystep/9.png'),
    require('../assets/generations/demo/blackman/stepbystep/10.png'),
    require('../assets/generations/demo/blackman/stepbystep/11.png'),
    require('../assets/generations/demo/blackman/stepbystep/12.png'),
    require('../assets/generations/demo/blackman/stepbystep/13.png'),
    require('../assets/generations/demo/blackman/stepbystep/14.png'),
    require('../assets/generations/demo/blackman/stepbystep/15.png'),
    require('../assets/generations/demo/blackman/stepbystep/20.png'),
    require('../assets/generations/demo/blackman/stepbystep/25.png'),
    require('../assets/generations/demo/blackman/stepbystep/30.png'),
  ],
  other: [
    require('../assets/generations/demo/kitchen.png'),
    require('../assets/generations/demo/park.png'),
    require('../assets/generations/demo/timessquare.png'),
    require('../assets/generations/demo/villa.png'),
  ],
};
