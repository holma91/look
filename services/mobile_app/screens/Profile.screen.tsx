import { SafeAreaView, Switch } from 'react-native';
import auth from '@react-native-firebase/auth';
import { Box, Text } from '../styling/RestylePrimitives';
import { useContext } from 'react';
import { DemoContext } from '../context/Demo';
import { DarkModeContext } from '../context/DarkMode';
import { PrimaryButton, SecondaryButton } from '../components/Button';
import { useFirebaseUser } from '../hooks/useFirebaseUser';

export default function Profile() {
  const { user } = useFirebaseUser();
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

  function handleSignOut() {
    auth()
      .signOut()
      .then(() => {
        console.log('User signed out!');
      })
      .catch((error) => {
        console.error('Error signing out:', error);
      });
  }

  function logToken() {
    auth()
      .currentUser?.getIdToken(true)
      .then((idToken) => {
        console.log(idToken);
      })
      .catch((error) => {
        console.log(error);
      });
  }

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
            <Text variant="body">{user?.email}</Text>
          </Box>
          <Box flex={1} justifyContent="space-between">
            <Box gap="m">
              {toggles.map((toggle) => (
                <Box
                  flexDirection="row"
                  key={toggle.title}
                  alignItems="center"
                  justifyContent="space-between"
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
            <Box marginBottom="s" gap="s">
              <SecondaryButton label="Log token" onPress={logToken} />
              <PrimaryButton label="Sign out" onPress={handleSignOut} />
            </Box>
          </Box>
        </Box>
      </SafeAreaView>
    </Box>
  );
}
