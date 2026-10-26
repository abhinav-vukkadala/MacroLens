import React from 'react';
import { Pressable, Text } from 'react-native';
import { radius, useColors } from '@/theme';

export function Chip({ label, on, onPress }: { label: string; on: boolean; onPress: () => void }) {
  const c = useColors();
  return (
    <Pressable onPress={onPress} style={{ paddingHorizontal: 14, paddingVertical: 10, borderRadius: radius.pill, borderWidth: 1, borderColor: on ? c.accent : c.line, backgroundColor: on ? c.accent : c.card }}>
      <Text style={{ color: on ? c.onAccent : c.ink, fontWeight: '600', fontSize: 14 }}>{label}</Text>
    </Pressable>
  );
}
