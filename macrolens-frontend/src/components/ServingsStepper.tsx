import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { useColors } from '@/theme';

export function ServingsStepper({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const c = useColors();
  const btn = (label: string, next: number) => (
    <Pressable onPress={() => onChange(Math.min(5, Math.max(0.5, next)))} style={{ width: 36, height: 36, borderRadius: 18, borderWidth: 1, borderColor: c.line, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ color: c.ink, fontSize: 20 }}>{label}</Text>
    </Pressable>
  );
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      {btn('-', value - 0.5)}
      <Text style={{ color: c.ink, width: 48, textAlign: 'center', fontSize: 16 }}>{value}</Text>
      {btn('+', value + 0.5)}
    </View>
  );
}
