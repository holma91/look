import { useTheme } from '@shopify/restyle';
import Animated from 'react-native-reanimated';

type CustomBackdropProps = {
  animatedIndex: Animated.SharedValue<number>;
  dismiss: () => void;
};

export const CustomBackdrop: React.FC<CustomBackdropProps> = ({
  animatedIndex,
  dismiss,
}) => {
  const theme = useTheme();

  return (
    <Animated.View
      onTouchStart={dismiss}
      style={{
        position: 'absolute',
        bottom: 86, // height of the NavBar
        left: 0,
        right: 0,
        top: 0,
        backgroundColor: theme.colors.backdropColor || 'rgba(0,0,0,0.5)',
        opacity: 1, // todo: make this animated
      }}
    />
  );
};
