import React from 'react';
import { View, ViewStyle } from 'react-native';
import { paper } from '@/theme/colors';
import { Rule } from './Leader';

const TEETH = 12;

export const Dashes = Rule;

export function Teeth() {
  return (
    <View style={{ height: TEETH, flexDirection: 'row', justifyContent: 'space-between', overflow: 'hidden' }}>
      {Array.from({ length: 22 }).map((_, i) => (
        <View key={i} style={{ width: TEETH, height: TEETH, backgroundColor: paper.bg, transform: [{ rotate: '45deg' }, { translateY: -TEETH / 1.4 }] }} />
      ))}
    </View>
  );
}

// A sheet of receipt paper with a torn bottom edge.
export function Paper({ children, style }: { children: React.ReactNode; style?: ViewStyle }) {
  return (
    <View>
      <View style={[{ backgroundColor: paper.bg, padding: 20, shadowColor: '#3A2E1C', shadowOpacity: 0.18, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 3 }, style]}>{children}</View>
      <Teeth />
    </View>
  );
}
