import AsyncStorage from '@react-native-async-storage/async-storage';

async function saveHistory(domain: string): Promise<void> {
  try {
    let rawHistory = await AsyncStorage.getItem('@history');
    let history: string[];
    if (rawHistory !== null) {
      history = JSON.parse(rawHistory);
    } else {
      history = [];
    }

    const domainIndex = history.indexOf(domain);
    if (domainIndex !== -1) {
      history.splice(domainIndex, 1);
    }

    history.unshift(domain);

    await AsyncStorage.setItem('@history', JSON.stringify(history));
  } catch (e) {
    console.error(e);
  }
}

async function getHistory(): Promise<string[]> {
  try {
    const history = await AsyncStorage.getItem('@history');
    return history ? JSON.parse(history) : [];
  } catch (e) {
    console.error(e);
    return [];
  }
}

async function clearHistory(): Promise<void> {
  try {
    await AsyncStorage.removeItem('@history');
  } catch (e) {
    console.error(e);
  }
}

export { saveHistory, getHistory, clearHistory };
