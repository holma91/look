import React, { useCallback, useMemo, useRef, useState } from 'react';
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
  SlideInLeft,
  SlideInRight,
  SlideOutLeft,
  SlideOutRight,
} from 'react-native-reanimated';
import { capitalizeFirstLetter } from '../utils/helpers';

type SheetModalProps = {
  filterSheetModalRef: React.RefObject<BottomSheetModal>;
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
  filterSheetModalRef,
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

  const newListSheetModalRef = useRef<BottomSheetModal>(null);

  return (
    <>
      <BottomSheetModal
        ref={filterSheetModalRef}
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
        <FilterSheet
          filterSheetModalRef={filterSheetModalRef}
          choices={choices}
          outerChoice={outerChoice}
          setOuterChoice={setOuterChoice}
          resetFilter={resetFilter}
          handleFilterSelection={handleFilterSelection}
          filters={filters}
          sheetNavStack={sheetNavStack}
          setSheetNavStack={setSheetNavStack}
          newListSheetModalRef={newListSheetModalRef}
        />
      </BottomSheetModal>
      <BottomSheetModal
        ref={newListSheetModalRef}
        snapPoints={['65%']}
        backdropComponent={(props) => (
          <BottomSheetBackdrop
            {...props}
            appearsOnIndex={0}
            disappearsOnIndex={-1}
          />
        )}
        handleIndicatorStyle={{ backgroundColor: 'white' }}
      >
        <NewListSheet newListSheetModalRef={newListSheetModalRef} />
      </BottomSheetModal>
    </>
  );
}

type FilterSheetProps = {
  filterSheetModalRef: React.RefObject<BottomSheetModal>;
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
  newListSheetModalRef?: React.RefObject<BottomSheetModal>;
};

function FilterSheet({
  outerChoice,
  setOuterChoice,
  choices,
  filters,
  handleFilterSelection,
  resetFilter,
  filterSheetModalRef,
  sheetNavStack,
  setSheetNavStack,
  newListSheetModalRef,
}: FilterSheetProps) {
  const renderListItem = useCallback(
    ({ item }: { item: string }) => {
      const isSelected = filters[outerChoice]?.includes(item);
      if (item === 'new list') {
        return (
          <FilterListButton
            label={item}
            onPress={() => {
              newListSheetModalRef?.current?.present();
            }}
            isSelected={false}
            item={item}
          />
        );
      }

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

  console.log('sheetNavStack:', sheetNavStack);
  console.log('outerChoice:', outerChoice);

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
              setOuterChoice?.(sheetNavStack[sheetNavStack.length - 2]);
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
      ) : sheetNavStack.length > 0 && sheetNavStack[0] === 'all' ? (
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
            filterSheetModalRef?.current?.close();
          }}
        />

        <PrimaryButton
          label="Done"
          flex={1}
          onPress={() => {
            filterSheetModalRef?.current?.close();
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
  filterSheetModalRef,
  sheetNavStack,
  setSheetNavStack,
}: FilterSheetProps) {
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

type NewListSheetProps = {
  newListSheetModalRef: React.RefObject<BottomSheetModal>;
};

function NewListSheet({ newListSheetModalRef }: NewListSheetProps) {
  return (
    <Box flex={1}>
      <Box
        justifyContent="center"
        alignItems="center"
        marginBottom="m"
        position="relative"
      >
        <Box flexDirection="row" gap="s">
          <Text variant="title" fontSize={22}>
            New List
          </Text>
          <Ionicons name="pencil" size={22} color="black" />
        </Box>
        <TouchableOpacity
          onPress={() => {
            newListSheetModalRef?.current?.close();
          }}
          style={{
            position: 'absolute',
            right: 15,
          }}
        >
          <Ionicons name="close" size={28} color="black" />
        </TouchableOpacity>
      </Box>
      <Box
        marginTop="s"
        marginBottom="xl"
        marginHorizontal="m"
        gap="l"
        justifyContent="space-between"
        flex={1}
      >
        <Text variant="smallTitle" textAlign="center">
          Do you want to add any of your products to your new list?
        </Text>
        <PrimaryButton label="Create list" />
      </Box>
    </Box>
  );
}
