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
            bottom: 55,
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
              {/* {generating ? (
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
              )} */}
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
              {/* <Button
                label="Add to cart"
                variant="tertiary"
                fontSize={14}
                color="textOnBackground"
                paddingVertical="s"
              ></Button> */}
            </Box>
          </Animated.View>
        )}
      </Animated.View>
    </GestureDetector>
  );
}

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

export const likeProduct = async (userId: string, productUrl: string) => {
  const response = await fetch(`${URL}/users/${userId}/likes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ productUrl }),
  });
  return response;
};

export const unlikeProduct = async (userId: string, productUrl: string) => {
  const response = await fetch(`${URL}/users/${userId}/likes`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ productUrl }),
  });
  return response;
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
