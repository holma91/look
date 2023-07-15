import { Keyboard } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

import { Box } from '../styling/Box';
import { TextInput } from '../styling/TextInput';

function SearchBar({
  navigation,
  searchText,
  setSearchText,
  handleSearch,
  setFocus,
  focus,
}: {
  navigation: any;
  searchText: string;
  setSearchText: React.Dispatch<React.SetStateAction<string>>;
  handleSearch: () => void;
  setFocus: React.Dispatch<React.SetStateAction<boolean>>;
  focus: boolean;
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
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
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
        />
        <Ionicons
          name="search"
          size={18}
          color="black"
          style={{ position: 'absolute', left: 15 }}
        />
      </Box>
      {focus ? (
        <Box flex={0} backgroundColor="grey" borderRadius={10} padding="xs">
          <Ionicons
            name="close"
            flex={0}
            size={24}
            color="black"
            onPress={() => {
              setFocus(false);
              Keyboard.dismiss();
            }}
          />
        </Box>
      ) : (
        <Ionicons
          name="ellipsis-vertical"
          flex={0}
          size={26}
          color="black"
          onPress={() => {}}
        />
      )}
    </Box>
  );
}

function WebviewSearchBar({
  navigation,
  webviewNavigation,
  searchText,
  setSearchText,
  handleSearch,
  setFocus,
  focus,
}: {
  navigation: any;
  webviewNavigation: any;
  searchText: string;
  setSearchText: React.Dispatch<React.SetStateAction<string>>;
  handleSearch: () => void;
  setFocus: React.Dispatch<React.SetStateAction<boolean>>;
  focus: boolean;
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
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
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
        />
        <Ionicons
          name="search"
          size={18}
          color="black"
          style={{ position: 'absolute', left: 15 }}
        />
        <Ionicons
          name="refresh"
          flex={0}
          size={18}
          color="black"
          style={{ position: 'absolute', right: 12 }}
          onPress={() => webviewNavigation('reload')}
        />
      </Box>

      {focus ? (
        <Box flex={0} backgroundColor="grey" borderRadius={10} padding="xs">
          <Ionicons
            name="close"
            flex={0}
            size={24}
            color="black"
            onPress={() => {
              setFocus(false);
              Keyboard.dismiss();
            }}
          />
        </Box>
      ) : (
        <Box flex={0} backgroundColor="grey" borderRadius={10} padding="xs">
          <Ionicons
            name="close"
            flex={0}
            size={24}
            color="black"
            onPress={() => {
              navigation.goBack();
            }}
          />
        </Box>
      )}
    </Box>
  );
}

export { SearchBar, WebviewSearchBar };
