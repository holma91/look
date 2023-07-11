import { Button, SafeAreaView, Switch } from 'react-native';
import { useAuth } from '@clerk/clerk-expo';

import { Box } from '../styling/Box';
import { useContext } from 'react';
import { DemoContext } from '../context/Demo';
import { Text } from '../styling/Text';

const SignOut = () => {
  const { isLoaded, signOut } = useAuth();

  if (!isLoaded) {
    return null;
  }

  return (
    <Box>
      <Button
        title="Sign Out"
        onPress={() => {
          signOut();
        }}
      />
    </Box>
  );
};

export default function Profile() {
  const { isDemo, setIsDemo } = useContext(DemoContext);

  const toggleSwitch = () => setIsDemo((previousState) => !previousState);

  return (
    <Box backgroundColor="background" flex={1}>
      <SafeAreaView style={{ flex: 1 }}>
        <Box flex={1} alignItems="center" justifyContent="center" gap="m">
          <SignOut />
          <Box flexDirection="row" gap="m" alignItems="center">
            <Switch
              trackColor={{ false: '#767577', true: 'green' }}
              thumbColor={'#f4f3f4'}
              ios_backgroundColor="#3e3e3e"
              onValueChange={toggleSwitch}
              value={isDemo}
            />
            <Text variant="title">{isDemo ? 'Demo is on' : 'Demo is off'}</Text>
          </Box>
        </Box>
      </SafeAreaView>
    </Box>
  );
}
