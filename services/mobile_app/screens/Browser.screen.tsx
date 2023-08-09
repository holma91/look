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
import { BottomSheetModal, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import * as Haptics from 'expo-haptics';

import { useQuery } from '@tanstack/react-query';
import { Image as ExpoImage } from 'expo-image';
import { useUser } from '@clerk/clerk-expo';
import { Box } from '../styling/Box';
import { Text } from '../styling/Text';
import {
  baseExtractScript,
  baseImageExtractScript,
  baseInteractScript,
  extractScriptV2,
  freezeScript,
  unFreezeScript,
} from '../utils/scripts';
import { fetchProducts } from '../api';
import { Company, Product, UserProduct } from '../utils/types';
import { WebviewSearchBar } from '../components/SearchBar';
import { TrainingContext } from '../context/Training';
import SearchList from '../components/SearchList';
import { saveHistory } from '../utils/history';
import { useLikeProductMutation } from '../hooks/useLikeProductMutation';
import { PrimaryButton } from '../components/Button';
import ThemedIcon from '../components/ThemedIcon';
import { useTheme } from '@shopify/restyle';
import { Theme } from '../styling/theme';
import { HoldItem } from 'react-native-hold-menu';
import { parseProductData } from '../utils/parsing';
import Animated from 'react-native-reanimated';

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

function arraysAreEqual(arr1: string[], arr2: string[]) {
  if (arr1.length !== arr2.length) return false;

  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) return false;
  }

  return true;
}

const defaultImage =
  'https://i0.wp.com/roadmap-tech.com/wp-content/uploads/2019/04/placeholder-image.jpg?resize=400%2C400&ssl=1';

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
  const [currentProduct, setCurrentProduct] = useState<Product>(
    route.params?.product || {
      url: '',
      name: '',
      brand: '',
      price: '',
      currency: '',
      images: [],
    }
  );
  const [selectMode, setSelectMode] = useState(false);
  const { user } = useUser();

  const url = getUrl(route.params.url);

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

  const navigateToSite = async (company: Company) => {
    await saveHistory(company.id);
    const domain = company.domains[0];
    navigation.navigate('Browser', { url: domain });
  };

  const injectScripts = () => {
    // keep injecting here, 10s should be enough for all sites (not really but currently it's fine)
    webviewRef?.current?.injectJavaScript(extractScriptV2);
    setTimeout(() => {
      webviewRef?.current?.injectJavaScript(extractScriptV2);
    }, 1000);
    setTimeout(() => {
      webviewRef?.current?.injectJavaScript(extractScriptV2);
    }, 2500);
    setTimeout(() => {
      webviewRef?.current?.injectJavaScript(extractScriptV2);
    }, 5000);
    setTimeout(() => {
      webviewRef?.current?.injectJavaScript(extractScriptV2);
    }, 7500);
    setTimeout(() => {
      webviewRef?.current?.injectJavaScript(extractScriptV2);
    }, 10000);
  };

  const handleLoadEnd = (navState: any) => {
    if (route.params?.baseProductUrl) {
      if (navState.nativeEvent.url === route.params.baseProductUrl) {
        return;
      }
    }

    // 1. inject
    injectScripts();
  };

  const handle = async (event: any) => {
    // 2. receive
    const data = JSON.parse(event.nativeEvent.data);

    if (data.type === 'product') {
      const product = parseProductData(
        event.nativeEvent.url,
        event.nativeEvent.data
      );
      // so, if url differs, then the images ALSO need to differ
      if (currentProduct.url !== product.url) {
        if (!arraysAreEqual(currentProduct.images, product.images)) {
          // PROTECTING FROM CORRUPT IMG-URL COMBOS
          console.log('images differ');
          console.log('newProduct', product);
          setCurrentProduct(product);

          // 3. save
        } else {
          console.log('images do not differ');
        }
      } else {
        // this is a refresh
        setCurrentProduct(product);
      }
    } else if (data.type === 'no product') {
      console.log('no product');
      if (currentProduct.url !== '') {
        setCurrentProduct({
          url: '',
          name: '',
          brand: '',
          price: '',
          currency: '',
          images: [],
        });
      }
    } else {
      console.log('unknown message type:', data.type, data.data);
    }
  };

  const handleToggleSelectMode = () => {
    if (!selectMode) {
      console.log('injecting le freeze');
      webviewRef?.current?.injectJavaScript(freezeScript);
    } else {
      console.log('injecting le unfreeze');
      webviewRef?.current?.injectJavaScript(unFreezeScript);
    }
    setSelectMode(!selectMode);
  };

  const { data: products, refetch: refetchProducts } = useQuery({
    queryKey: ['products', user?.id, { list: ['history'] }],
    queryFn: () => fetchProducts(user?.id as string, { list: ['history'] }),
    enabled: !!user?.id,
  });

  return (
    <Box backgroundColor="background" flex={1}>
      <SafeAreaView style={{ flex: 1 }}>
        <Box flex={1}>
          {selectMode ? (
            <Box
              alignContent="center"
              justifyContent="center"
              paddingTop="s"
              paddingBottom="sm"
            >
              <Text textAlign="center" variant="title">
                SELECT MODE
              </Text>
            </Box>
          ) : (
            <WebviewSearchBar
              navigation={navigation}
              webviewNavigation={navigate}
              searchText={searchText}
              setSearchText={setSearchText}
              handleSearch={() => {}}
              setFocus={setFocus}
              focus={focus}
            />
          )}
          <Box flex={1}>
            {focus ? (
              <Box flex={1}>
                <SearchList
                  navigateToSite={navigateToSite}
                  searchText={searchText}
                  setFocus={setFocus}
                />
              </Box>
            ) : null}
            <Box flex={focus ? 0 : 1}>
              <WebView
                ref={webviewRef}
                startInLoadingState={true} // https://github.com/react-native-webview/react-native-webview/issues/124
                source={{
                  uri: url,
                }}
                onLoadEnd={handleLoadEnd}
                onMessage={handle}
                mediaPlaybackRequiresUserAction={true}
                originWhitelist={['*']}
              />
            </Box>
          </Box>
        </Box>
      </SafeAreaView>
      <NavBar
        expandedMenu={expandedMenu}
        setExpandedMenu={setExpandedMenu}
        navigate={navigate}
        currentProduct={currentProduct}
        setCurrentProduct={setCurrentProduct}
        products={products || []}
        selectMode={selectMode}
        handleToggleSelectMode={handleToggleSelectMode}
      />
    </Box>
  );
}

type NavBarProps = {
  expandedMenu: boolean;
  setExpandedMenu: React.Dispatch<React.SetStateAction<boolean>>;
  navigate: (direction: 'back' | 'forward') => void;
  currentProduct: Product;
  setCurrentProduct: React.Dispatch<React.SetStateAction<Product>>;
  products: UserProduct[];
  selectMode: boolean;
  handleToggleSelectMode: () => void;
};

function NavBar({
  expandedMenu,
  setExpandedMenu,
  navigate,
  currentProduct,
  setCurrentProduct,
  products,
  selectMode,
  handleToggleSelectMode,
}: NavBarProps) {
  const likeProductMutation = useLikeProductMutation({ list: ['history'] });

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
          <TouchableOpacity onPress={() => navigate('back')}>
            <ThemedIcon name="arrow-back" size={28} color="text" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigate('forward')}>
            <ThemedIcon name="arrow-forward" size={28} color="text" />
          </TouchableOpacity>
        </Box>
        <Box flex={0} flexDirection="row" alignItems="center">
          {expandedMenu ? (
            <TouchableOpacity
              onPress={() => {
                setExpandedMenu(false);
                handleDismissModalPress();
              }}
            >
              <ThemedIcon name="close-circle" size={26} color="text" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => {
                setExpandedMenu(true);
                handlePresentModalPress();
              }}
            >
              <ThemedIcon name="arrow-up-circle" size={26} color="text" />
            </TouchableOpacity>
          )}
        </Box>
        <Box flex={0} flexDirection="row" gap="m" alignItems="center">
          <TouchableOpacity
            onPress={() => {
              console.log('like mutation', activeProduct);
              if (activeProduct) {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                likeProductMutation.mutate(activeProduct);
              }
            }}
          >
            <ThemedIcon name={icon} size={24} color="text" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleToggleSelectMode}>
            <ThemedIcon
              name={selectMode ? 'create' : 'create-outline'}
              size={24}
              style={{ paddingBottom: 3 }}
            />
          </TouchableOpacity>
        </Box>
      </Box>
      <BottomSheet
        bottomSheetModalRef={bottomSheetModalRef}
        setExpandedMenu={setExpandedMenu}
        currentProduct={currentProduct}
        setCurrentProduct={setCurrentProduct}
        products={products}
        selectMode={selectMode}
      />
    </Box>
  );
}

type BottomSheetModalProps = {
  bottomSheetModalRef: React.RefObject<BottomSheetModal>;
  setExpandedMenu: React.Dispatch<React.SetStateAction<boolean>>;
  currentProduct: Product;
  setCurrentProduct: React.Dispatch<React.SetStateAction<Product>>;
  products: UserProduct[];
  selectMode: boolean;
};

const BottomSheet = ({
  bottomSheetModalRef,
  setExpandedMenu,
  currentProduct,
  setCurrentProduct,
  products,
  selectMode,
}: BottomSheetModalProps) => {
  const theme = useTheme<Theme>();
  const [expandedContent, setExpandedContent] = useState(false);
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

  return (
    <BottomSheetModal
      style={{}}
      backgroundStyle={{
        backgroundColor: theme.colors.background,
      }}
      ref={bottomSheetModalRef}
      index={0}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
      backdropComponent={(props) => (
        <CustomBackdrop
          {...props}
          dismiss={() => bottomSheetModalRef.current?.dismiss()}
        />
      )}
      handleIndicatorStyle={{
        backgroundColor: theme.colors.text,
      }}
      bottomInset={86}
    >
      <BottomSheetContent
        currentProduct={currentProduct}
        expandedContent={expandedContent}
        products={products}
        setCurrentProduct={setCurrentProduct}
        selectMode={selectMode}
      />
    </BottomSheetModal>
  );
};

type BottomSheetContentProps = {
  currentProduct: Product;
  expandedContent: boolean;
  products: UserProduct[];
  setCurrentProduct: React.Dispatch<React.SetStateAction<Product>>;
  selectMode: boolean;
};

const BottomSheetContent = ({
  currentProduct,
  setCurrentProduct,
  expandedContent,
  products,
  selectMode,
}: BottomSheetContentProps) => {
  const theme = useTheme<Theme>();
  const { activeModel, setActiveModel } = useContext(TrainingContext);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);

  const handleTestOnModel = async () => {
    console.log('test on model');
  };

  const handleRemoveImage = (image: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    console.log('remove image:', image);
    const newImages = currentProduct.images.filter((img) => img !== image);
    setCurrentProduct({ ...currentProduct, images: newImages });
    setCurrentImageIndex(0);
  };

  const img = currentProduct.images[currentImageIndex];

  if (currentProduct.url === '') {
    return (
      <Box justifyContent="center" alignItems="center" marginTop="l" gap="m">
        <Text variant="title">We can't find a product!</Text>
        <Text>Go to a product page, and you'll see it right here. </Text>
        <Text>Or, you can go to some of your earlier viewed products:</Text>
        <FlatList
          style={{ gap: 10, marginTop: 20 }}
          horizontal
          showsHorizontalScrollIndicator={false}
          data={products.slice().reverse()}
          contentContainerStyle={{ paddingLeft: 5 }}
          keyExtractor={(item, index) => `category-${index}`}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => {}}
              style={{
                marginRight: 6,
              }}
            >
              <ExpoImage
                style={{
                  height: 125,
                  width: 90,
                }}
                source={item.images[0]}
                contentFit="cover"
              />
            </TouchableOpacity>
          )}
        />
      </Box>
    );
  }

  if (expandedContent) {
    return (
      <Box
        margin="m"
        marginBottom="l"
        flexDirection="column"
        justifyContent="space-between"
        gap="m"
        flex={1}
        backgroundColor="background"
      >
        <Box flex={1} borderWidth={0}>
          <ExpoImage
            style={{
              width: '100%',
              height: '100%',
            }}
            source={img ? img : defaultImage}
            contentFit="cover"
          />
        </Box>
        <Box flex={0} justifyContent="space-between" gap="m" marginVertical="m">
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
            <PrimaryButton label="Test on model" onPress={() => {}} />
            {/* <Button onPress={() => {}} variant="primary" backgroundColor="text">
              <Text color="background" fontWeight="600" fontSize={15}>
                {`Test on model`}
              </Text>
            </Button> */}
          </Box>
        </Box>
      </Box>
    );
  } else {
    return (
      <Box margin="m" gap="l">
        <Box flexDirection="row" justifyContent="space-between" gap="m">
          <Box flex={1} position="relative">
            <ExpoImage
              style={{
                aspectRatio: 0.75,
              }}
              source={img ? img : defaultImage}
              contentFit="cover"
            />
            {img && selectMode ? (
              <TouchableOpacity
                style={{
                  position: 'absolute',
                  top: 10,
                  right: 10,
                  backgroundColor: 'rgba(150,150,150,0.6)',
                  padding: 2,
                  borderRadius: 5,
                }}
                onPress={() => handleRemoveImage(img)}
              >
                <ThemedIcon name="close" size={20} color="background" />
              </TouchableOpacity>
            ) : null}
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
                renderItem={({ item, index }) => (
                  <Box position="relative">
                    <TouchableOpacity
                      onPress={() => {
                        setCurrentImageIndex(index);
                      }}
                      style={{
                        marginRight: 6,
                      }}
                    >
                      <ExpoImage
                        style={{
                          height: 60,
                          width: 60,
                          borderWidth: item === img ? 2 : 0,
                          borderColor: theme.colors.text,
                        }}
                        source={item}
                        contentFit="cover"
                      />
                    </TouchableOpacity>
                  </Box>
                )}
              />
              {/* <Box
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
              </Box> */}
            </Box>
          </Box>
        </Box>
        <PrimaryButton label="Test on model" onPress={handleTestOnModel} />
      </Box>
    );
  }
};

type CustomBackdropProps = {
  animatedIndex: Animated.SharedValue<number>;
  dismiss: () => void;
};

const CustomBackdrop: React.FC<CustomBackdropProps> = ({
  animatedIndex,
  dismiss,
}) => {
  const theme = useTheme();

  return (
    <Animated.View
      onTouchStart={dismiss}
      style={{
        position: 'absolute',
        bottom: 86, // height of the NavBar
        left: 0,
        right: 0,
        top: 0,
        backgroundColor: theme.colors.backdropColor || 'rgba(0,0,0,0.5)',
        opacity: 1, // todo: make this animated
      }}
    />
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
