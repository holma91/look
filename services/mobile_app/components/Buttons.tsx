import { TouchableOpacity } from 'react-native';
import {
  SpacingProps,
  BorderProps,
  BackgroundColorProps,
  createVariant,
  createRestyleComponent,
  VariantProps,
} from '@shopify/restyle';
import { Image as ExpoImage } from 'expo-image';
import FontistoIcons from '@expo/vector-icons/Fontisto';

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

type LoginButtonProps = {
  label: string;
  onPress: () => void;
};

const GoogleButton = ({ label, onPress }: LoginButtonProps) => (
  <TouchableOpacity
    onPress={onPress}
    style={{
      backgroundColor: 'black',
      paddingVertical: 18,
      width: '80%',
      borderRadius: 5,
      flexDirection: 'row',
      gap: 16,
      alignItems: 'center',
      justifyContent: 'center',
      marginVertical: 5,
      paddingLeft: 10,
    }}
  >
    <ExpoImage
      source={require('../assets/logos/google.png')}
      style={{ width: 21, height: 21 }}
    />
    <Text variant="body" color="background" fontSize={16} fontWeight="600">
      {label}
    </Text>
  </TouchableOpacity>
);

const AppleButton = ({ label, onPress }: LoginButtonProps) => (
  <TouchableOpacity
    onPress={onPress}
    style={{
      backgroundColor: 'black',
      paddingVertical: 15,
      width: '80%',
      borderRadius: 5,
      flexDirection: 'row',
      gap: 16,
      alignItems: 'center',
      justifyContent: 'center',
      marginVertical: 5,
    }}
  >
    <FontistoIcons
      name="apple"
      size={22}
      color="white"
      style={{ paddingBottom: 5 }}
    />
    <Text variant="body" color="background" fontSize={16} fontWeight="600">
      {label}
    </Text>
  </TouchableOpacity>
);

export { GoogleButton, AppleButton };
