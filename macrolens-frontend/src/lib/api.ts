import { MealDraft } from '@/data/types';
import { parseResult } from './parse';

const API = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:8000';

export async function analyzeFood(base64: string): Promise<MealDraft> {
  const res = await fetch(`${API}/api/analyze-food`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ base64_image: base64 }),
  });
  if (!res.ok) throw new Error(`Server returned ${res.status}`);
  return parseResult((await res.json()).raw_response);
}
