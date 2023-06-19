import { SafeAreaView } from 'react-native-safe-area-context';
import SignInWithOAuth from '../components/SignInWithOAuth';
import { Box } from '../styling/Box';

export default function SignUpOrIn() {
  return (
    <Box backgroundColor="background" flex={1}>
      <SafeAreaView style={{ flex: 1 }}>
        <Box flex={1} alignItems="center" justifyContent="center">
          <SignInWithOAuth />
        </Box>
      </SafeAreaView>
    </Box>
  );
}
