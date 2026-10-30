import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { Leader } from '@/components/ui/Leader';
import { Dashes, Paper } from '@/components/ui/Paper';
import { Meal, Tracked } from '@/data/types';
import { sumMeals } from '@/lib/nutrition';
import { mono } from '@/theme';
import { paper } from '@/theme/colors';

const t = (size: number, extra: object = {}) => ({ fontFamily: mono, color: paper.ink, fontSize: size, ...extra });

// One receipt for a set of meals: items, per-item macros, and a total.
export function DayReceipt({ title, meals, tracked, onPressMeal }: { title: string; meals: Meal[]; tracked: Tracked; onPressMeal: (m: Meal) => void }) {
  const macros = (m: Pick<Meal, 'protein' | 'carbs' | 'fat'>) => [tracked.protein && `P${m.protein}`, tracked.carbs && `C${m.carbs}`, tracked.fat && `F${m.fat}`].filter(Boolean).join('  ');
  const totals = { protein: sumMeals(meals, 'protein'), carbs: sumMeals(meals, 'carbs'), fat: sumMeals(meals, 'fat') };
  return (
    <Paper>
      <Text style={t(15, { textAlign: 'center', fontWeight: '700', letterSpacing: 2 })}>{title.toUpperCase()}</Text>
      <Dashes />
      {meals.length === 0 && <Text style={t(13, { textAlign: 'center', opacity: 0.6, marginVertical: 8 })}>NOTHING ORDERED YET</Text>}
      {meals.map((m) => (
        <Pressable key={m.id} onPress={() => onPressMeal(m)} style={({ pressed }) => ({ marginVertical: 5, opacity: pressed ? 0.6 : 1 })}>
          <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
            <Text style={t(15, { flexShrink: 1, fontWeight: '700' })} numberOfLines={1}>{m.name.toUpperCase()}</Text>
            <Leader />
            {tracked.calories && <Text style={t(15, { fontWeight: '700' })}>{m.calories}</Text>}
          </View>
          <Text style={t(12, { color: paper.sub })}>{new Date(m.ts).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })}   {macros(m)}</Text>
        </Pressable>
      ))}
      {meals.length > 0 && (
        <>
          <Dashes />
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <Text style={t(13, { fontWeight: '700' })}>TOTAL</Text>
            {tracked.calories && <Text style={t(22, { fontWeight: '700' })}>{sumMeals(meals, 'calories')} KCAL</Text>}
          </View>
          <Text style={t(13, { color: paper.sub, textAlign: 'right' })}>{macros(totals)}</Text>
        </>
      )}
    </Paper>
  );
}
