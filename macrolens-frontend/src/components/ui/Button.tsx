import React from 'react';
import { Pressable, StyleProp, Text, ViewStyle } from 'react-native';
import { radius, useColors } from '@/theme';

export function Button({ label, onPress, variant = 'primary', disabled, style }: { label: string; onPress: () => void; variant?: 'primary' | 'outline'; disabled?: boolean; style?: StyleProp<ViewStyle> }) {
  const c = useColors();
  const primary = variant === 'primary';
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [{ borderRadius: radius.md, paddingVertical: 15, alignItems: 'center', backgroundColor: primary ? c.accent : 'transparent', borderWidth: primary ? 0 : 1, borderColor: c.line, opacity: disabled ? 0.4 : 1, transform: [{ scale: pressed ? 0.97 : 1 }] }, style]}>
      <Text style={{ color: primary ? c.onAccent : c.ink, fontSize: 16, fontWeight: '700' }}>{label}</Text>
    </Pressable>
  );
}
