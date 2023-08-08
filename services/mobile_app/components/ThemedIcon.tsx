import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@shopify/restyle';
import { Theme } from '../styling/theme';
import { StyleProp, ViewStyle } from 'react-native';

type IconNames = (typeof Ionicons)['glyphMap'];

interface ThemedIconProps {
  name: keyof IconNames;
  size?: number;
  color?: keyof Theme['colors'];
  style?: StyleProp<ViewStyle>;
}

const ThemedIcon: React.FC<ThemedIconProps> = ({
  name,
  size = 28,
  color = 'text',
  style,
}) => {
  const theme = useTheme<Theme>();

  return (
    <Ionicons
      name={name}
      size={size}
      color={theme.colors[color]}
      style={style}
    />
  );
};

export default ThemedIcon;
