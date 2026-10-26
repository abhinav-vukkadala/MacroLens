import { Href, useRouter } from 'expo-router';
import React from 'react';
import { Text, View } from 'react-native';
import { MealRow } from '@/components/MealRow';
import { Screen } from '@/components/ui/Screen';
import { Meal } from '@/data/types';
import { useMeals } from '@/hooks/useMeals';
import { useProfile } from '@/hooks/useProfile';
import { serif, text, useColors } from '@/theme';

const dayLabel = (ts: number) => new Date(ts).toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' });

export default function History() {
  const c = useColors();
  const router = useRouter();
  const { meals } = useMeals();
  const { tracked } = useProfile();

  const groups = new Map<string, Meal[]>();
  meals.forEach((m) => groups.set(dayLabel(m.ts), [...(groups.get(dayLabel(m.ts)) ?? []), m]));

  return (
    <Screen gap={0}>
      <Text style={{ color: c.ink, fontFamily: serif, fontSize: text.title, marginBottom: 8 }}>History</Text>
      {meals.length === 0 && <Text style={{ color: c.sub, marginTop: 8 }}>Nothing logged yet. Meals you add from the Today tab show up here.</Text>}
      {[...groups].map(([day, items]) => (
        <View key={day}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20, marginBottom: 8 }}>
            <Text style={{ color: c.sub, fontWeight: '600', textTransform: 'uppercase', fontSize: 13, letterSpacing: 0.4 }}>{day}</Text>
            {tracked.calories && <Text style={{ color: c.sub, fontSize: 13 }}>{items.reduce((a, m) => a + m.calories, 0)} kcal</Text>}
          </View>
          {items.map((m) => <MealRow key={m.id} meal={m} tracked={tracked} onPress={() => router.push(`/meal/${m.id}` as Href)} />)}
        </View>
      ))}
    </Screen>
  );
}
