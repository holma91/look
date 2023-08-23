import { SafeAreaView, TouchableOpacity } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { Image as ExpoImage } from 'expo-image';
import * as Haptics from 'expo-haptics';
import { HoldItem } from 'react-native-hold-menu';

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
import { useClistsQuery } from '../hooks/queries/useClistsQuery';
import { capitalizeFirstLetter } from '../utils/helpers';
import { useAddCompaniesMutation } from '../hooks/mutations/companies/useAddCompaniesMutation';
import { useDeleteCompaniesMutation } from '../hooks/mutations/companies/useDeleteCompaniesMutation';
import { useTheme } from '@shopify/restyle';

export default function Shop({ navigation }: { navigation: any }) {
  const [selectedClist, setSelectedClist] = useState('all');
  const [currentDomain, setCurrentDomain] = useState<string>('');
  const [history, setHistory] = useState<Company[]>([]);
  const [searchText, setSearchText] = useState('');
  const [focus, setFocus] = useState(false);

  const theme = useTheme();
  const { data: companies } = useCompaniesQuery(selectedClist);
  const { data: clists } = useClistsQuery();

  const clistIds = useMemo(() => {
    if (clists) {
      return clists.map((clist) => clist.id).filter((id) => id !== 'favorites');
    }
    return [];
  }, [clists]);

  const navigateToSite = async (company: Company) => {
    await saveHistory(company);
    setSearchText('');
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
                  <FlashList
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    data={history}
                    contentContainerStyle={{ paddingLeft: 18 }}
                    keyExtractor={(item, index) => `history-${index}`}
                    estimatedItemSize={149}
                    renderItem={({ item: company }) => {
                      // const company = companies?.find((c) => c.id === item);
                      console.log('company:', company);

                      return (
                        <TouchableOpacity
                          onPress={() => navigateToSite(company)}
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
                            source={companyToInfo[company.id].icon}
                            contentFit="contain"
                          />
                        </TouchableOpacity>
                      );
                    }}
                  />
                </Box>
              ) : null}
              <Box flexDirection="row" gap="m" marginVertical="s">
                <FlashList
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  data={['all', 'favorites'].concat(clistIds)}
                  contentContainerStyle={{ paddingLeft: 18 }}
                  keyExtractor={(item, index) => `category-${index}`}
                  estimatedItemSize={218}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      onPress={() => {
                        setSelectedClist(item);
                      }}
                      style={{
                        marginRight: 16,
                        borderBottomWidth: selectedClist === item ? 2 : 0,
                        borderColor: theme.colors.text,
                      }}
                    >
                      <Text
                        variant="body"
                        fontWeight={'bold'}
                        paddingBottom="s"
                        color={selectedClist === item ? 'text' : 'text'}
                      >
                        {capitalizeFirstLetter(item)}
                      </Text>
                    </TouchableOpacity>
                  )}
                />
              </Box>
              <Box flex={1}>
                <CompanyList
                  navigateToSite={navigateToSite}
                  selectedClist={selectedClist}
                  companies={companies || []}
                  clistIds={clistIds}
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
  selectedClist: string;
  companies: Company[];
  clistIds: string[];
};

function CompanyList({
  navigateToSite,
  selectedClist,
  companies,
  clistIds,
}: CompanyListProps) {
  return (
    <FlashList<Company>
      data={companies ?? []}
      keyExtractor={(company) => company.id}
      estimatedItemSize={390}
      renderItem={({ item }) => (
        <CompanyBox
          item={item}
          navigateToSite={navigateToSite}
          selectedClist={selectedClist}
          clistIds={clistIds}
        />
      )}
    />
  );
}

type CompanyBoxProps = {
  item: Company;
  navigateToSite: any;
  selectedClist: string;
  clistIds: string[];
};

function CompanyBox({
  item,
  navigateToSite,
  selectedClist,
  clistIds,
}: CompanyBoxProps) {
  const addCompaniesMutation = useAddCompaniesMutation(selectedClist);
  const deleteCompaniesMutation = useDeleteCompaniesMutation(selectedClist);

  const relevantClistIds = useMemo(() => {
    return clistIds.filter((clistId) => clistId !== selectedClist);
  }, [clistIds, selectedClist]);

  const AddToClistChoices = relevantClistIds.map((clistId) => {
    return {
      text: `Add to ${capitalizeFirstLetter(clistId)}`,
      icon: () => <ThemedIcon name="add" size={18} />,
      onPress: () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        addCompaniesMutation.mutate({
          listId: clistId,
          companies: [item],
        });
      },
      actionParams: {
        key: clistId,
      },
    };
  });

  const CompanyMenu = [
    {
      text: item.favorited ? 'Unfavorite' : 'Favorite',
      icon: () => (
        <ThemedIcon
          name={item.favorited ? 'ios-star' : 'ios-star-outline'}
          size={18}
        />
      ),
      onPress: () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        if (item.favorited) {
          deleteCompaniesMutation.mutate({
            listId: 'favorites',
            companies: [item],
          });
        } else {
          addCompaniesMutation.mutate({
            listId: 'favorites',
            companies: [item],
          });
        }
      },
      actionParams: {
        key: item.id,
      },
    },
    ...AddToClistChoices,
    ...(selectedClist !== 'all' && selectedClist !== 'favorites'
      ? [
          {
            text: 'Delete from list',
            icon: () => <ThemedIcon name="remove" size={18} />,
            onPress: () => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
              deleteCompaniesMutation.mutate({
                listId: selectedClist,
                companies: [item],
              });
            },
            isDestructive: true,
          },
        ]
      : []),
  ];

  return (
    <HoldItem items={CompanyMenu}>
      <Box
        flexDirection="row"
        alignItems="center"
        borderColor="grey"
        paddingHorizontal="m"
        height={63}
        backgroundColor="background"
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
            if (item.favorited) {
              deleteCompaniesMutation.mutate({
                listId: 'favorites',
                companies: [item],
              });
            } else {
              addCompaniesMutation.mutate({
                listId: 'favorites',
                companies: [item],
              });
            }
          }}
        >
          <ThemedIcon
            name={item.favorited ? 'ios-star' : 'ios-star-outline'}
            size={24}
            color="text"
          />
        </TouchableOpacity>
      </Box>
    </HoldItem>
  );
}
