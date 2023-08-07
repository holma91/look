import { FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useQueryClient } from '@tanstack/react-query';
import { Image as ExpoImage } from 'expo-image';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useUser } from '@clerk/clerk-expo';
import { useState } from 'react';
import React, { useMemo, useRef } from 'react';
import { BottomSheetModal, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { WebView } from 'react-native-webview';
import * as Haptics from 'expo-haptics';

import { createProduct } from '../api';
import { Box } from '../styling/Box';
import { Text } from '../styling/Text';
import { Product as ProductType } from '../utils/types';
import { TextInput } from '../styling/TextInput';
import { parseProductData } from '../utils/parsing';
import { getInjectScripts } from '../utils/inject';
import { getDomain } from '../utils/helpers';
import { PrimaryButton } from '../components/Button';

type PasteLinkSheetProps = {
  navigation: any;
  pasteLinkSheetRef: React.RefObject<BottomSheetModal>;
};

const DEFAULT_SOURCE = 'https://github.com';

export function PasteLinkSheet({
  navigation,
  pasteLinkSheetRef,
}: PasteLinkSheetProps) {
  const [currentProduct, setCurrentProduct] = useState<ProductType>({
    url: '',
    name: '',
    brand: '',
    price: '',
    currency: '',
    images: [],
    domain: '',
  });
  const [linkText, setLinkText] = useState('');
  const [webViewSource, setWebViewSource] = useState(DEFAULT_SOURCE);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [unsupportedDomain, setUnsupportedDomain] = useState<string | null>(
    null
  );
  const [forceRenderKey, setForceRenderKey] = useState(
    Math.random().toString()
  );
  const [invalidLink, setInvalidLink] = useState(false);
  const snapPoints = useMemo(() => ['56%'], []);
  const webViewRef = useRef<WebView>(null);
  const { user } = useUser();
  const queryClient = useQueryClient();

  const handleUpload = async () => {
    setUnsupportedDomain(null);
    setInvalidLink(false);

    const domain = getDomain(linkText);
    if (!domain) {
      console.log('Invalid link');
      setInvalidLink(true);
      return;
    } else if (!knownDomains.includes(domain)) {
      console.log('domain not known');
      setUnsupportedDomain(domain);
      return;
    }

    setIsLoading(true);
    setForceRenderKey(Math.random().toString());
    setWebViewSource(linkText);
  };

  const handleLoadEnd = (navState: any) => {
    if (webViewSource === DEFAULT_SOURCE) return;

    const domain = getDomain(linkText);
    let scripts = getInjectScripts(domain as string);

    if (!webViewRef.current) return;

    for (let script of scripts) {
      webViewRef.current.injectJavaScript(script);
    }
  };

  const handleMessage = async (event: any) => {
    const domain = getDomain(linkText);
    if (!domain || !user) return;

    let product;
    if (knownDomains.includes(domain)) {
      product = parseProductData(event.nativeEvent.url, event.nativeEvent.data);
    } else {
      // call openai api
      product = {
        url: linkText,
        name: '',
        brand: '',
        price: '',
        currency: '',
        images: [],
        domain: '',
      };
    }

    setCurrentProduct({ ...product, domain: domain });
    setIsLoading(false);
    try {
      await createProduct(user?.id, product, domain);
      queryClient.invalidateQueries({ queryKey: ['brands', user?.id] });
      queryClient.invalidateQueries({
        queryKey: ['products', user?.id, { list: ['history'] }],
      });
    } catch (e) {
      console.error(e);
    }
  };

  const handleRemoveImage = (image: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const newImages = currentProduct.images.filter((img) => img !== image);
    setCurrentProduct({ ...currentProduct, images: newImages });
    setCurrentImageIndex(0);
  };

  const resetState = () => {
    setLinkText('');
    setWebViewSource(DEFAULT_SOURCE);
    setCurrentProduct({
      url: '',
      name: '',
      brand: '',
      price: '',
      currency: '',
      images: [],
    });
    setUnsupportedDomain(null);
    setInvalidLink(false);
  };

  const img = currentProduct.images[currentImageIndex];

  return (
    <BottomSheetModal
      ref={pasteLinkSheetRef}
      index={0}
      snapPoints={snapPoints}
      backdropComponent={(props) => (
        <BottomSheetBackdrop
          {...props}
          appearsOnIndex={0}
          disappearsOnIndex={-1}
        />
      )}
      onDismiss={resetState}
    >
      <Box padding="m">
        <Box
          backgroundColor="grey"
          borderRadius={10}
          flexDirection="row"
          alignItems="center"
          paddingHorizontal="m"
          paddingVertical="xxxs"
        >
          <TextInput
            onChangeText={setLinkText}
            value={linkText}
            onSubmitEditing={handleUpload}
            autoCapitalize="none"
            autoComplete="off"
            autoCorrect={false}
            autoFocus={true}
            inputMode="url"
            variant="secondary"
            selectTextOnFocus={true}
            placeholder="Paste product link here"
            placeholderTextColor="black"
          />
          <Ionicons
            name="link"
            size={18}
            color="black"
            style={{ position: 'absolute', left: 15 }}
          />
        </Box>
        <Box marginTop="m" gap="l">
          {isLoading ? (
            <Box marginTop="m">
              <ActivityIndicator size="large" color="#808080" />
            </Box>
          ) : invalidLink ? (
            <Box marginTop="s" gap="l">
              <Text
                variant="title"
                textAlign="center"
              >{`This is an invalid link. Please try again.`}</Text>
            </Box>
          ) : unsupportedDomain ? (
            <Box marginTop="s" gap="l">
              <Text
                variant="title"
                textAlign="center"
              >{`We are sorry, ${unsupportedDomain} is not supported yet.`}</Text>
              <PrimaryButton
                label={`I want ${unsupportedDomain} to be supported`}
              />
            </Box>
          ) : (
            <Box flexDirection="row" justifyContent="space-between" gap="m">
              <Box flex={1} position="relative">
                <ExpoImage
                  style={{
                    aspectRatio: 0.65,
                  }}
                  source={img ? img : ''}
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
                              // borderWidth: item === img ? 2 : 0,
                            }}
                            source={item}
                            contentFit="cover"
                          />
                        </TouchableOpacity>
                      </Box>
                    )}
                  />
                </Box>
              </Box>
            </Box>
          )}
          {!unsupportedDomain &&
          !invalidLink &&
          !isLoading &&
          currentProduct.images.length > 0 ? (
            <PrimaryButton
              label="Go to product"
              onPress={() => {
                pasteLinkSheetRef?.current?.dismiss();
                navigation.navigate('Product', { product: currentProduct });
              }}
            />
          ) : null}
        </Box>
      </Box>
      <WebView
        key={forceRenderKey}
        ref={webViewRef}
        source={{ uri: webViewSource }}
        style={{ height: 0, width: 0 }}
        onMessage={handleMessage}
        mediaPlaybackRequiresUserAction={true}
        startInLoadingState={true}
        onLoadEnd={handleLoadEnd}
        renderLoading={() => <></>}
      />
    </BottomSheetModal>
  );
}

const knownDomains = [
  'zalando.se',
  'se.loropiana.com',
  'boozt.com',
  'hm.com',
  'sellpy.se',
  'adaysmarch.com',
  'careofcarl.se',
  'shop.lululemon.com',
  'gucci.com',
  'moncler.com',
  'farfetch.com',
  'mytheresa.com',
];
