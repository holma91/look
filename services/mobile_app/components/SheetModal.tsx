import React, { useCallback, useMemo, useState } from 'react';
import {
  BottomSheetModal,
  BottomSheetFlatList,
  BottomSheetBackdrop,
} from '@gorhom/bottom-sheet';
import Ionicons from '@expo/vector-icons/Ionicons';

import { Box } from '../styling/Box';
import { Text } from '../styling/Text';
import { Filters, OuterChoiceFilterType } from '../utils/types';
import { PrimaryButton, SecondaryButton, FilterListButton } from './Button';
import { TouchableOpacity } from 'react-native';
import Animated, {
  FadeOutLeft,
  SlideInLeft,
  SlideInRight,
  SlideOutLeft,
  SlideOutRight,
  set,
} from 'react-native-reanimated';
import { capitalizeFirstLetter } from '../utils/helpers';

type SheetModalProps = {
  bottomSheetModalRef: React.RefObject<BottomSheetModal>;
  choices: Filters;
  outerChoice: OuterChoiceFilterType;
  setOuterChoice?: React.Dispatch<React.SetStateAction<OuterChoiceFilterType>>;
  resetFilter: () => void;
  handleFilterSelection: (
    filterType: OuterChoiceFilterType,
    filterValue: string
  ) => void;
  filters: Filters;
  sheetNavStack: OuterChoiceFilterType[];
  setSheetNavStack: React.Dispatch<
    React.SetStateAction<OuterChoiceFilterType[]>
  >;
};

export default function SheetModal({
  bottomSheetModalRef,
  choices,
  outerChoice,
  setOuterChoice,
  handleFilterSelection,
  resetFilter,
  filters,
  sheetNavStack,
  setSheetNavStack,
}: SheetModalProps) {
  const snapPoints = useMemo(() => ['65%'], []);

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
      onDismiss={() => {
        console.log('dismissed');
        setSheetNavStack([]);
      }}
    >
      <BottomSheetContent
        bottomSheetModalRef={bottomSheetModalRef}
        choices={choices}
        outerChoice={outerChoice}
        setOuterChoice={setOuterChoice}
        resetFilter={resetFilter}
        handleFilterSelection={handleFilterSelection}
        filters={filters}
        sheetNavStack={sheetNavStack}
        setSheetNavStack={setSheetNavStack}
      />
    </BottomSheetModal>
  );
}

type BottomSheetContentProps = {
  bottomSheetModalRef: React.RefObject<BottomSheetModal>;
  choices: Filters;
  outerChoice: OuterChoiceFilterType;
  setOuterChoice?: React.Dispatch<React.SetStateAction<OuterChoiceFilterType>>;
  resetFilter: () => void;
  handleFilterSelection: (
    filterType: OuterChoiceFilterType,
    filterValue: string
  ) => void;
  filters: Filters;
  sheetNavStack: OuterChoiceFilterType[];
  setSheetNavStack: React.Dispatch<
    React.SetStateAction<OuterChoiceFilterType[]>
  >;
};

function BottomSheetContent({
  outerChoice,
  setOuterChoice,
  choices,
  filters,
  handleFilterSelection,
  resetFilter,
  bottomSheetModalRef,
  sheetNavStack,
  setSheetNavStack,
}: BottomSheetContentProps) {
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

  const relevantChoices = choices[outerChoice];

  return (
    <>
      <Box
        justifyContent="center"
        alignItems="center"
        marginBottom="m"
        position="relative"
      >
        <Text variant="title" fontSize={22}>
          {capitalizeFirstLetter(outerChoice)}
        </Text>
        {outerChoice !== 'all' && sheetNavStack.includes('all') ? (
          <TouchableOpacity
            onPress={() => {
              setOuterChoice?.('all');
              setSheetNavStack((prev) => prev.slice(0, prev.length - 1));
            }}
            style={{
              position: 'absolute',
              left: 15,
            }}
          >
            <Ionicons name="chevron-back" size={28} color="black" />
          </TouchableOpacity>
        ) : null}
      </Box>
      {outerChoice === 'all' ? (
        <AllList
          bottomSheetModalRef={bottomSheetModalRef}
          choices={choices}
          outerChoice={outerChoice}
          setOuterChoice={setOuterChoice}
          resetFilter={resetFilter}
          handleFilterSelection={handleFilterSelection}
          filters={filters}
          sheetNavStack={sheetNavStack}
          setSheetNavStack={setSheetNavStack}
        />
      ) : sheetNavStack.includes('all') ? (
        <Animated.View
          style={{ flex: 1 }}
          entering={SlideInRight.duration(500)}
          exiting={SlideOutRight.duration(500)}
        >
          <BottomSheetFlatList
            data={relevantChoices}
            renderItem={renderListItem}
            keyExtractor={(item) => item}
            contentContainerStyle={{ backgroundColor: 'white' }}
            style={{ paddingHorizontal: 10 }}
            showsVerticalScrollIndicator={false}
          />
        </Animated.View>
      ) : (
        <BottomSheetFlatList
          data={relevantChoices}
          renderItem={renderListItem}
          keyExtractor={(item) => item}
          contentContainerStyle={{ backgroundColor: 'white' }}
          style={{ paddingHorizontal: 10 }}
          showsVerticalScrollIndicator={false}
        />
      )}

      <Box
        flexDirection="row"
        justifyContent="center"
        alignItems="center"
        marginBottom="xl"
        gap="s"
        paddingTop="m"
        paddingHorizontal="m"
      >
        <SecondaryButton
          label="Reset"
          flex={1}
          onPress={() => {
            resetFilter();
            bottomSheetModalRef?.current?.close();
          }}
        />

        <PrimaryButton
          label="Done"
          flex={1}
          onPress={() => {
            bottomSheetModalRef?.current?.close();
          }}
        />
      </Box>
    </>
  );
}

function AllList({
  outerChoice,
  setOuterChoice,
  choices,
  filters,
  handleFilterSelection,
  resetFilter,
  bottomSheetModalRef,
  sheetNavStack,
  setSheetNavStack,
}: BottomSheetContentProps) {
  const renderListItem = useCallback(
    ({ item }: { item: string }) => {
      const isSelected = filters[outerChoice]?.includes(item);

      return (
        <FilterListButton
          label={item}
          onPress={() => {
            console.log('setOuterChoice:', setOuterChoice);
            console.log('item:', item);
            setOuterChoice?.(item as OuterChoiceFilterType);
            setSheetNavStack((prev) => [
              ...prev,
              item as OuterChoiceFilterType,
            ]);
          }}
          isSelected={isSelected || false}
          item={item}
        />
      );
    },
    [outerChoice, filters, handleFilterSelection]
  );

  const relevantChoices = choices[outerChoice];

  if (sheetNavStack.includes('all')) {
    <Animated.View
      entering={SlideInLeft.duration(500)}
      exiting={SlideOutLeft.duration(500)}
      style={{ flex: 1 }}
    >
      <BottomSheetFlatList
        data={relevantChoices}
        renderItem={renderListItem}
        keyExtractor={(item) => item}
        contentContainerStyle={{ backgroundColor: 'white' }}
        style={{ paddingHorizontal: 10 }}
        showsVerticalScrollIndicator={false}
      />
    </Animated.View>;
  }

  return (
    <Animated.View exiting={SlideOutLeft.duration(500)} style={{ flex: 1 }}>
      <BottomSheetFlatList
        data={relevantChoices}
        renderItem={renderListItem}
        keyExtractor={(item) => item}
        contentContainerStyle={{ backgroundColor: 'white' }}
        style={{ paddingHorizontal: 10 }}
        showsVerticalScrollIndicator={false}
      />
    </Animated.View>
  );
}
