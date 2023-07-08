import { FlatList, TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from 'react';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { Text } from '../styling/Text';
import SheetModal from './SheetModal';

const filters: { label: string }[] = [
  { label: 'Category' },
  { label: 'Brand' },
  { label: 'Website' },
  { label: 'Price' },
  { label: 'On sale' },
  { label: 'Sort by' },
];

export default function Filter({ showFilter }: { showFilter: boolean }) {
  // todo: useReducer for all the state here
  const [outerChoice, setOuterChoice] = useState<string>('Category');
  const [choice, setChoice] = useState<string>('');

  const animationValue = useSharedValue(0);
  useEffect(() => {
    animationValue.value = withTiming(showFilter ? 1 : 0, { duration: 250 });
  }, [showFilter, animationValue]);

  const animatedStyles = useAnimatedStyle(() => {
    return {
      height: animationValue.value * 42,
    };
  });

  const filterSheetModalRef = useRef<BottomSheetModal>(null);

  const handlePresentModalPress = useCallback(() => {
    filterSheetModalRef.current?.present();
  }, []);

  const choicesList = useMemo(() => {
    if (outerChoice === 'Category') {
      return ['Hoodies', 'T-shirts', 'Suits'];
    } else if (outerChoice === 'Brand') {
      return ['Soft Goat', 'Filippa K', 'Lululemon', "A Day's March"];
    } else if (outerChoice === 'Website') {
      return [
        'softgoat.com',
        'zalando.com',
        'adaysmarch.com',
        'lululemon.com',
        'farfetch.com',
        'tomford.com',
        'boozt.com',
      ];
    }

    return [];
  }, [outerChoice]);

  return (
    <>
      <Animated.View style={[{ paddingBottom: 8 }, animatedStyles]}>
        <FlatList
          style={{ gap: 10 }}
          horizontal
          showsHorizontalScrollIndicator={false}
          data={filters}
          contentContainerStyle={{ paddingLeft: 12 }}
          keyExtractor={(item, index) => `category-${index}`}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => {
                setOuterChoice(item.label);
                handlePresentModalPress();
              }}
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 3,
                marginRight: 8,
                borderRadius: 10,
                padding: 8,
                paddingHorizontal: 10,
                backgroundColor: '#ededed',
              }}
            >
              <Text variant="body" fontWeight="600" fontSize={13} color="text">
                {item.label}
              </Text>
              <Ionicons
                name="chevron-down"
                size={15}
                color="black"
                paddingTop={1}
              />
            </TouchableOpacity>
          )}
        />
      </Animated.View>
      <SheetModal
        bottomSheetModalRef={filterSheetModalRef}
        choicesList={choicesList}
        setChoice={setChoice}
        choice={choice}
        sheetHeader="Filter by"
      />
    </>
  );
}
