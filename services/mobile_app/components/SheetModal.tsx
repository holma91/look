import Ionicons from '@expo/vector-icons/Ionicons';
import React, { useCallback, useMemo, useState } from 'react';
import {
  BottomSheetModal,
  BottomSheetFlatList,
  BottomSheetBackdrop,
} from '@gorhom/bottom-sheet';
import { Box } from '../styling/Box';
import { Text } from '../styling/Text';
import { Button } from './Buttons';
import { Filters } from '../utils/types';
import { TouchableOpacity } from 'react-native';
import { PrimaryButton, SecondaryButton, FilterListButton } from './Button';

type SheetModalProps = {
  bottomSheetModalRef: React.RefObject<BottomSheetModal>;
  choices: Filters;
  outerChoice: 'view' | 'category' | 'website' | 'brand';
  handleFilterSelection: (
    filterType: 'view' | 'category' | 'website' | 'brand',
    filterValue: string
  ) => void;
  filters: Filters;
};

export default function SheetModal({
  bottomSheetModalRef,
  choices,
  outerChoice,
  handleFilterSelection,
  filters,
}: SheetModalProps) {
  const snapPoints = useMemo(() => ['65%'], []);

  const renderListItem = useCallback(
    ({ item }: { item: string }) => {
      const isSelected = filters[outerChoice]?.includes(item);

      return (
        <FilterListButton
          label={item}
          onPress={() => {
            handleFilterSelection(outerChoice, item);
          }}
          isSelected={isSelected || false}
          item={item}
        />
      );
    },
    [outerChoice, filters, handleFilterSelection]
  );

  return (
    <BottomSheetModal
      ref={bottomSheetModalRef}
      snapPoints={snapPoints}
      backdropComponent={(props) => (
        <BottomSheetBackdrop
          {...props}
          appearsOnIndex={0}
          disappearsOnIndex={-1}
        />
      )}
      handleIndicatorStyle={{ backgroundColor: 'white' }}
    >
      <Box justifyContent="center" alignItems="center" marginBottom="m">
        <Text variant="title" fontSize={22}>
          {outerChoice}
        </Text>
      </Box>
      <BottomSheetFlatList
        data={choices[outerChoice]}
        renderItem={renderListItem}
        keyExtractor={(item) => item}
        contentContainerStyle={{ backgroundColor: 'white' }}
        style={{ paddingHorizontal: 10 }}
        showsVerticalScrollIndicator={false}
      />

      <Box
        flexDirection="row"
        justifyContent="center"
        alignItems="center"
        marginBottom="xl"
        gap="s"
        paddingTop="m"
        paddingHorizontal="m"
      >
        <SecondaryButton label="Reset" flex={1}></SecondaryButton>
        <PrimaryButton label="Done" flex={1}></PrimaryButton>
      </Box>
    </BottomSheetModal>
  );
}
