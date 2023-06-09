import * as React from 'react';
import { TouchableOpacity } from 'react-native';
import {
  SpacingProps,
  BorderProps,
  BackgroundColorProps,
  VariantProps,
  createRestyleComponent,
  createVariant,
} from '@shopify/restyle';

import { Text } from '../styling/Text';
import { Box } from '../styling/Box';
import { Theme } from '../styling/theme';

const buttonVariant: any = createVariant({ themeKey: 'buttonVariants' });
const ButtonContainer = createRestyleComponent<
  VariantProps<Theme, 'buttonVariants'> & React.ComponentProps<typeof Box>,
  Theme
>([buttonVariant], Box);

type Props = {
  onPress: () => void;
  label: string;
  variant: 'primary' | 'secondary';
};

export const Button = ({ label, onPress, variant }: Props) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <ButtonContainer variant={variant}>
        <Text textAlign="center" fontWeight="bold" fontSize={18} variant="body">
          {label}
        </Text>
      </ButtonContainer>
    </TouchableOpacity>
  );
};
