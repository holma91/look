import Ionicons from '@expo/vector-icons/Ionicons';

import { Box } from '../styling/Box';
import { TextInput } from '../styling/TextInput';

function SearchBar({
  navigation,
  searchText,
  setSearchText,
  handleSearch,
}: {
  navigation: any;
  searchText: string;
  setSearchText: React.Dispatch<React.SetStateAction<string>>;
  handleSearch: () => void;
}) {
  // Function to navigate to the SearchScreen

  return (
    <Box
      flex={0}
      flexDirection="row"
      alignItems="center"
      gap="s"
      paddingBottom="s"
      paddingHorizontal="sm"
    >
      <Box
        flex={1}
        backgroundColor="grey"
        borderRadius={10}
        flexDirection="row"
        alignItems="center"
        paddingHorizontal="m"
        paddingVertical="xxxs"
      >
        <TextInput
          onChangeText={setSearchText}
          value={searchText}
          onSubmitEditing={handleSearch}
          autoCapitalize="none"
          autoComplete="off"
          autoCorrect={false}
          inputMode="url"
          variant="secondary"
          selectTextOnFocus={true}
          placeholder="Search and shop anywhere"
          placeholderTextColor="black"
          autoFocus={true}
        />
        <Ionicons
          name="search"
          size={18}
          color="black"
          style={{ position: 'absolute', left: 15 }}
        />
      </Box>
      <Box flex={0} backgroundColor="grey" borderRadius={10} padding="xs">
        <Ionicons
          name="close"
          flex={0}
          size={24}
          color="black"
          onPress={() => navigation.goBack()}
        />
      </Box>
    </Box>
  );
}

function FakeSearchBar({ navigation }: { navigation: any }) {
  const handleOnPress = () => {
    navigation.navigate('Search');
  };
  return (
    <Box
      flex={0}
      flexDirection="row"
      alignItems="center"
      gap="s"
      paddingBottom="s"
      paddingHorizontal="m"
    >
      <Box
        flex={1}
        backgroundColor="grey"
        borderRadius={20}
        flexDirection="row"
        alignItems="center"
        paddingHorizontal="m"
        paddingVertical="xxxs"
      >
        <TextInput
          onTouchStart={handleOnPress}
          autoCapitalize="none"
          autoComplete="off"
          autoCorrect={false}
          inputMode="url"
          variant="secondary"
          selectTextOnFocus={true}
          placeholder="Search and shop anywhere"
          placeholderTextColor="black"
          autoFocus={false}
        />
        <Ionicons
          name="search"
          size={18}
          color="black"
          style={{ position: 'absolute', left: 15 }}
        />
      </Box>
      <Box flex={0} backgroundColor="background" borderRadius={20} padding="xs">
        <Ionicons
          name="ellipsis-vertical"
          flex={0}
          size={24}
          color="black"
          onPress={() => {}}
        />
      </Box>
    </Box>
  );
}

function FakeSearchBarBrowser({
  navigation,
  domain,
}: {
  navigation: any;
  domain: string;
}) {
  const handleOnPress = () => {
    navigation.navigate('Search');
  };
  return (
    <Box
      flex={0}
      flexDirection="row"
      alignItems="center"
      gap="s"
      paddingBottom="s"
      paddingHorizontal="sm"
    >
      <Box
        flex={1}
        backgroundColor="grey"
        borderRadius={10}
        flexDirection="row"
        alignItems="center"
        paddingHorizontal="m"
        paddingVertical="xxxs"
      >
        <TextInput
          onTouchStart={handleOnPress}
          autoCapitalize="none"
          autoComplete="off"
          autoCorrect={false}
          inputMode="url"
          variant="secondary"
          selectTextOnFocus={true}
          placeholder="Search and shop anywhere"
          placeholderTextColor="black"
          autoFocus={false}
          value={domain}
        />
        <Ionicons
          name="search"
          size={18}
          color="black"
          style={{ position: 'absolute', left: 15 }}
        />
      </Box>
      {/* <Box flex={0} backgroundColor="grey" borderRadius={10} padding="xs"> */}
      <Ionicons
        name="ellipsis-vertical"
        flex={0}
        size={26}
        color="black"
        onPress={() => navigation.goBack()}
      />
      {/* </Box> */}
    </Box>
  );
}

type BrowserSearchBar = {
  setSearch: (search: string) => void;
  search: string;
  handleSearch: () => void;
  navigation: any;
  webviewNavigation: (direction: 'back' | 'forward' | 'reload') => void;
};

function BrowserSearchBar({
  setSearch,
  search,
  handleSearch,
  navigation,
  webviewNavigation,
}: BrowserSearchBar) {
  return (
    <Box
      flex={0}
      flexDirection="row"
      alignItems="center"
      gap="s"
      paddingBottom="s"
      paddingHorizontal="m"
    >
      <Box
        flex={1}
        backgroundColor="grey"
        borderRadius={20}
        flexDirection="row"
        alignItems="center"
        paddingHorizontal="m"
        paddingVertical="xxs"
      >
        <TextInput
          onChangeText={setSearch}
          value={search}
          autoCapitalize="none"
          autoComplete="off"
          autoCorrect={false}
          inputMode="url"
          variant="primary"
          onSubmitEditing={handleSearch}
          selectTextOnFocus={true}
        />
        <Ionicons
          name="refresh"
          flex={0}
          size={24}
          color="black"
          onPress={() => webviewNavigation('reload')}
        />
      </Box>
      <Box flex={0} backgroundColor="grey" borderRadius={20} padding="xs">
        <Ionicons
          name="close"
          flex={0}
          size={24}
          color="black"
          onPress={() => navigation.goBack()}
        />
      </Box>
    </Box>
  );
}

export { SearchBar, FakeSearchBar, BrowserSearchBar, FakeSearchBarBrowser };
