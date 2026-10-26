import { MetricKey } from '@/data/types';
import { sumMeals } from '@/lib/nutrition';
import { useMeals } from './useMeals';

export function useTodayTotals() {
  const { meals } = useMeals();
  const start = new Date().setHours(0, 0, 0, 0);
  const today = meals.filter((m) => m.ts >= start);
  return { today, total: (k: MetricKey) => sumMeals(today, k) };
}
