import { SafeAreaView, Switch } from 'react-native';
import {
  createBox,
  createText,
  createRestyleComponent,
  createVariant,
  VariantProps,
  useTheme,
} from '@shopify/restyle';
import { Theme } from '../styling/theme';
import { useState } from 'react';
import { Button } from '../components/Button';

const Box = createBox<Theme>();
const Text = createText<Theme>();

export default function Create({ navigation }: { navigation: any }) {
  const handleCreate = () => {
    console.log('create');
  };
  return (
    <Box backgroundColor="background" flex={1}>
      <SafeAreaView style={{ flex: 1 }}>
        <Box
          flex={1}
          paddingHorizontal="m"
          gap="s"
          justifyContent="space-between"
          marginVertical="m"
        >
          <Text variant="header">Create</Text>
          <Button
            label="click"
            onPress={handleCreate}
            variant="primary"
          ></Button>
        </Box>
      </SafeAreaView>
    </Box>
  );
}
