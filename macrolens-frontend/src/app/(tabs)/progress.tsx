import React, { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { BarChart } from '@/components/BarChart';
import { Button } from '@/components/ui/Button';
import { Leader, Rule } from '@/components/ui/Leader';
import { NumberField } from '@/components/ui/NumberField';
import { Paper } from '@/components/ui/Paper';
import { Screen } from '@/components/ui/Screen';
import { useMeals } from '@/hooks/useMeals';
import { useProfile } from '@/hooks/useProfile';
import { useWeights } from '@/hooks/useWeights';
import { sumMeals } from '@/lib/nutrition';
import { mono, serif, text, useColors } from '@/theme';
import { paper } from '@/theme/colors';

const DAY = 86_400_000;
const t = (size: number, extra: object = {}) => ({ fontFamily: mono, color: paper.ink, fontSize: size, ...extra });

export default function Progress() {
  const c = useColors();
  const { targets, tracked, profile } = useProfile();
  const { meals } = useMeals();
  const { weights, addWeight, deleteWeight } = useWeights();
  const [lb, setLb] = useState(profile?.weightLb ?? 160);

  const start = new Date().setHours(0, 0, 0, 0);
  const days = Array.from({ length: 7 }, (_, i) => start - (6 - i) * DAY);
  const kcal = days.map((d) => ({ label: new Date(d).toLocaleDateString(undefined, { weekday: 'narrow' }), value: sumMeals(meals.filter((m) => m.ts >= d && m.ts < d + DAY), 'calories') }));
  const logged = kcal.filter((d) => d.value > 0);
  const avg = logged.length ? Math.round(logged.reduce((a, d) => a + d.value, 0) / logged.length) : 0;

  const recent = [...weights].slice(0, 14).reverse();
  const change = weights.length > 1 ? Math.round((weights[0].lb - weights[weights.length - 1].lb) * 10) / 10 : 0;
  const floor = recent.length ? Math.min(...recent.map((w) => w.lb)) - 5 : 0;

  return (
    <Screen>
      <Text style={{ color: c.ink, fontFamily: serif, fontSize: text.title }}>Progress</Text>

      <Paper>
        <Text style={t(15, { textAlign: 'center', fontWeight: '700', letterSpacing: 2 })}>WEIGHT LOG</Text>
        <Rule />
        <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 12 }}>
          <NumberField label="TODAY (LB)" value={String(lb)} onChange={setLb} />
          <Button label="Log weight" onPress={() => lb >= 50 && lb <= 700 && addWeight(lb)} style={{ flex: 1, paddingVertical: 12 }} />
        </View>
        {recent.length > 1 && (
          <View style={{ marginTop: 16 }}>
            <BarChart data={recent.map((w) => ({ label: String(new Date(w.ts).getDate()), value: w.lb }))} color={c.protein} min={floor} />
            <Text style={t(13, { color: paper.sub, marginTop: 8 })}>{change === 0 ? 'NO CHANGE SINCE FIRST ENTRY' : `${change > 0 ? '+' : ''}${change} LB SINCE FIRST ENTRY`}</Text>
          </View>
        )}
        {weights.slice(0, 5).map((w) => (
          <Pressable key={w.id} onLongPress={() => deleteWeight(w.id)} style={{ flexDirection: 'row', alignItems: 'flex-end', marginTop: 8 }}>
            <Text style={t(13)}>{new Date(w.ts).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }).toUpperCase()}</Text>
            <Leader size={13} />
            <Text style={t(13, { fontWeight: '700' })}>{w.lb} LB</Text>
          </Pressable>
        ))}
        {weights.length > 0 && <Text style={t(11, { color: paper.sub, marginTop: 10 })}>HOLD A LINE TO DELETE IT</Text>}
      </Paper>

      {tracked.calories && targets && (
        <Paper>
          <Text style={t(15, { textAlign: 'center', fontWeight: '700', letterSpacing: 2 })}>LAST 7 DAYS</Text>
          <Rule />
          <BarChart data={kcal} color={c.calories} target={targets.calories} />
          <Text style={t(13, { color: paper.sub, marginTop: 10 })}>{avg ? `AVG ${avg} KCAL ON LOGGED DAYS. LINE = YOUR ${targets.calories} TARGET.` : 'LOG MEALS TO SEE YOUR WEEK.'}</Text>
        </Paper>
      )}
    </Screen>
  );
}
