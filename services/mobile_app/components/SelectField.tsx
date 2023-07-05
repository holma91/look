import React, {
  forwardRef,
  Ref,
  useRef,
  useImperativeHandle,
  useMemo,
} from 'react';
import { TouchableOpacity, View } from 'react-native';
import {
  BottomSheetBackdrop,
  BottomSheetFlatList,
  BottomSheetFooter,
  BottomSheetModal,
} from '@gorhom/bottom-sheet';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from '../styling/Text';
import { Box } from '../styling/Box';

export interface SelectFieldRef {
  presentOptions: () => void;
  dismissOptions: () => void;
}

export const SelectField = forwardRef(function SelectField(
  props: any,
  ref: Ref<SelectFieldRef>
) {
  const { options = [], multiple = true } = props;
  const sheet = useRef<BottomSheetModal>(null);
  const { bottom } = useSafeAreaInsets();

  useImperativeHandle(ref, () => ({ presentOptions, dismissOptions }));

  const snapPoints = useMemo(() => ['25%', '50%'], []);

  function presentOptions() {
    console.log('presentOptions');
    sheet.current?.present();
  }

  function dismissOptions() {
    console.log('dismissOptions');

    sheet.current?.dismiss();
  }

  return (
    <>
      <TouchableOpacity activeOpacity={1} onPress={presentOptions}>
        <Text>Hey</Text>
      </TouchableOpacity>

      <BottomSheetModal
        index={0}
        ref={sheet}
        snapPoints={snapPoints}
        stackBehavior="replace"
        enableDismissOnClose
        backdropComponent={(props) => (
          <BottomSheetBackdrop
            {...props}
            appearsOnIndex={0}
            disappearsOnIndex={-1}
          />
        )}
        footerComponent={
          !multiple
            ? undefined
            : (props) => (
                <BottomSheetFooter
                  {...props}
                  style={{ padding: 8 }}
                  bottomInset={bottom}
                >
                  <Text>Button</Text>
                </BottomSheetFooter>
              )
        }
      >
        <BottomSheetFlatList
          style={{ marginBottom: bottom + (multiple ? 56 : 0) }}
          data={options}
          keyExtractor={(o: any) => o.value}
          renderItem={({ item, index }) => (
            <Box>
              <Text>ListItem</Text>
            </Box>
          )}
        />
      </BottomSheetModal>
    </>
  );
});
