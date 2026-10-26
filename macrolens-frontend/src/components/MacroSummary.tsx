import React from 'react';
import { Text, View } from 'react-native';
import { LiquidGlass } from '@/components/LiquidGlass';
import { Card } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { MetricKey, Targets, Tracked } from '@/data/types';
import { METRICS } from '@/lib/nutrition';
import { serif, text, useColors } from '@/theme';

export function MacroSummary({ targets, tracked, total }: { targets: Targets; tracked: Tracked; total: (k: MetricKey) => number }) {
  const c = useColors();
  const left = targets.calories - total('calories');
  const others = METRICS.filter((m) => m.key !== 'calories' && tracked[m.key]);
  return (
    <Card style={{ gap: 20 }}>
      {tracked.calories && (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 20 }}>
          <LiquidGlass pct={targets.calories ? total('calories') / targets.calories : 0} color={left < 0 ? c.accent : c.calories} />
          <View style={{ flex: 1 }}>
            <Text style={{ fontFamily: serif, fontSize: text.big, lineHeight: 60, color: left < 0 ? c.accent : c.ink }}>{Math.abs(left).toLocaleString()}</Text>
            <Text style={{ color: c.sub, fontSize: 15 }}>{left < 0 ? 'calories over' : 'calories left'}</Text>
            <Text style={{ color: c.sub, fontSize: 13, marginTop: 10 }}>{total('calories').toLocaleString()} of {targets.calories.toLocaleString()} today</Text>
          </View>
        </View>
      )}
      <View style={{ gap: 14 }}>
        {others.map((m) => (
          <View key={m.key}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ color: c.ink, fontSize: 15, fontWeight: '600' }}>{m.label}</Text>
              <Text style={{ color: c.sub, fontSize: 14 }}>{total(m.key)} / {targets[m.key]} {m.unit}</Text>
            </View>
            <ProgressBar pct={targets[m.key] ? total(m.key) / targets[m.key] : 0} color={c[m.key]} />
          </View>
        ))}
      </View>
    </Card>
  );
}
