import { Button, SafeAreaView } from 'react-native';
import { useAuth } from '@clerk/clerk-expo';

import { Box } from '../styling/Box';

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
  return (
    <Box backgroundColor="background" flex={1}>
      <SafeAreaView style={{ flex: 1 }}>
        <Box flex={1} alignItems="center" justifyContent="center">
          <SignOut />
        </Box>
      </SafeAreaView>
    </Box>
  );
}
