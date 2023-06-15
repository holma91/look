import { TextInput as TextInputRN } from 'react-native';
import {
  VariantProps,
  createRestyleComponent,
  createVariant,
} from '@shopify/restyle';
import { Theme } from './theme';

export const TextInput = createRestyleComponent<
  VariantProps<Theme, 'inputVariants'> &
    React.ComponentProps<typeof TextInputRN>,
  Theme
>([createVariant({ themeKey: 'inputVariants' })], TextInputRN);
