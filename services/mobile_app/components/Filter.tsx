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
import { Filters, UserProduct } from '../utils/types';
import { fetchBrands, fetchCompanies, fetchLikes, fetchWebsites } from '../api';
import { Website } from '../utils/types';

const possibleFilters: { label: 'category' | 'website' | 'brand' }[] = [
  { label: 'category' },
  { label: 'brand' },
  { label: 'website' },
  // { label: 'Price' },
  // { label: 'On sale' },
  // { label: 'Sort by' },
];

type FilterProps = {
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
  showFilter: boolean;
  handleFilterSelection: (
    filterType: 'view' | 'category' | 'website' | 'brand',
    filterValue: string
  ) => void;
};

export default function Filter({
  filters,
  setFilters,
  showFilter,
  handleFilterSelection,
}: FilterProps) {
  const [outerChoice, setOuterChoice] = useState<
    'category' | 'website' | 'brand'
  >('brand');

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

  const handlePresentModalPress = useCallback(
    (label: 'category' | 'website' | 'brand') => {
      console.log('setting outer choice', label);
      setOuterChoice(label);

      filterSheetModalRef.current?.present();
    },
    []
  );

  const choices: Filters = {
    view: ['Likes', 'History', 'Purchases', 'New List'],
    category: ['Hoodies', 'T-shirts', 'Suits'],
    brand: brands || [],
    website: companies || [],
  };

  const choicesList = useMemo(() => {
    if (outerChoice === 'category') {
      // this should be fetched from the backend depending on the categories the user has viewed
      return ['Hoodies', 'T-shirts', 'Suits'];
    } else if (outerChoice === 'brand') {
      // same as above
      return brands || [];
    } else if (outerChoice === 'website') {
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
          data={possibleFilters}
          contentContainerStyle={{ paddingLeft: 12 }}
          keyExtractor={(item, index) => `category-${index}`}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => {
                handlePresentModalPress(item.label);
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
        choices={choices}
        outerChoice={outerChoice}
        handleFilterSelection={handleFilterSelection}
      />
    </>
  );
}
