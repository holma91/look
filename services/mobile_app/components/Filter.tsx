import { FlatList, TouchableOpacity } from 'react-native';
import { useUser } from '@clerk/clerk-expo';
import * as Haptics from 'expo-haptics';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import React, { useEffect } from 'react';
import { BottomSheetBackdrop, BottomSheetModal } from '@gorhom/bottom-sheet';
import { Text } from '../styling/Text';
import { FilterSheetModal } from './sheets/FilterSheetModal';
import { useQuery } from '@tanstack/react-query';
import { FilterType, OuterChoiceFilterType } from '../utils/types';
import { fetchBrands, fetchCompanies, fetchPlists } from '../api';
import ThemedIcon from './ThemedIcon';
import { useTheme } from '@shopify/restyle';
import { NewListSheetModal } from './sheets/NewListSheetModal';

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
  filter: FilterType;
  setFilter: React.Dispatch<React.SetStateAction<FilterType>>;
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
  newListSheetModalRef: React.MutableRefObject<BottomSheetModal | null>;
  filterSheetModalRef: React.MutableRefObject<BottomSheetModal | null>;
  handlePresentFilterSheetModal: (label: OuterChoiceFilterType) => void;
  outerChoice: OuterChoiceFilterType;
  setOuterChoice: React.Dispatch<React.SetStateAction<OuterChoiceFilterType>>;
};

export default function Filter({
  filter,
  setFilter,
  resetFilter,
  showFilter,
  handleFilterSelection,
  sheetNavStack,
  setSheetNavStack,
  filterSheetModalRef,
  newListSheetModalRef,
  handlePresentFilterSheetModal,
  outerChoice,
  setOuterChoice,
}: FilterProps) {
  const theme = useTheme();
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

  const { data: plists } = useQuery<string[]>({
    queryKey: ['plists', user?.id],
    queryFn: () => fetchPlists(user?.id as string),
    enabled: !!user?.id,
    select: (data) => data.map((plist: any) => plist.id),
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

  const choices = React.useMemo<FilterType>(() => {
    return {
      all: ['list', 'brand', 'website'],
      list: ['likes', 'history'].concat(plists || []),
      brand: brands || [],
      website: companies || [],
    };
  }, [brands, companies, plists]);

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
                handlePresentFilterSheetModal(item.label);
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
                backgroundColor: theme.colors.lightBackground, // '#ededed',
              }}
            >
              <Text
                variant="body"
                fontWeight="600"
                fontSize={13}
                color="textOnLightBackground"
              >
                {item.label}
              </Text>
              <ThemedIcon
                name="chevron-down"
                size={15}
                style={{ paddingTop: 1 }}
                color="textOnLightBackground"
              />
            </TouchableOpacity>
          )}
        />
      </Animated.View>
      <FilterSheetModal
        filterSheetModalRef={filterSheetModalRef}
        newListSheetModalRef={newListSheetModalRef}
        choices={choices}
        outerChoice={outerChoice}
        setOuterChoice={setOuterChoice}
        resetFilter={resetFilter}
        handleFilterSelection={handleFilterSelection}
        filter={filter}
        sheetNavStack={sheetNavStack}
        setSheetNavStack={setSheetNavStack}
      />

      <NewListSheetModal
        newListSheetModalRef={newListSheetModalRef}
        filterSheetModalRef={filterSheetModalRef}
        handleFilterSelection={handleFilterSelection}
      />
    </>
  );
}
