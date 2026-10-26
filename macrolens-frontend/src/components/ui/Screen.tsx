import React from 'react';
import { ScrollView, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { space, useColors } from '@/theme';

export function Screen({ children, gap = space.lg }: { children: React.ReactNode; gap?: number }) {
  const c = useColors();
  const insets = useSafeAreaInsets();
  const content: ViewStyle = { padding: space.xl, paddingTop: insets.top + space.lg, paddingBottom: 48, gap, width: '100%', maxWidth: 640, alignSelf: 'center' };
  return <ScrollView style={{ backgroundColor: c.bg }} contentContainerStyle={content} keyboardShouldPersistTaps="handled">{children}</ScrollView>;
}
