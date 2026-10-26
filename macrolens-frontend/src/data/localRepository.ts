import AsyncStorage from '@react-native-async-storage/async-storage';
import { Repository } from './repository';
import { Meal, Settings } from './types';

const SETTINGS = 'macrolens:settings';
const MEALS = 'macrolens:meals';

async function read<T>(key: string, fallback: T): Promise<T> {
  try {
    const raw = await AsyncStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export const localRepository: Repository = {
  getSettings: () => read<Settings | null>(SETTINGS, null),
  saveSettings: (s) => AsyncStorage.setItem(SETTINGS, JSON.stringify(s)),
  getMeals: () => read<Meal[]>(MEALS, []),
  addMeal: async (m) => AsyncStorage.setItem(MEALS, JSON.stringify([m, ...(await read<Meal[]>(MEALS, []))])),
  updateMeal: async (m) => AsyncStorage.setItem(MEALS, JSON.stringify((await read<Meal[]>(MEALS, [])).map((x) => (x.id === m.id ? m : x)))),
  deleteMeal: async (id) => AsyncStorage.setItem(MEALS, JSON.stringify((await read<Meal[]>(MEALS, [])).filter((x) => x.id !== id))),
};
