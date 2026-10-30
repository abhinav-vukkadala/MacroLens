import { Meal, Settings, WeightEntry } from './types';

// Screens never touch storage directly. Swap the implementation (local, Supabase) behind this interface.
export interface Repository {
  getSettings(): Promise<Settings | null>;
  saveSettings(s: Settings): Promise<void>;
  getMeals(): Promise<Meal[]>;
  addMeal(m: Meal): Promise<void>;
  updateMeal(m: Meal): Promise<void>;
  deleteMeal(id: string): Promise<void>;
  getWeights(): Promise<WeightEntry[]>;
  addWeight(w: WeightEntry): Promise<void>;
  deleteWeight(id: string): Promise<void>;
}
