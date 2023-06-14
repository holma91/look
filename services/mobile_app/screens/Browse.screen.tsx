import { FlatList, Image, SafeAreaView } from 'react-native';
import {
  createBox,
  createText,
  createRestyleComponent,
  createVariant,
  VariantProps,
} from '@shopify/restyle';
import { Theme } from '../styling/theme';
import { Box } from '../styling/Box';
import { Text } from '../styling/Text';
import { useState } from 'react';

export default function Browse() {
  return (
    <Box backgroundColor="background" flex={1}>
      <SafeAreaView style={{ flex: 1 }}>
        <Box flex={1} paddingHorizontal="m" gap="s">
          <Text variant="title">url bar</Text>
        </Box>
      </SafeAreaView>
    </Box>
  );
}
