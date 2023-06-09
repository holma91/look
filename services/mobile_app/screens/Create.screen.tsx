import { Button, SafeAreaView, Switch } from 'react-native';
import {
  createBox,
  createText,
  createRestyleComponent,
  createVariant,
  VariantProps,
  useTheme,
} from '@shopify/restyle';
import { Theme } from '../theme';
import { useState } from 'react';

const Box = createBox<Theme>();
const Text = createText<Theme>();

const Card = createRestyleComponent<
  VariantProps<Theme, 'cardVariants'> & React.ComponentProps<typeof Box>,
  Theme
>([createVariant({ themeKey: 'cardVariants' })], Box);

export default function Create({ navigation }: { navigation: any }) {
  return (
    <Box backgroundColor="background" flex={1}>
      <SafeAreaView style={{ flex: 1 }}>
        <Box flex={1} paddingHorizontal="m" gap="s">
          <Text variant="header">Create</Text>
        </Box>
      </SafeAreaView>
    </Box>
  );
}
