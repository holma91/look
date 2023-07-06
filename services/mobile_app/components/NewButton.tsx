import { TouchableOpacity } from 'react-native';
import {
  SpacingProps,
  BorderProps,
  BackgroundColorProps,
  createVariant,
  createRestyleComponent,
  VariantProps,
} from '@shopify/restyle';

import { Text } from '../styling/Text';
import { Theme, theme } from '../styling/theme';
import { Box } from '../styling/Box';

type RestyleProps = SpacingProps<Theme> &
  BorderProps<Theme> &
  BackgroundColorProps<Theme>;

type Props = RestyleProps & {
  onPress: () => void;
  children: React.ReactNode;
  variant: 'new' | 'primary' | 'secondary';
};

const buttonVariant: any = createVariant({ themeKey: 'buttonVariants' });

// ButtonContainer is just a Box with buttonVariant applied
const ButtonContainer = createRestyleComponent<
  VariantProps<Theme, 'buttonVariants'> & React.ComponentProps<typeof Box>,
  Theme
>([buttonVariant], Box);

// ...rest is the additional props (in practice, it's the styles!) that we want to pass to the surrounding Box

export const Button = ({ onPress, children, variant, ...rest }: Props) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <ButtonContainer variant={variant} {...rest}>
        {children}
      </ButtonContainer>
    </TouchableOpacity>
  );
};
