import { Href, useRouter } from 'expo-router';
import React from 'react';
import { Text, View } from 'react-native';
import { DayReceipt } from '@/components/DayReceipt';
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
        <View key={day} style={{ marginTop: 20 }}>
          <DayReceipt title={day} meals={items} tracked={tracked} onPressMeal={(m) => router.push(`/meal/${m.id}` as Href)} />
        </View>
      ))}
    </Screen>
  );
}
