import { Meal } from '@/data/types';
import { useData } from '@/providers/DataProvider';

export function useMeals() {
  const { repo, meals, setMeals } = useData();
  return {
    meals,
    addMeal: (m: Meal) => { setMeals((p) => [m, ...p]); repo.addMeal(m); },
    updateMeal: (m: Meal) => { setMeals((p) => p.map((x) => (x.id === m.id ? m : x))); repo.updateMeal(m); },
    deleteMeal: (id: string) => { setMeals((p) => p.filter((x) => x.id !== id)); repo.deleteMeal(id); },
  };
}
