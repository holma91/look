import { TouchableOpacity, Keyboard } from 'react-native';

import { Box, TextInput } from '../styling/RestylePrimitives';
import ThemedIcon from './ThemedIcon';
import { useTheme } from '@shopify/restyle';
import { getDomain } from '../utils/helpers';

function SearchBar({
  searchText,
  setSearchText,
  handleSearch,
  setFocus,
  focus,
}: {
  searchText: string;
  setSearchText: React.Dispatch<React.SetStateAction<string>>;
  handleSearch: () => void;
  setFocus: React.Dispatch<React.SetStateAction<boolean>>;
  focus: boolean;
}) {
  const theme = useTheme();

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
        backgroundColor="searchBackground"
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
          placeholderTextColor={theme.colors.searchText}
        />
        <ThemedIcon
          name="search"
          size={18}
          color="searchText"
          style={{ position: 'absolute', left: 15 }}
        />
      </Box>
      {focus ? (
        <Box
          flex={0}
          backgroundColor="searchBackground"
          borderRadius={10}
          padding="xs"
        >
          <TouchableOpacity
            onPress={() => {
              setFocus(false);
              setSearchText('');
              Keyboard.dismiss();
            }}
          >
            <ThemedIcon
              name="close"
              size={24}
              color="searchText"
              style={{ flex: 0 }}
            />
          </TouchableOpacity>
        </Box>
      ) : null}
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
  url,
}: {
  navigation: any;
  webviewNavigation: any;
  searchText: string;
  setSearchText: React.Dispatch<React.SetStateAction<string>>;
  handleSearch: () => void;
  setFocus: React.Dispatch<React.SetStateAction<boolean>>;
  focus: boolean;
  url: string;
}) {
  const theme = useTheme();
  const domain = getDomain(url);

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
        backgroundColor="searchBackground"
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
          placeholder={domain ?? 'Search and shop anywhere'}
          placeholderTextColor={theme.colors.searchText}
        />
        <ThemedIcon
          name="search"
          size={18}
          color="searchText"
          style={{ position: 'absolute', left: 15 }}
        />

        <TouchableOpacity
          onPress={() => webviewNavigation('reload')}
          style={{ position: 'absolute', right: 12 }}
        >
          <ThemedIcon
            name="refresh"
            size={18}
            color="searchText"
            style={{ flex: 0 }}
          />
        </TouchableOpacity>
      </Box>

      {focus ? (
        <Box
          flex={0}
          backgroundColor="searchBackground"
          borderRadius={10}
          padding="xs"
        >
          <TouchableOpacity
            onPress={() => {
              setFocus(false);
              Keyboard.dismiss();
            }}
          >
            <ThemedIcon
              name="close"
              size={24}
              color="searchText"
              style={{ flex: 0 }}
            />
          </TouchableOpacity>
        </Box>
      ) : (
        <Box
          flex={0}
          backgroundColor="searchBackground"
          borderRadius={10}
          padding="xs"
        >
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}
          >
            <ThemedIcon
              name="close"
              size={24}
              color="searchText"
              style={{ flex: 0 }}
            />
          </TouchableOpacity>
        </Box>
      )}
    </Box>
  );
}

export { SearchBar, WebviewSearchBar };
