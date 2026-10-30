import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { Meal } from '@/data/types';
import { mono, radius, useColors } from '@/theme';

// Horizontal chips of recent distinct meals. Tap one to log it again.
export function LogAgain({ meals, onPick }: { meals: Meal[]; onPick: (m: Meal) => void }) {
  const c = useColors();
  const seen = new Set<string>();
  const recent = meals.filter((m) => (seen.has(m.name) ? false : (seen.add(m.name), true))).slice(0, 8);
  if (recent.length === 0) return null;
  return (
    <View style={{ gap: 8 }}>
      <Text style={{ color: c.sub, fontFamily: mono, fontSize: 12, fontWeight: '700', letterSpacing: 1 }}>LOG AGAIN</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
        {recent.map((m) => (
          <Pressable key={m.id} onPress={() => onPick(m)} style={({ pressed }) => ({ borderWidth: 1, borderColor: c.line, backgroundColor: c.card, borderRadius: radius.md, paddingHorizontal: 14, paddingVertical: 10, transform: [{ scale: pressed ? 0.97 : 1 }] })}>
            <Text style={{ color: c.ink, fontWeight: '600', fontSize: 14 }} numberOfLines={1}>{m.name}</Text>
            <Text style={{ color: c.sub, fontSize: 12, marginTop: 2 }}>{m.calories} kcal</Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}
