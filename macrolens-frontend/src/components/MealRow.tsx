import React from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import { Meal, Tracked } from '@/data/types';
import { METRICS } from '@/lib/nutrition';
import { radius, useColors } from '@/theme';

export function MealRow({ meal, tracked, onPress }: { meal: Meal; tracked: Tracked; onPress: () => void }) {
  const c = useColors();
  const summary = METRICS.filter((m) => tracked[m.key]).map((m) => (m.key === 'calories' ? `${meal.calories} kcal` : `${meal[m.key]}g ${m.label.toLowerCase()}`)).join('  ·  ');
  const thumb = { width: 56, height: 56, borderRadius: radius.sm };
  return (
    <Pressable onPress={onPress} style={({ pressed }) => ({ flexDirection: 'row', gap: 12, padding: 12, borderRadius: radius.md, borderWidth: 1, borderColor: c.line, backgroundColor: c.card, marginBottom: 8, alignItems: 'center', transform: [{ scale: pressed ? 0.98 : 1 }] })}>
      {meal.uri ? <Image source={{ uri: meal.uri }} style={thumb} /> : <View style={[thumb, { backgroundColor: c.line }]} />}
      <View style={{ flex: 1 }}>
        <Text style={{ color: c.ink, fontSize: 16, fontWeight: '600' }}>{meal.name}</Text>
        <Text style={{ color: c.sub, fontSize: 13, marginTop: 2 }}>{new Date(meal.ts).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })}</Text>
        <Text style={{ color: c.sub, fontSize: 13, marginTop: 4 }}>{summary}</Text>
      </View>
    </Pressable>
  );
}
