import React from 'react';
import { Text, View } from 'react-native';
import { mono } from '@/theme';
import { paper } from '@/theme/colors';

export interface Bar { label: string; value: number }

// Simple bar chart drawn with Views. `min` lets weight charts zoom in instead of starting at zero.
export function BarChart({ data, color, target, min = 0, height = 120 }: { data: Bar[]; color: string; target?: number; min?: number; height?: number }) {
  const max = Math.max(...data.map((d) => d.value), target ?? 0, min + 1);
  const pct = (v: number) => Math.max(0.04, (v - min) / (max - min));
  return (
    <View>
      <View style={{ height, flexDirection: 'row', alignItems: 'flex-end', gap: 4 }}>
        {data.map((d, i) => (
          <View key={i} style={{ flex: 1, height: d.value ? pct(d.value) * height : 3, backgroundColor: d.value ? color : paper.sub, opacity: d.value ? 1 : 0.3, borderTopLeftRadius: 3, borderTopRightRadius: 3 }} />
        ))}
        {target ? <View pointerEvents="none" style={{ position: 'absolute', left: 0, right: 0, bottom: pct(target) * height, borderTopWidth: 1, borderColor: paper.ink, opacity: 0.6 }} /> : null}
      </View>
      <View style={{ flexDirection: 'row', gap: 4, marginTop: 4 }}>
        {data.map((d, i) => <Text key={i} style={{ flex: 1, textAlign: 'center', fontFamily: mono, fontSize: 9, color: paper.sub }}>{d.label}</Text>)}
      </View>
    </View>
  );
}
