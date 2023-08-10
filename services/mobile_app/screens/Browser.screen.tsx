import { SafeAreaView, TouchableOpacity } from 'react-native';
import { WebView } from 'react-native-webview';
import React, { useCallback, useRef, useState } from 'react';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import * as Haptics from 'expo-haptics';
import { useQuery } from '@tanstack/react-query';
import { useUser } from '@clerk/clerk-expo';

import { Box } from '../styling/Box';
import { Text } from '../styling/Text';
import {
  extractScriptV2,
  freezeScript,
  unFreezeScript,
} from '../utils/scripts';
import { fetchProducts } from '../api';
import { Company, Product, UserProduct } from '../utils/types';
import { WebviewSearchBar } from '../components/SearchBar';
import SearchList from '../components/SearchList';
import { saveHistory } from '../utils/history';
import { useLikeProductMutation } from '../hooks/mutations/useLikeProductMutation';
import ThemedIcon from '../components/ThemedIcon';
import { parseProductData } from '../utils/parsing';
import { useAddToHistoryMutation } from '../hooks/mutations/useAddToHistoryMutation';
import { useAddImagesMutation } from '../hooks/mutations/useAddImagesMutation';
import { useRemoveImagesMutation } from '../hooks/mutations/useRemoveImagesMutation';
import { arraysAreEqual } from '../utils/helpers';
import { BrowserSheetModal } from '../components/sheets/BrowserSheetModal';

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

type BrowserProps = {
  navigation: any;
  route: any;
};

export default function Browser({ navigation, route }: BrowserProps) {
  const [searchText, setSearchText] = useState('');
  const [searchBarFocused, setSearchBarFocused] = useState(false);
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

  const webviewRef = useRef<WebView>(null);

  const navigate = useCallback(
    (direction: 'back' | 'forward' | 'reload') => {
      if (!webviewRef.current) return;

      if (direction === 'back') {
        webviewRef.current.goBack();
      } else if (direction === 'forward') {
        webviewRef.current.goForward();
      } else if (direction === 'reload') {
        webviewRef.current.reload();
      }
    },
    [webviewRef]
  );

  const handleToggleSelectMode = useCallback(() => {
    if (!selectMode) {
      console.log('injecting le freeze');
      webviewRef?.current?.injectJavaScript(freezeScript);
    } else {
      console.log('injecting le unfreeze');
      webviewRef?.current?.injectJavaScript(unFreezeScript);
    }
    setSelectMode((prevSelectMode) => !prevSelectMode);
  }, [selectMode, webviewRef]);

  const { data: products } = useQuery({
    queryKey: ['products', user?.id, { list: ['history'] }],
    queryFn: () => fetchProducts(user?.id as string, { list: ['history'] }),
    enabled: !!user?.id,
  });

  return (
    <Box backgroundColor="background" flex={1}>
      <SafeAreaView style={{ flex: 1 }}>
        <Header
          selectMode={selectMode}
          navigation={navigation}
          navigate={navigate}
          searchText={searchText}
          setSearchText={setSearchText}
          setSearchBarFocused={setSearchBarFocused}
          searchBarFocused={searchBarFocused}
        />

        <Content
          navigation={navigation}
          route={route}
          currentProduct={currentProduct}
          setCurrentProduct={setCurrentProduct}
          webviewRef={webviewRef}
          searchBarFocused={searchBarFocused}
          setSearchBarFocused={setSearchBarFocused}
          searchText={searchText}
        />
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
      </SafeAreaView>
    </Box>
  );
}

type HeaderProps = {
  selectMode: boolean;
  navigation: any;
  navigate: (direction: 'back' | 'forward') => void;
  searchText: string;
  setSearchText: React.Dispatch<React.SetStateAction<string>>;
  setSearchBarFocused: React.Dispatch<React.SetStateAction<boolean>>;
  searchBarFocused: boolean;
};

function Header({
  selectMode,
  navigation,
  navigate,
  searchText,
  setSearchText,
  setSearchBarFocused,
  searchBarFocused,
}: HeaderProps) {
  if (selectMode) {
    return (
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
    );
  }

  return (
    <WebviewSearchBar
      navigation={navigation}
      webviewNavigation={navigate}
      searchText={searchText}
      setSearchText={setSearchText}
      handleSearch={() => {}}
      setFocus={setSearchBarFocused}
      focus={searchBarFocused}
    />
  );
}

type ContentProps = {
  navigation: any;
  route: any;
  currentProduct: Product;
  setCurrentProduct: React.Dispatch<React.SetStateAction<Product>>;
  webviewRef: React.RefObject<WebView>;
  searchBarFocused: boolean;
  searchText: string;
  setSearchBarFocused: React.Dispatch<React.SetStateAction<boolean>>;
};

function Content({
  navigation,
  route,
  currentProduct,
  setCurrentProduct,
  webviewRef,
  searchText,
  searchBarFocused,
  setSearchBarFocused,
}: ContentProps) {
  const addToHistoryMutation = useAddToHistoryMutation();
  const addImagesMutation = useAddImagesMutation();
  const removeImagesMutation = useRemoveImagesMutation();

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
    // setTimeout(() => {
    //   webviewRef?.current?.injectJavaScript(extractScriptV2);
    // }, 5000);
    // setTimeout(() => {
    //   webviewRef?.current?.injectJavaScript(extractScriptV2);
    // }, 7500);
    // setTimeout(() => {
    //   webviewRef?.current?.injectJavaScript(extractScriptV2);
    // }, 10000);
  };

  const handleLoadEnd = (navState: any) => {
    if (route.params?.baseProductUrl) {
      // this is when user comes right from the product screen
      if (navState.nativeEvent.url === route.params.baseProductUrl) {
        return;
      }
    }

    injectScripts();
  };

  const handleProductMessage = (data: any, eventUrl: string) => {
    const product = parseProductData(eventUrl, data);
    if (currentProduct.url !== product.url) {
      if (
        !arraysAreEqual(currentProduct.images, product.images) ||
        product.images.length === 0
      ) {
        setCurrentProduct(product);

        if (product.images.length > 0) {
          addToHistoryMutation.mutate(product);
        }
      } else {
        // console.log('images do not differ');
      }
    } else {
      // this is a refresh
      setCurrentProduct(product);
    }
  };

  const handleImageAddMessage = (data: any) => {
    const updatedProduct = {
      ...currentProduct,
      images: [...currentProduct.images, data.data],
    };
    if (currentProduct.images.length === 0) {
      console.log('addHistoryMutation');
      addToHistoryMutation.mutate(updatedProduct);
    } else {
      console.log('addImagesMutation');
      addImagesMutation.mutate({
        product: currentProduct,
        images: [data.data],
      });
    }

    setCurrentProduct(updatedProduct);
  };

  const handleImageRemoveMessage = (data: any) => {
    const newImages = currentProduct.images.filter((img) => img !== data.data);

    removeImagesMutation.mutate({
      product: currentProduct,
      images: [data.data],
    });

    setCurrentProduct({ ...currentProduct, images: newImages });
  };

  const handleNoProductMessage = () => {
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
  };

  const handleMessage = (event: any) => {
    const data = JSON.parse(event.nativeEvent.data);

    switch (data.type) {
      case 'product':
        handleProductMessage(event.nativeEvent.data, event.nativeEvent.url);
        break;
      case 'imageAdd':
        handleImageAddMessage(data);
        break;
      case 'imageRemove':
        handleImageRemoveMessage(data);
        break;
      case 'no product':
        handleNoProductMessage();
        break;
      default:
        console.log('unknown message type:', data.type, data.data);
    }
  };

  return (
    <Box flex={1}>
      {searchBarFocused ? (
        <Box flex={1}>
          <SearchList
            navigateToSite={navigateToSite}
            searchText={searchText}
            setFocus={setSearchBarFocused}
          />
        </Box>
      ) : null}
      <Box flex={searchBarFocused ? 0 : 1}>
        <WebView
          ref={webviewRef}
          startInLoadingState={true} // https://github.com/react-native-webview/react-native-webview/issues/124
          source={{
            uri: getUrl(route.params.url),
          }}
          onLoadEnd={handleLoadEnd}
          onMessage={handleMessage}
          mediaPlaybackRequiresUserAction={true}
          originWhitelist={['*']}
        />
      </Box>
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

  const handleLikeProduct = async () => {
    if (activeProduct) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      likeProductMutation.mutate(activeProduct);
    }
  };

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
          <TouchableOpacity onPress={handleLikeProduct}>
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
      <BrowserSheetModal
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
