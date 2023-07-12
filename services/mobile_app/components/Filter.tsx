import { FlatList, TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useUser } from '@clerk/clerk-expo';

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
import { useQuery } from '@tanstack/react-query';
import { UserProduct } from '../utils/types';
import { fetchBrands, fetchCompanies, fetchLikes, fetchWebsites } from '../api';
import { Website } from '../utils/types';

const filters: { label: string }[] = [
  { label: 'Category' },
  { label: 'Brand' },
  { label: 'Website' },
  { label: 'Price' },
  { label: 'On sale' },
  { label: 'Sort by' },
];

type FilterProps = {
  outerChoice: string;
  setOuterChoice: React.Dispatch<React.SetStateAction<string>>;
  choice: string;
  setChoice: React.Dispatch<React.SetStateAction<string>>;
  showFilter: boolean;
};

export default function Filter({
  outerChoice,
  setOuterChoice,
  choice,
  setChoice,
  showFilter,
}: FilterProps) {
  // todo: useReducer for all the state here

  const { user } = useUser();
  const { data: companies } = useQuery<string[]>({
    queryKey: ['companies', user?.id],
    queryFn: () => fetchCompanies(user?.id as string),
    enabled: !!user?.id,
    select: (data) => data.map((company: any) => company.id),
  });

  const { data: brands } = useQuery<string[]>({
    queryKey: ['brands', user?.id],
    queryFn: () => fetchBrands(user?.id as string),
    enabled: !!user?.id,
    select: (data) => data.map((brand: any) => brand.brand),
  });

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
      // this should be fetched from the backend depending on the categories the user has viewed
      return ['Hoodies', 'T-shirts', 'Suits'];
    } else if (outerChoice === 'Brand') {
      // same as above
      return brands || [];
    } else if (outerChoice === 'Website') {
      // same as above
      return companies || [];
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
        sheetHeader={outerChoice}
      />
    </>
  );
}
