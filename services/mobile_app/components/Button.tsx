import * as React from 'react';
import { TouchableOpacity } from 'react-native';
import {
  VariantProps,
  createRestyleComponent,
  createVariant,
} from '@shopify/restyle';
import { Image as ExpoImage } from 'expo-image';

import { Text } from '../styling/Text';
import { Box } from '../styling/Box';
import { Theme } from '../styling/theme';
import FontistoIcons from '@expo/vector-icons/Fontisto';

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
        <Text textAlign="center" fontWeight="bold" {...rest}>
          {label}
        </Text>
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
