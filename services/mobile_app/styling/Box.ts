import {
  ActivityIndicator,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native';
import { createBox } from '@shopify/restyle';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Theme } from './theme';

export const Box = createBox<Theme>();

export const BaseButton = createBox<Theme, TouchableOpacityProps>(
  TouchableOpacity
);
