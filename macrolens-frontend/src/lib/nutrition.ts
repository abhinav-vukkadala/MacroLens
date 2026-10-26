import { MealDraft, MetricKey, Meal, Profile, Targets } from '@/data/types';

export const METRICS: { key: MetricKey; label: string; unit: string }[] = [
  { key: 'calories', label: 'Calories', unit: 'kcal' },
  { key: 'protein', label: 'Protein', unit: 'g' },
  { key: 'carbs', label: 'Carbs', unit: 'g' },
  { key: 'fat', label: 'Fat', unit: 'g' },
];

// Mifflin-St Jeor estimate, then a goal adjustment. A starting point, not medical advice.
export function recommend(p: Profile): Targets {
  const kg = p.weightLb * 0.4536;
  const cm = p.heightIn * 2.54;
  const bmr = 10 * kg + 6.25 * cm - 5 * p.age + (p.sex === 'male' ? 5 : -161);
  const factor = { cut: 0.8, maintain: 1, bulk: 1.1 }[p.goal];
  const floor = p.sex === 'male' ? 1500 : 1200;
  const calories = Math.max(floor, Math.round((bmr * p.activity * factor) / 10) * 10);
  const protein = Math.round(kg * { cut: 2.2, maintain: 1.8, bulk: 2.0 }[p.goal]);
  const fat = Math.round((calories * 0.27) / 9);
  const carbs = Math.max(0, Math.round((calories - protein * 4 - fat * 9) / 4));
  return { calories, protein, carbs, fat };
}

export const sumMeals = (meals: Meal[], key: MetricKey) => meals.reduce((a, m) => a + m[key], 0);

export const scale = (d: MealDraft, servings: number): MealDraft => ({
  name: d.name,
  calories: Math.round(d.calories * servings),
  protein: Math.round(d.protein * servings),
  carbs: Math.round(d.carbs * servings),
  fat: Math.round(d.fat * servings),
});
