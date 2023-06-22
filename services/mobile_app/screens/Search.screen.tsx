import { SafeAreaView } from 'react-native-safe-area-context';
import { SearchBar } from '../components/SearchBar';
import { Box } from '../styling/Box';
import { Text } from '../styling/Text';

export default function Search({ navigation }: { navigation: any }) {
  return (
    <Box backgroundColor="background" flex={1}>
      <SafeAreaView style={{ flex: 1 }}>
        <Box flex={1} gap="s" alignItems="center">
          <SearchBar navigation={navigation} isFakeSearchBar={false} />
          <Text>Search Screen</Text>
        </Box>
      </SafeAreaView>
    </Box>
  );
}
