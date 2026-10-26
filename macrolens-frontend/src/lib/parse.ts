import { MealDraft } from '@/data/types';
 
const num = (v: unknown) => Math.round(parseFloat(String(v).replace(/[^\d.]/g, '')) || 0);
 
// Tolerates code fences or extra text around the model's JSON.
export function parseResult(raw: unknown): MealDraft {
  const text = typeof raw === 'string' ? raw : JSON.stringify(raw);
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) throw new Error('No JSON in model response');
  const d = JSON.parse(match[0]);
  return { name: String(d.foodName ?? 'Meal'), calories: num(d.calories), protein: num(d.protein), carbs: num(d.carbs), fat: num(d.fats ?? d.fat) };
}