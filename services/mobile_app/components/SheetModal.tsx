import React, { useCallback, useMemo, useState } from 'react';
import {
  BottomSheetModal,
  BottomSheetFlatList,
  BottomSheetBackdrop,
} from '@gorhom/bottom-sheet';
import Ionicons from '@expo/vector-icons/Ionicons';

import { Box } from '../styling/Box';
import { Text } from '../styling/Text';
import { FilterType, OuterChoiceFilterType } from '../utils/types';
import {
  PrimaryButton,
  SecondaryButton,
  FilterListButton,
  NewListButton,
} from './Button';
import { TouchableOpacity } from 'react-native';
import Animated, {
  SlideInLeft,
  SlideInRight,
  SlideOutLeft,
  SlideOutRight,
} from 'react-native-reanimated';
import { capitalizeFirstLetter } from '../utils/helpers';
import { NewListSheet } from './NewListSheet';

type SheetModalProps = {
  filterSheetModalRef: React.RefObject<BottomSheetModal>;
  newListSheetModalRef: React.RefObject<BottomSheetModal>;
  choices: FilterType;
  outerChoice: OuterChoiceFilterType;
  setOuterChoice?: React.Dispatch<React.SetStateAction<OuterChoiceFilterType>>;
  resetFilter: () => void;
  handleFilterSelection: (
    filterType: OuterChoiceFilterType,
    filterValue: string
  ) => void;
  filter: FilterType;
  sheetNavStack: OuterChoiceFilterType[];
  setSheetNavStack: React.Dispatch<
    React.SetStateAction<OuterChoiceFilterType[]>
  >;
};

export default function SheetModal({
  filterSheetModalRef,
  newListSheetModalRef,
  choices,
  outerChoice,
  setOuterChoice,
  handleFilterSelection,
  resetFilter,
  filter,
  sheetNavStack,
  setSheetNavStack,
}: SheetModalProps) {
  const snapPoints = useMemo(() => ['65%'], []);

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
          filter={filter}
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
        <NewListSheet
          newListSheetModalRef={newListSheetModalRef}
          filterSheetModalRef={filterSheetModalRef}
          handleFilterSelection={handleFilterSelection}
        />
      </BottomSheetModal>
    </>
  );
}

type FilterSheetProps = {
  filterSheetModalRef: React.RefObject<BottomSheetModal>;
  choices: FilterType;
  outerChoice: OuterChoiceFilterType;
  setOuterChoice?: React.Dispatch<React.SetStateAction<OuterChoiceFilterType>>;
  resetFilter: () => void;
  handleFilterSelection: (
    filterType: OuterChoiceFilterType,
    filterValue: string
  ) => void;
  filter: FilterType;
  sheetNavStack: OuterChoiceFilterType[];
  setSheetNavStack: React.Dispatch<
    React.SetStateAction<OuterChoiceFilterType[]>
  >;
  newListSheetModalRef?: React.RefObject<BottomSheetModal>;
};

type ListItemProps = {
  item: string;
  outerChoice: OuterChoiceFilterType;
  filter: FilterType;
  handleFilterSelection: (
    filterType: OuterChoiceFilterType,
    filterValue: string
  ) => void;
  isEditing: boolean;
};

const ListItem = ({
  item,
  outerChoice,
  filter,
  handleFilterSelection,
  isEditing,
}: ListItemProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const isSelected = filter[outerChoice]?.includes(item);

  return (
    <Box flexDirection="row" alignItems="center" gap="s">
      {isEditing ? (
        <TouchableOpacity onPress={() => setIsDeleting(true)}>
          <Ionicons name="remove-circle" size={24} color="#FF3B30" />
        </TouchableOpacity>
      ) : null}
      <FilterListButton
        label={item}
        onPress={() => {
          handleFilterSelection(outerChoice, item);
        }}
        isSelected={isSelected || false}
        item={item}
        isDeleting={isDeleting}
      />
    </Box>
  );
};

function FilterSheet({
  outerChoice,
  setOuterChoice,
  choices,
  filter,
  handleFilterSelection,
  resetFilter,
  filterSheetModalRef,
  sheetNavStack,
  setSheetNavStack,
  newListSheetModalRef,
}: FilterSheetProps) {
  const [isEditing, setIsEditing] = useState(false);
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
        {outerChoice === 'list' ? (
          <TouchableOpacity
            onPress={() => setIsEditing(!isEditing)}
            style={{
              position: 'absolute',
              right: 20,
            }}
          >
            <Text variant="body">{isEditing ? 'Done' : 'Edit'}</Text>
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
          filter={filter}
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
            renderItem={({ item }) => (
              <ListItem
                item={item}
                outerChoice={outerChoice}
                filter={filter}
                handleFilterSelection={handleFilterSelection}
                isEditing={isEditing}
              />
            )}
            keyExtractor={(item) => item}
            contentContainerStyle={{ backgroundColor: 'white' }}
            style={{ paddingHorizontal: 10 }}
            showsVerticalScrollIndicator={false}
          />
        </Animated.View>
      ) : (
        <BottomSheetFlatList
          data={relevantChoices}
          renderItem={({ item }) => (
            <ListItem
              item={item}
              outerChoice={outerChoice}
              filter={filter}
              handleFilterSelection={handleFilterSelection}
              isEditing={isEditing}
            />
          )}
          keyExtractor={(item) => item}
          contentContainerStyle={{ backgroundColor: 'white' }}
          style={{ paddingHorizontal: 10 }}
          showsVerticalScrollIndicator={false}
        />
      )}
      <Box paddingTop="m" paddingHorizontal="m" gap="m">
        {outerChoice === 'list' ? (
          <NewListButton
            label="New List"
            onPress={() => {
              newListSheetModalRef?.current?.present();
            }}
          />
        ) : null}

        <Box
          flexDirection="row"
          justifyContent="center"
          alignItems="center"
          marginBottom="xl"
          gap="s"
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
      </Box>
    </>
  );
}

function AllList({
  outerChoice,
  setOuterChoice,
  choices,
  filter,
  handleFilterSelection,
  resetFilter,
  filterSheetModalRef,
  sheetNavStack,
  setSheetNavStack,
}: FilterSheetProps) {
  const renderListItem = useCallback(
    ({ item }: { item: string }) => {
      const isSelected = filter[outerChoice]?.includes(item);

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
    [outerChoice, filter, handleFilterSelection]
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
