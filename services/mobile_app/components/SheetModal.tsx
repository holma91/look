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

type SheetModalProps = {
  bottomSheetModalRef: React.RefObject<BottomSheetModal>;
  choices: Filters;
  outerChoice: 'view' | 'category' | 'website' | 'brand';
  handleFilterSelection: (
    filterType: 'view' | 'category' | 'website' | 'brand',
    filterValue: string
  ) => void;
};

export default function SheetModal({
  bottomSheetModalRef,
  choices,
  outerChoice,
  handleFilterSelection,
}: SheetModalProps) {
  const [choice, setChoice] = useState<string>('');
  const snapPoints = useMemo(() => ['50%'], []);

  const renderListItem = useCallback(
    ({ item }: { item: string }) => (
      <Button
        onPress={() => {
          if (choice === item) {
            setChoice('');
          } else {
            setChoice(item);
            handleFilterSelection(outerChoice, item);
          }
        }}
        variant="new"
        backgroundColor={item === choice ? 'text' : 'grey'}
        margin="xs"
      >
        <Text
          variant="body"
          fontWeight="bold"
          fontSize={16}
          color={item === choice ? 'background' : 'text'}
        >
          {item}
        </Text>
        {item === choice ? (
          <Ionicons name="checkmark" size={20} color="white" />
        ) : null}
        {item === 'New List' ? (
          <Ionicons name="add" size={20} color="black" />
        ) : null}
      </Button>
    ),
    [outerChoice, choice]
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
    </BottomSheetModal>
  );
}
