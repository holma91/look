import { FlatList, TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useUser } from '@clerk/clerk-expo';
import * as Haptics from 'expo-haptics';
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
import {
  BottomSheetModal,
  BottomSheetFlatList,
  BottomSheetBackdrop,
} from '@gorhom/bottom-sheet';
import { Text } from '../styling/Text';
import SheetModal from './SheetModal';
import { useQuery } from '@tanstack/react-query';
import { Filters, OuterChoiceFilterType } from '../utils/types';
import { fetchBrands, fetchCompanies } from '../api';
import { Website } from '../utils/types';

const possibleFilters: {
  label: 'all' | 'list' | 'category' | 'website' | 'brand';
}[] = [
  { label: 'all' },
  { label: 'list' },
  { label: 'brand' },
  { label: 'website' },
  // { label: 'category' },
  // { label: 'Price' },
  // { label: 'On sale' },
  // { label: 'Sort by' },
];

type FilterProps = {
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
  resetFilter: () => void;
  showFilter: boolean;
  handleFilterSelection: (
    filterType: OuterChoiceFilterType,
    filterValue: string
  ) => void;
  sheetNavStack: OuterChoiceFilterType[];
  setSheetNavStack: React.Dispatch<
    React.SetStateAction<OuterChoiceFilterType[]>
  >;
};

export default function Filter({
  filters,
  setFilters,
  resetFilter,
  showFilter,
  handleFilterSelection,
  sheetNavStack,
  setSheetNavStack,
}: FilterProps) {
  const [outerChoice, setOuterChoice] =
    useState<OuterChoiceFilterType>('brand');

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
    (label: OuterChoiceFilterType) => {
      setOuterChoice(label);
      setSheetNavStack((prev) => [...prev, label]);

      filterSheetModalRef.current?.present();
    },
    []
  );

  const choices = React.useMemo<Filters>(() => {
    return {
      all: ['list', 'brand', 'website'],
      list: ['likes', 'history', 'purchases', 'new list'],
      brand: brands || [],
      website: companies || [],
    };
  }, [brands, companies]);

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
                Haptics.selectionAsync();
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
        filterSheetModalRef={filterSheetModalRef}
        choices={choices}
        outerChoice={outerChoice}
        setOuterChoice={setOuterChoice}
        resetFilter={resetFilter}
        handleFilterSelection={handleFilterSelection}
        filters={filters}
        sheetNavStack={sheetNavStack}
        setSheetNavStack={setSheetNavStack}
      />
    </>
  );
}
