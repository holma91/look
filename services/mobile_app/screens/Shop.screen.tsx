import { FlatList, SafeAreaView, TouchableOpacity } from 'react-native';
import { Image as ExpoImage } from 'expo-image';
import * as Haptics from 'expo-haptics';

import { Box, Text } from '../styling/RestylePrimitives';
import { useEffect, useMemo, useState } from 'react';
import { companyToInfo } from '../utils/info';
import { SearchBar } from '../components/SearchBar';
import { Company } from '../utils/types';
import SearchList from '../components/SearchList';
import {
  clearHistory,
  getHistory,
  saveHistory,
} from '../utils/storage/history';
import ThemedIcon from '../components/ThemedIcon';
import { useCompaniesQuery } from '../hooks/queries/useCompaniesQuery';
import { useFavCompanyMutation } from '../hooks/mutations/useFavCompanyMutation';

export default function Shop({ navigation }: { navigation: any }) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [currentDomain, setCurrentDomain] = useState<string>('');
  const [history, setHistory] = useState<string[]>([]);
  const [searchText, setSearchText] = useState('');
  const [focus, setFocus] = useState(false);

  const { data: companies } = useCompaniesQuery();

  const navigateToSite = async (company: Company) => {
    await saveHistory(company.id);
    const domain = company.domains[0];
    navigation.navigate('Browser', { url: domain });
    setCurrentDomain(domain);
  };

  const handleSearch = () => {
    if (!companies?.some((company) => company.id.includes(searchText))) {
      const company = companies?.find((company) =>
        company.id.includes(searchText)
      );
      if (company) {
        navigateToSite(company);
      }
    }
  };

  const handleClearHistory = async () => {
    await clearHistory();
    setHistory([]);
  };

  useEffect(() => {
    async function fetchHistory() {
      const fetchedHistory = await getHistory();
      setHistory(fetchedHistory);
    }

    fetchHistory();
  }, [currentDomain]);

  return (
    <Box backgroundColor="background" flex={1}>
      <SafeAreaView style={{ flex: 1 }}>
        <Box flex={1} gap="s">
          <SearchBar
            searchText={searchText}
            setSearchText={setSearchText}
            handleSearch={handleSearch}
            setFocus={setFocus}
            focus={focus}
          />
          {!focus ? (
            <>
              {history.length > 0 ? (
                <Box gap="m" paddingBottom="s" paddingTop="s">
                  <Box
                    flexDirection="row"
                    justifyContent="space-between"
                    paddingHorizontal="m"
                  >
                    <Text variant="title">History</Text>
                    <TouchableOpacity onPress={handleClearHistory}>
                      <Text variant="body" fontWeight="600">
                        Clear
                      </Text>
                    </TouchableOpacity>
                  </Box>
                  <FlatList
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    data={history}
                    contentContainerStyle={{ paddingLeft: 18 }}
                    keyExtractor={(item, index) => `history-${index}`}
                    renderItem={({ item }) => {
                      const company = companies?.find((c) => c.id === item);
                      return (
                        <TouchableOpacity
                          onPress={() => navigateToSite(company as Company)}
                          style={{
                            paddingRight: 10,
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: 10,
                          }}
                        >
                          <ExpoImage
                            style={{
                              justifyContent: 'center',
                              alignItems: 'center',
                              height: 45,
                              width: 45,
                            }}
                            source={companyToInfo[item].icon}
                            contentFit="contain"
                          />
                        </TouchableOpacity>
                      );
                    }}
                  />
                </Box>
              ) : null}
              <Box flexDirection="row" gap="m" marginVertical="s">
                <FlatList
                  style={{ flex: 1, gap: 10 }}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  data={[
                    { label: 'Favorites' },
                    { label: 'All' },
                    { label: 'High-end' },
                    { label: 'Multi-brand' },
                    { label: 'Second-hand' },
                    { label: 'Other' },
                  ]}
                  contentContainerStyle={{ paddingLeft: 18 }}
                  keyExtractor={(item, index) => `category-${index}`}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      onPress={() => setSelectedCategory(item.label)}
                      style={{
                        marginRight: 16,
                        borderBottomWidth:
                          selectedCategory === item.label ? 2 : 0,
                        borderColor: 'black',
                      }}
                    >
                      <Text
                        variant="body"
                        fontWeight={'bold'}
                        paddingBottom="s"
                        color={
                          selectedCategory === item.label ? 'text' : 'text'
                        }
                      >
                        {item.label}
                      </Text>
                    </TouchableOpacity>
                  )}
                />
              </Box>
              <Box flex={1}>
                <CompanyList
                  navigateToSite={navigateToSite}
                  selectedCategory={selectedCategory}
                  companies={companies || []}
                />
              </Box>
            </>
          ) : (
            <Box flex={1}>
              <SearchList
                navigateToSite={navigateToSite}
                searchText={searchText}
                setFocus={setFocus}
              />
            </Box>
          )}
        </Box>
      </SafeAreaView>
    </Box>
  );
}

type CompanyListProps = {
  navigateToSite: any;
  selectedCategory: string;
  companies: Company[];
};

function CompanyList({
  navigateToSite,
  selectedCategory,
  companies,
}: CompanyListProps) {
  const [renderToggle, setRenderToggle] = useState(false);

  const favCompanyMutation = useFavCompanyMutation(setRenderToggle);

  const filteredSites = useMemo(() => {
    let filtered;
    if (selectedCategory === 'Favorites') {
      filtered = companies.filter((company) => company.favorited);
    } else if (selectedCategory === 'Multi-brand') {
      filtered = companies.filter(
        (company) => companyToInfo[company.id].multiBrand
      );
    } else if (selectedCategory === 'High-end') {
      filtered = companies.filter(
        (company) => companyToInfo[company.id].highEnd
      );
    } else if (selectedCategory === 'Second-hand') {
      filtered = companies.filter(
        (company) => companyToInfo[company.id].secondHand
      );
    } else {
      filtered = companies;
    }
    return filtered;
  }, [selectedCategory, companies, renderToggle]);

  return (
    <FlatList<Company>
      data={filteredSites}
      renderItem={({ item, index }) => (
        <Box
          flexDirection="row"
          alignItems="center"
          borderColor="grey"
          paddingHorizontal="m"
          paddingVertical="s"
        >
          <TouchableOpacity
            onPress={async () => {
              navigateToSite(item);
            }}
            style={{ flex: 1 }}
          >
            <Box flexDirection="row" alignItems="center" gap="l" flex={1}>
              <ExpoImage
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: 40,
                  width: 40,
                }}
                source={companyToInfo[item.id].icon}
                contentFit="contain"
              />
              <Box gap="s">
                <Text variant="body" fontWeight={'bold'}>
                  {companyToInfo[item.id].name}
                </Text>
                <Text variant="body">{item.domains[0]}</Text>
              </Box>
            </Box>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              favCompanyMutation.mutate(item);
            }}
          >
            <ThemedIcon
              name={item.favorited ? 'ios-star' : 'ios-star-outline'}
              size={24}
              color="text"
            />
          </TouchableOpacity>
        </Box>
      )}
      keyExtractor={(company) => company.id}
    />
  );
}
