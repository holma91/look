import Ionicons from '@expo/vector-icons/Ionicons';
import React, { useCallback, useMemo } from 'react';
import {
  BottomSheetModal,
  BottomSheetFlatList,
  BottomSheetBackdrop,
} from '@gorhom/bottom-sheet';
import { Box } from '../styling/Box';
import { Text } from '../styling/Text';
import { Button } from '../components/NewButton';

type SheetModalProps = {
  bottomSheetModalRef: React.RefObject<BottomSheetModal>;
  choicesList: string[];
  setChoice: React.Dispatch<React.SetStateAction<any>>;
  choice: string;
  sheetHeader: string;
};

export default function SheetModal({
  bottomSheetModalRef,
  choicesList,
  setChoice,
  choice,
  sheetHeader,
}: SheetModalProps) {
  const snapPoints = useMemo(() => ['50%'], []);

  const renderListItem = useCallback(
    ({ item }: { item: any }) => (
      <Button
        onPress={() => {
          if (choice === item) {
            setChoice('');
          } else {
            setChoice(item);
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
    [choice]
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
          {sheetHeader}
        </Text>
      </Box>
      <BottomSheetFlatList
        data={choicesList}
        renderItem={renderListItem}
        keyExtractor={(item) => item}
        contentContainerStyle={{ backgroundColor: 'white' }}
        style={{ paddingHorizontal: 10 }}
        showsVerticalScrollIndicator={false}
      />
    </BottomSheetModal>
  );
}
