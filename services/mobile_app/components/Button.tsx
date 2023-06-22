import * as React from 'react';
import { TouchableOpacity } from 'react-native';
import {
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
  variant: 'primary' | 'secondary' | 'tertiary';
};

export const Button = ({ label, onPress, variant, ...rest }: Props | any) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <ButtonContainer variant={variant}>
        <Text
          textAlign="center"
          fontWeight="bold"
          // fontSize={18}
          // variant="onBackground"
          {...rest}
        >
          {label}
        </Text>
      </ButtonContainer>
    </TouchableOpacity>
  );
};
