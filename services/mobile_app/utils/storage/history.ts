import AsyncStorage from '@react-native-async-storage/async-storage';
import { Company } from '../types';

async function saveHistory(company: Company): Promise<void> {
  try {
    let rawHistory = await AsyncStorage.getItem('@history');
    let history: Company[];
    if (rawHistory !== null) {
      history = JSON.parse(rawHistory);
    } else {
      history = [];
    }

    // Find the index of the company with the same id
    const companyIndex = history.findIndex((c) => c.id === company.id);
    if (companyIndex !== -1) {
      history.splice(companyIndex, 1);
    }

    history.unshift(company);

    await AsyncStorage.setItem('@history', JSON.stringify(history));
  } catch (e) {
    console.error(e);
  }
}

async function saveHistoryOld(company: string): Promise<void> {
  try {
    let rawHistory = await AsyncStorage.getItem('@history');
    let history: string[];
    if (rawHistory !== null) {
      history = JSON.parse(rawHistory);
    } else {
      history = [];
    }

    const domainIndex = history.indexOf(company);
    if (domainIndex !== -1) {
      history.splice(domainIndex, 1);
    }

    history.unshift(company);

    await AsyncStorage.setItem('@history', JSON.stringify(history));
  } catch (e) {
    console.error(e);
  }
}

async function getHistory(): Promise<Company[]> {
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
