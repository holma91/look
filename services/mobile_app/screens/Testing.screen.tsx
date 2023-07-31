import Ionicons from '@expo/vector-icons/Ionicons';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { HoldItem } from 'react-native-hold-menu';

const MenuItems = [
  { text: 'Actions', icon: 'home', isTitle: true, onPress: () => {} },
  { text: 'Action 1', icon: 'edit', onPress: () => {} },
  { text: 'Action 2', icon: 'map-pin', withSeparator: true, onPress: () => {} },
  { text: 'Action 3', icon: 'trash', isDestructive: true, onPress: () => {} },
];

const SampleList = [
  { text: 'Reply', onPress: () => {} },
  { text: 'Edit', onPress: () => {} },
  { text: 'Delete', onPress: () => {} },
];

const SampleList2 = [
  { text: 'Action', isTitle: true, onPress: () => {} },
  {
    text: 'Home',
    icon: () => <Ionicons name="home" size={18} />,
    onPress: () => {},
  },
  {
    text: 'Edit',
    icon: () => <Ionicons name="pencil" size={18} />,
    onPress: () => {},
  },
  {
    text: 'Delete',
    icon: () => <Ionicons name="remove" size={18} />,
    withSeparator: true,
    isDestructive: true,
    onPress: () => {},
  },
  {
    text: 'Share',
    icon: () => <Ionicons name="share" size={18} />,
    onPress: () => {},
  },
  {
    text: 'More',
    icon: () => <Ionicons name="menu" size={18} />,
    onPress: () => {},
  },
];

export default function Testing() {
  return (
    <View style={styles.container}>
      <HoldItem items={SampleList} menuAnchorPosition="top-center">
        <View style={styles.item} />
      </HoldItem>
      <HoldItem items={SampleList2} activateOn="tap" bottom={true}>
        <View style={{ backgroundColor: 'yellow', width: 100, height: 50 }} />
      </HoldItem>
      <HoldItem
        items={SampleList2}
        activateOn="tap"
        menuAnchorPosition="top-right"
      >
        <View style={{ backgroundColor: 'green', width: 100, height: 50 }} />
      </HoldItem>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'black',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 100,
  },
  item: {
    width: 100,
    height: 50,
    backgroundColor: 'blue',
  },
  text: {
    color: 'white',
    fontSize: 40,
    fontWeight: 'bold',
  },
});
