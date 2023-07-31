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
import Ionicons from '@expo/vector-icons/Ionicons';
import { useUser } from '@clerk/clerk-expo';
import { WebViewBox } from '../components/WebViewBox';
import { Box } from '../styling/Box';
import { Text } from '../styling/Text';
import {
  baseExtractScript,
  baseImageExtractScript,
  baseInteractScript,
} from '../utils/scripts';
import { fetchProducts } from '../api';
import { Company, Product, UserProduct } from '../utils/types';
import { WebviewSearchBar } from '../components/SearchBar';
import { TrainingContext } from '../context/Training';
import SearchList from '../components/SearchList';
import { saveHistory } from '../utils/history';
import { useLikeMutation } from '../hooks/useLikeMutation';
import { PrimaryButton } from '../components/Button';

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
  const { user } = useUser();

  const url = getUrl(route.params.url);
  const domain = getDomain(route.params.url);

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

  const handleLoadEnd = (navState: any) => {
    // console.log('handleLoadEnd', navState.nativeEvent.url);

    if (!webviewRef.current) return;

    if (route.params?.baseProductUrl) {
      if (navState.nativeEvent.url === route.params.baseProductUrl) {
        return;
      }
    }

    // make decisions here based on the url
    webviewRef.current.injectJavaScript(baseExtractScript);
    webviewRef.current.injectJavaScript(baseInteractScript);

    // image extract should be used when the Image field in the schema.org is not enough
    webviewRef.current.injectJavaScript(baseImageExtractScript);
  };

  const { data: products, refetch: refetchProducts } = useQuery({
    queryKey: ['products', user?.id],
    queryFn: () => fetchProducts(user?.id as string, { list: ['history'] }),
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
                  navigateToSite={navigateToSite}
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
                currentProduct={currentProduct}
                setCurrentProduct={setCurrentProduct}
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
        setCurrentProduct={setCurrentProduct}
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
  setCurrentProduct: React.Dispatch<React.SetStateAction<Product>>;
  products: UserProduct[];
};

function NavBar({
  expandedMenu,
  setExpandedMenu,
  navigate,
  user,
  currentProduct,
  setCurrentProduct,
  products,
}: NavBarProps) {
  const likeMutation = useLikeMutation();

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
            <Ionicons name="arrow-back" size={28} color="black" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigate('forward')}>
            <Ionicons name="arrow-forward" size={28} color="black" />
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
              <Ionicons name="close-circle" size={26} color="black" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => {
                setExpandedMenu(true);
                handlePresentModalPress();
              }}
            >
              <Ionicons name="arrow-up-circle" size={26} color="black" />
            </TouchableOpacity>
          )}
        </Box>
        <Box flex={0} flexDirection="row" gap="m" alignItems="center">
          <TouchableOpacity
            onPress={() => {
              if (activeProduct) {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                likeMutation.mutate(activeProduct);
              }
            }}
          >
            <Ionicons name={icon} size={24} color="black" />
          </TouchableOpacity>
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
        setCurrentProduct={setCurrentProduct}
        products={products}
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
};

const BottomSheet = ({
  bottomSheetModalRef,
  setExpandedMenu,
  currentProduct,
  setCurrentProduct,
  products,
}: BottomSheetModalProps) => {
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
      backgroundStyle={{}}
      ref={bottomSheetModalRef}
      index={0}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
      backdropComponent={(props) => (
        <BottomSheetBackdrop
          {...props}
          appearsOnIndex={0}
          disappearsOnIndex={-1}
        />
      )}
    >
      <BottomSheetContent
        currentProduct={currentProduct}
        expandedContent={expandedContent}
        products={products}
        setCurrentProduct={setCurrentProduct}
      />
    </BottomSheetModal>
  );
};

type BottomSheetContentProps = {
  currentProduct: Product;
  expandedContent: boolean;
  products: UserProduct[];
  setCurrentProduct: React.Dispatch<React.SetStateAction<Product>>;
};

const BottomSheetContent = ({
  currentProduct,
  setCurrentProduct,
  expandedContent,
  products,
}: BottomSheetContentProps) => {
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
            {img ? (
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
                <Ionicons name="close" size={20} color="white" />
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
        <PrimaryButton label="Test on model" onPress={() => {}} />
      </Box>
    );
  }
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
