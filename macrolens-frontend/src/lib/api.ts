import { MealDraft } from '@/data/types';
import { parseResult } from './parse';

const API = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:8000';

export async function analyzeFood(base64: string): Promise<MealDraft> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 40_000);
  try {
    const res = await fetch(`${API}/api/analyze-food`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ base64_image: base64 }),
      signal: ctrl.signal,
    });
    if (res.status === 429) throw new Error('rate');
    if (!res.ok) throw new Error(`status ${res.status}`);
    const json = await res.json();
    return parseResult(json.raw_response ?? json);
  } finally {
    clearTimeout(timer);
  }
}
