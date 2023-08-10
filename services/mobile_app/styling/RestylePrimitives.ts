import {
  ScrollView,
  ScrollViewProps,
  TouchableOpacity,
  TouchableOpacityProps,
  TextInput as TextInputRN,
} from 'react-native';
import {
  createBox,
  createText,
  VariantProps,
  createRestyleComponent,
  createVariant,
} from '@shopify/restyle';
import { Theme } from './theme';

export const Box = createBox<Theme>();

export const Text = createText<Theme>();

export const TextInput = createRestyleComponent<
  VariantProps<Theme, 'inputVariants'> &
    React.ComponentProps<typeof TextInputRN>,
  Theme
>([createVariant({ themeKey: 'inputVariants' })], TextInputRN);

export const BaseButton = createBox<Theme, TouchableOpacityProps>(
  TouchableOpacity
);

export const ScrollBox = createBox<Theme, ScrollViewProps>(ScrollView);
