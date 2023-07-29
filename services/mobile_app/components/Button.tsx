import {
  ColorProps,
  createBox,
  useResponsiveProp,
  useTheme,
} from '@shopify/restyle';
import React from 'react';
import {
  ActivityIndicator,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

import { Text } from '../styling/Text';
import { Theme } from '../styling/theme';

const BaseButton = createBox<Theme, TouchableOpacityProps>(TouchableOpacity);

type Props = React.ComponentProps<typeof BaseButton> &
  ColorProps<Theme> & {
    label: string;
    // isLoading?: boolean;
  };

const PrimaryButton = ({ label, onPress, ...props }: Props) => {
  const theme = useTheme<Theme>();

  // here we can change stuff depending on the theme
  const bgColor = 'text';
  const color = 'background';

  return (
    <BaseButton
      flexDirection="row"
      // flex={1}
      justifyContent="center"
      alignItems="center"
      paddingVertical="m"
      paddingHorizontal="m"
      borderRadius={10}
      backgroundColor={bgColor}
      borderWidth={2}
      onPress={onPress}
      {...props}
    >
      <Text variant="buttonText" color={color}>
        {label}
      </Text>
      {/* {isLoading ? <ActivityIndicator color={color} /> : null} */}
    </BaseButton>
  );
};

const SecondaryButton = ({ label, ...props }: Props) => {
  const theme = useTheme<Theme>();

  const bgColor = 'background';
  const color = 'text';

  return (
    <BaseButton
      flexDirection="row"
      // flex={1}
      justifyContent="center"
      alignItems="center"
      paddingVertical="m"
      paddingHorizontal="m"
      borderRadius={10}
      backgroundColor={bgColor}
      borderWidth={2}
      {...props}
    >
      <Text variant="onBackground" color={color}>
        {label}
      </Text>
      {/* {isLoading ? <ActivityIndicator color={color} /> : null} */}
    </BaseButton>
  );
};

type TertiaryProps = React.ComponentProps<typeof BaseButton> &
  ColorProps<Theme> & {
    label: string;
    isSelected: boolean;
    item: string;
    // isLoading?: boolean;
  };

const FilterListButton = ({
  label,
  isSelected,
  item,
  ...props
}: TertiaryProps) => {
  const theme = useTheme<Theme>();

  return (
    <BaseButton
      flexDirection="row"
      flex={1}
      justifyContent="space-between"
      alignItems="center"
      paddingVertical="m"
      paddingHorizontal="m"
      borderRadius={10}
      backgroundColor={isSelected ? 'text' : 'grey'}
      margin="xs"
      {...props}
    >
      <Text
        variant="body"
        fontWeight="bold"
        fontSize={16}
        color={isSelected ? 'background' : 'text'}
      >
        {item}
      </Text>
      <Ionicons
        name="checkmark"
        size={20}
        color={isSelected ? 'white' : 'transparent'}
      />
      {item === 'New List' ? (
        <Ionicons name="add" size={20} color="black" />
      ) : null}
    </BaseButton>
  );
};

export { PrimaryButton, SecondaryButton, FilterListButton };
