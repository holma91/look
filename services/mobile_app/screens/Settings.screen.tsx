import { Button, SafeAreaView, Switch } from 'react-native';
import {
  createBox,
  createText,
  createRestyleComponent,
  createVariant,
  VariantProps,
} from '@shopify/restyle';
import { theme, darkTheme, Theme } from '../styling/theme';
import { useState } from 'react';

const Box = createBox<Theme>();
const Text = createText<Theme>();

// Basically, Card is a Box with that can take a variant prop
const Card = createRestyleComponent<
  VariantProps<Theme, 'cardVariants'> & React.ComponentProps<typeof Box>,
  Theme
>([createVariant({ themeKey: 'cardVariants' })], Box);

export default function Settings({ navigation }: { navigation: any }) {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <Box backgroundColor="background" flex={1}>
      <SafeAreaView style={{ flex: 1 }}>
        <Box flex={1} paddingHorizontal="m" marginTop="s" gap="s">
          <Card
            variant="primary"
            flexDirection="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Text variant="body">Toggle dark mode</Text>
            <Switch
              value={darkMode}
              onValueChange={(value: boolean) => setDarkMode(value)}
            />
          </Card>
        </Box>
      </SafeAreaView>
    </Box>
  );
}
