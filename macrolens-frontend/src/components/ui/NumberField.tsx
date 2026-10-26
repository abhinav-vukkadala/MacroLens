import React from 'react';
import { Text, TextInput, View } from 'react-native';
import { radius, useColors } from '@/theme';

export function NumberField({ label, value, onChange, width = 80, editable = true, align = 'left' }: { label?: string; value: string; onChange: (v: number) => void; width?: number; editable?: boolean; align?: 'left' | 'right' }) {
  const c = useColors();
  return (
    <View>
      {label ? <Text style={{ color: c.sub, fontSize: 12, fontWeight: '700', letterSpacing: 0.5, marginBottom: 4 }}>{label}</Text> : null}
      <TextInput
        value={value}
        editable={editable}
        keyboardType="number-pad"
        onChangeText={(v) => onChange(Number(v.replace(/[^\d]/g, '')) || 0)}
        style={{ width, textAlign: align, color: c.ink, backgroundColor: c.card, borderColor: c.line, borderWidth: 1, borderRadius: radius.sm, paddingHorizontal: 12, paddingVertical: 10, fontSize: 16, opacity: editable ? 1 : 0.4 }}
      />
    </View>
  );
}
