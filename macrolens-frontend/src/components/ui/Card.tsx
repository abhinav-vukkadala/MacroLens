import React from 'react';
import { View, ViewStyle } from 'react-native';
import { radius, space, useColors } from '@/theme';

export function Card({ children, style }: { children: React.ReactNode; style?: ViewStyle }) {
  const c = useColors();
  return <View style={[{ backgroundColor: c.card, borderColor: c.line, borderWidth: 1, borderRadius: radius.lg, padding: space.xl }, style]}>{children}</View>;
}
