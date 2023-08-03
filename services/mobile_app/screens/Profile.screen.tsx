import { SafeAreaView, Switch } from 'react-native';
import { useAuth, useUser } from '@clerk/clerk-expo';

import { Box } from '../styling/Box';
import { useContext } from 'react';
import { DemoContext } from '../context/Demo';
import { DarkModeContext } from '../context/DarkMode';
import { Text } from '../styling/Text';
import { clearHistory } from '../utils/history';
import { Button } from '../components/Buttons';
import { PrimaryButton } from '../components/Button';

export default function Profile() {
  const { user } = useUser();
  const { isLoaded, signOut } = useAuth();
  const { isDemo, setIsDemo } = useContext(DemoContext);
  const { isDarkMode, setIsDarkMode } = useContext(DarkModeContext);

  const toggles = [
    {
      title: 'Enable dark mode',
      description: 'Use Look with a dark interface.',
      function: () => setIsDarkMode((previousState) => !previousState),
      value: isDarkMode,
    },
    {
      title: 'Enable demo',
      description: 'Use the demo features of Look.',
      function: () => setIsDemo((previousState) => !previousState),
      value: isDemo,
    },
  ];

  const handleClearCache = async () => {
    try {
      await clearHistory();
      alert('Cache cleared successfully.');
    } catch (e) {
      console.error(e);
      alert('Failed to clear cache.');
    }
  };

  return (
    <Box backgroundColor="background" flex={1}>
      <SafeAreaView style={{ flex: 1 }}>
        <Box flex={1} paddingVertical="s" paddingHorizontal="m" gap="m">
          <Box
            gap="xs"
            borderBottomWidth={1}
            borderBottomColor="grey"
            paddingBottom="sm"
          >
            <Text variant="title">Account</Text>
            <Text variant="body">{user?.emailAddresses[0].emailAddress}</Text>
          </Box>
          <Box flex={1} justifyContent="space-between">
            <Box gap="m">
              {toggles.map((toggle) => (
                <Box
                  flexDirection="row"
                  key={toggle.title}
                  alignItems="center"
                  justifyContent="space-between"
                  // borderBottomWidth={1}
                  // borderBottomColor="grey"
                >
                  <Box paddingBottom="s" gap="xs">
                    <Text variant="smallTitle">{toggle.title}</Text>
                    <Text variant="body">{toggle.description}</Text>
                  </Box>
                  <Switch
                    trackColor={{ false: '#767577', true: 'green' }}
                    thumbColor={'#f4f3f4'}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={toggle.function}
                    value={toggle.value}
                  />
                </Box>
              ))}
            </Box>
            <Box marginBottom="s">
              {/* <Button title="Clear Cache" onPress={handleClearCache} /> */}
              <PrimaryButton label="Sign out" onPress={() => signOut()} />
            </Box>
          </Box>
        </Box>
      </SafeAreaView>
    </Box>
  );
}
