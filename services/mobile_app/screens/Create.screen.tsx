import { SafeAreaView, Image, FlatList, View } from 'react-native';
import { createBox, createText } from '@shopify/restyle';
import { Theme } from '../styling/theme';
import { useState } from 'react';
import { Button } from '../components/Button';

const Box = createBox<Theme>();
const Text = createText<Theme>();

export default function Create({ navigation }: { navigation: any }) {
  const handleCreate = () => {
    console.log('create');
  };

  const images = Array.from({ length: 25 }).map((_, i) => ({
    id: i,
    uri: 'https://images.aftonbladet-cdn.se/v2/images/4300bf71-b377-4f97-b9bc-f61480b03ae0?fit=crop&format=auto&h=1024&q=50&w=683&s=4f632c05d43adbda308dd6813236a17699649f7e',
  }));

  return (
    <Box backgroundColor="background" flex={1}>
      <SafeAreaView style={{ flex: 1 }}>
        <Box
          flex={1}
          paddingHorizontal="m"
          gap="s"
          justifyContent="space-between"
          marginVertical="m"
        >
          <Box
            borderColor="primary"
            borderWidth={2}
            borderRadius={10}
            flex={1}
            padding="m"
          >
            <Text
              variant="body"
              fontWeight="bold"
              fontSize={18}
              marginBottom="m"
              marginHorizontal="s"
            >
              Your photos
            </Text>
            <FlatList
              data={images}
              renderItem={({ item }) => (
                <View
                  style={{
                    flex: 1,
                    flexDirection: 'column',
                    margin: 3,
                    borderRadius: 10,
                  }}
                >
                  <Image
                    style={{
                      justifyContent: 'center',
                      alignItems: 'center',
                      height: 100,
                      width: 100,
                      borderRadius: 5,
                    }}
                    source={{ uri: item.uri }}
                  />
                </View>
              )}
              numColumns={3}
              keyExtractor={(item) => item.id.toString()}
            />
          </Box>

          <Button
            label="click"
            onPress={handleCreate}
            variant="primary"
          ></Button>
        </Box>
      </SafeAreaView>
    </Box>
  );
}
