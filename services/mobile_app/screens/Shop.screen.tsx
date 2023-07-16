import {
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  Keyboard,
} from 'react-native';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useUser } from '@clerk/clerk-expo';
import { Image as ExpoImage } from 'expo-image';

import { Box } from '../styling/Box';
import { Text } from '../styling/Text';
import { useMemo, useState } from 'react';
import { domainToInfo } from '../utils/utils';
import { SearchBar } from '../components/SearchBar';
import { favoriteCompany, fetchCompanies, unFavoriteCompany } from '../api';
import SearchList from '../components/SearchList';

type CompanyItem = {
  id: string;
  domains: string[];
  favorited: boolean;
};

export default function Shop({ navigation }: { navigation: any }) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchText, setSearchText] = useState('');
  const [focus, setFocus] = useState(false);
  const { user } = useUser();

  const { data: companies } = useQuery<CompanyItem[]>({
    queryKey: ['companies', user?.id],
    queryFn: () => fetchCompanies(user?.id as string),
    enabled: !!user?.id,
  });

  const handleSearch = () => {
    if (!companies?.some((company) => company.id.includes(searchText))) {
      navigation.navigate('Browser', { url: searchText });
    }
  };

  return (
    <Box backgroundColor="background" flex={1}>
      <SafeAreaView style={{ flex: 1 }}>
        <Box flex={1} gap="s">
          <SearchBar
            navigation={navigation}
            searchText={searchText}
            setSearchText={setSearchText}
            handleSearch={handleSearch}
            setFocus={setFocus}
            focus={focus}
          />
          {!focus ? (
            <>
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
                  navigation={navigation}
                  selectedCategory={selectedCategory}
                  companies={companies || []}
                  user={user}
                />
              </Box>
            </>
          ) : (
            <Box flex={1}>
              <SearchList
                navigation={navigation}
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
  navigation: any;
  selectedCategory: string;
  companies: CompanyItem[];
  user?: any;
};

function CompanyList({
  navigation,
  selectedCategory,
  companies,
  user,
}: CompanyListProps) {
  const [renderToggle, setRenderToggle] = useState(false);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (company: CompanyItem) => {
      if (!user?.id) return;

      if (!company.favorited) {
        return unFavoriteCompany(user.id, company.id);
      } else {
        return favoriteCompany(user.id, company.id);
      }
    },
    onMutate: async (company: CompanyItem) => {
      company.favorited = !company.favorited;

      await queryClient.cancelQueries({ queryKey: ['companies', user?.id] });

      const previousCompany = queryClient.getQueryData([
        'companies',
        company.id,
      ]);

      queryClient.setQueryData(['companies', company.id], company);

      return { previousCompany, company };
    },
    onError: (err, company, context) => {
      console.log('mutation error', err, company, context);
      queryClient.setQueryData(
        ['companies', context?.company.id],
        context?.previousCompany
      );
    },
    onSettled: async () => {
      setRenderToggle(!renderToggle);

      queryClient.invalidateQueries({ queryKey: ['companies', user?.id] });
    },
  });

  const filteredSites = useMemo(() => {
    let filtered;
    if (selectedCategory === 'Favorites') {
      filtered = companies.filter((company) => company.favorited);
    } else if (selectedCategory === 'Multi-brand') {
      filtered = companies.filter(
        (company) => domainToInfo[company.id].multiBrand
      );
    } else if (selectedCategory === 'High-end') {
      filtered = companies.filter(
        (company) => domainToInfo[company.id].highEnd
      );
    } else if (selectedCategory === 'Second-hand') {
      filtered = companies.filter(
        (company) => domainToInfo[company.id].secondHand
      );
    } else {
      filtered = companies;
    }
    return filtered;
  }, [selectedCategory, companies, renderToggle]);

  return (
    <FlatList<CompanyItem>
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
            onPress={() =>
              navigation.navigate('Browser', { url: item.domains[0] })
            }
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
                source={domainToInfo[item.id].icon}
                contentFit="contain"
              />
              <Box gap="s">
                <Text variant="body" fontWeight={'bold'}>
                  {domainToInfo[item.id].name}
                </Text>
                <Text variant="body">{item.domains[0]}</Text>
              </Box>
            </Box>
          </TouchableOpacity>
          <Ionicons
            name={item.favorited ? 'ios-star' : 'ios-star-outline'}
            flex={0}
            size={24}
            color="black"
            onPress={() => {
              mutation.mutate(item);
            }}
          />
        </Box>
      )}
      keyExtractor={(company) => company.id}
    />
  );
}
